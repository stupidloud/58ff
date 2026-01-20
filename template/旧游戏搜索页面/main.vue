<template>
  <div class="h-[98dvh] flex flex-col relative z-10 bg-[var(--color-bg-main)] overflow-hidden">
    <CommonHeader>
      Slots
    </CommonHeader>

    <!-- 主内容区域 -->
    <main class="flex-1 flex flex-col text-white min-h-0">
      <!-- 搜索框 - 固定不滚动 -->
      <div class="w-full p-[1rem] mb-[1rem] flex-shrink-0">
        <SearchBox
          placeholder="Pesquisar jogos"
          class="w-full h-11"
          bgColor="var(--color-primary)"
          @search="handleSearch"
        />
      </div>

      <!-- 内容区域 - 左侧栏和右侧内容区独立滚动 -->
      <div class="flex flex-1 px-4 w-full max-w-[516px] mx-auto overflow-hidden min-h-0">
        <!-- 左侧栏 - 独立滚动 -->
        <div class="left w-[7.5rem] flex-shrink-0 overflow-y-auto pb-[8rem] pr-[0.2rem] h-full">
          <!-- 全部游戏按钮 - Slots -->
          <Button
            :variant="selectedProviderId === null ? 'primary' : ''"
            rounded="2xl"
            class="block w-full py-[1.1rem] mb-4 shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgba(0,0,0,0.1)]"
            :class="selectedProviderId !== null ? 'bg-[var(--color-bg-primary)]' : ''"
            @click="selectProvider(null)"
          >
            <div class="flex items-center justify-center">
              <img :src="getConstantAssetUrl('/icons/slots.png')" alt="Slots" class="w-auto h-[2.5rem]">
            </div>
            Slots
          </Button>

          <!-- 加载状态 -->
          <div v-if="loading && providers.length === 0" class="text-center py-4">
            <div class="text-[var(--color-inactive)] text-xs">Carregando...</div>
          </div>

          <!-- 游戏提供商 -->
          <Button
            v-for="provider in providers"
            :key="provider.id"
            :variant="selectedProviderId === provider.id ? 'primary' : ''"
            rounded="2xl"
            class="block w-full py-[1.1rem] mb-4 shadow-[0.1rem_0.1rem_0.1rem_0.1rem_rgba(0,0,0,0.1)]"
            :class="selectedProviderId !== provider.id ? 'bg-[var(--color-bg-primary)]' : ''"
            @click="selectProvider(provider.id)"
          >
            <div class="flex items-center justify-center">
              <img
                :src="getConstantAssetUrl(provider.image) || getConstantAssetUrl('/game_providers/default.png')"
                :alt="provider.name"
                class="w-auto h-[2.5rem]"
              >
            </div>
            <div class="text-xs mt-1">{{ provider.name }}</div>
          </Button>
        </div>
        <!-- 右侧内容区 -->
        <div class="flex-1 ml-[1rem] flex flex-col h-full overflow-hidden">
          <!-- 顶部切换 -->
          <div class="flex items-center mb-[1rem] flex-shrink-0">
            <div
            @click="changeCustomNav(item.key)"
            class="w-[7.5rem] h-[2.6rem] mr-[1rem] flex items-center justify-center rounded-2xl text-[1.1rem] px-[.5rem] text-center leading-[1.2rem]"
            v-for="item in customNav" :key="item.key"
            :class="nowCustomNav == item.key ? 'bg-[var(--color-active)] text-[var(--color-bg-primary)]' : 'bg-[var(--color-bg-primary)] text-[var(--color-highlight-text)]'"
            >
              {{ item.label }}
            </div>
          </div>
          <!-- 独立滚动 -->
          <div class="right flex-1 overflow-y-auto pb-[8rem]">
            <!-- 加载状态 -->
            <div v-if="loading" class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="text-[var(--color-inactive)]">Carregando jogos...</div>
              </div>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="error" class="flex items-center justify-center h-64">
              <div class="text-center">
                <div class="text-red-500 mb-4">{{ error }}</div>
                <button
                  @click="retryLoadData()"
                  class="px-4 py-2 bg-blue-500 text-white rounded text-sm"
                >
                  Tentar novamente
                </button>
              </div>
            </div>

            <!-- Slots游戏网格 -->
            <div v-else class="grid grid-cols-3 gap-[1rem]">
              <!-- 游戏卡片 -->
              <div
                v-for="game in paginatedSlots"
                :key="game.id"
                class="bg-[var(--color-bg-primary)] rounded-[1rem] overflow-hidden"
                @click="launchGame(game.id)"
              >
                <GameCardWithGif
                  :game="game"
                  container-class="text-[1em]"
                  @toggle-favourite="toggleFavourite(game.id)"
                />
              </div>
            </div>

            <!-- 空状态 -->
            <div v-if="!loading && !error && paginatedSlots.length === 0" class="flex items-center justify-center h-64">
              <div class="text-center">
                <div
                  class="w-16 h-16 mx-auto mb-4 bg-[var(--color-bg-primary)] rounded-full flex items-center justify-center">
                  <svg class="w-8 h-8 text-[var(--color-inactive)]" fill="currentColor">
                    <use xlink:href="#icon_dtfl_dz_0--svgSprite:all"></use>
                  </svg>
                </div>
                <p class="text-[var(--color-inactive)]">Nenhum jogo encontrado</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- 底栏 - 分页组件 -->
    <footer class="fixed bottom-0 w-full max-w-[516px] z-10 bg-[var(--color-bg-primary)]">
      <div class="flex justify-center pl-[6.5rem] pt-4 pb-8">
        <Pagination :current-page="currentPage" :total-pages="totalPages" @page-change="handlePageChange" />
      </div>
    </footer>
  </div>

  <!-- 游戏加载组件 -->
  <Spinner :visible="isGameLoading" text="Carregando jogo..." />
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import Button from '../ui/Button.vue'
import SearchBox from '../ui/SearchBox.vue'
import Pagination from '../ui/Pagination.vue'
import Spinner from '../ui/Spinner.vue'
import GameCardWithGif from '../common/GameCardWithGif.vue'
import { gameApi, playerApi, type GameProvider } from '../../services/api'
import { gameStorage, type GameData } from '../../services/gameStorage'
import { preloadService, type PreloadStatus } from '../../services/preloadService'
import { GameUrlEncoder } from '../../utils/gameUrlEncoder'
import { eventBus } from '../../utils/eventBus'
import { $toast } from '../../components/common/toast'
import { $confirm } from '../../components/common/confirmDialog'
import { getConstantAssetUrl } from '../../utils/assets'

// 定义props(接收从App.vue传递的属性,但不使用)
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// 定义emits(接收从App.vue传递的事件监听器,但不使用)
defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

// 路由实例
const router = useRouter()
const route = useRoute()

// Vuex store
const store = useStore()

// 登录状态
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])



// 响应式数据
const loading = ref(true)
const error = ref('')
const providers = ref<GameProvider[]>([])
const games = ref<GameData[]>([])
const selectedProviderId = ref<number | null>(null)
const searchQuery = ref('')
const preloadStatus = ref<PreloadStatus>({
  games: 'idle',
  providers: 'idle',
  tokenValidation: 'idle'
})



// 导航和分页
const customNav = ref([
  {
    label: 'Popular',
    key: 'popular'
  },
  {
    label: 'Recente',
    key: 'recent'
  },
  {
    label: 'Favoritos',
    key: 'favorites'
  }
])
const nowCustomNav = ref('popular')
const currentPage = ref(1)
const itemsPerPage = 30 // 每页显示12个游戏（3列 x 4行）

// 预加载状态监听器
const onPreloadStatusChange = (status: PreloadStatus) => {
  preloadStatus.value = status

  // 当提供商数据加载完成时，获取数据
  if (status.providers === 'loaded') {
    loadProvidersFromCache()
  }

  // 当游戏数据加载完成时，获取数据
  if (status.games === 'loaded') {
    loadGamesFromCache()
  }

  // 更新loading状态
  loading.value = status.games === 'loading' || status.providers === 'loading'
}

// 从缓存加载提供商数据
const loadProvidersFromCache = async () => {
  try {
    const cachedProviders = await preloadService.getCachedProviders()
    providers.value = cachedProviders
    console.log('从缓存加载游戏提供商:', cachedProviders.length, '个')
  } catch (err) {
    console.error('从缓存加载提供商失败:', err)
    error.value = 'Falha ao carregar dados dos provedores'
  }
}

// 从缓存加载游戏数据
const loadGamesFromCache = async () => {
  try {
    const cachedGames = await preloadService.getCachedGames()
    games.value = cachedGames
    loading.value = false
    console.log('从缓存加载游戏数据:', cachedGames.length, '个')
  } catch (err) {
    console.error('从缓存加载游戏失败:', err)
    error.value = 'Falha ao carregar dados dos jogos'
    loading.value = false
  }
}

// 初始化数据加载
const initializeData = async () => {
  try {
    // 添加预加载状态监听器
    preloadService.addStatusListener(onPreloadStatusChange)

    // 获取当前预加载状态
    const currentStatus = preloadService.getStatus()

    // 如果数据已经加载完成，直接从缓存获取
    if (currentStatus.providers === 'loaded') {
      await loadProvidersFromCache()
    }

    if (currentStatus.games === 'loaded') {
      await loadGamesFromCache()
    } else {
      // 如果游戏数据还没有加载完成，先尝试从缓存获取
      const cachedGames = await preloadService.getCachedGames()
      if (cachedGames.length > 0) {
        games.value = cachedGames
        loading.value = false
        console.log('使用已有缓存的游戏数据:', cachedGames.length, '个')
      }
    }

    // 如果没有任何数据且预加载还没开始，手动触发预加载
    if (currentStatus.games === 'idle' && currentStatus.providers === 'idle') {
      console.log('预加载还未开始，手动触发预加载...')
      preloadService.startPreload()
    }

  } catch (err) {
    console.error('初始化数据失败:', err)
    error.value = 'Falha ao inicializar dados'
    loading.value = false
  }
}

// 事件处理
const changeCustomNav = (key: string) => {
  nowCustomNav.value = key
  currentPage.value = 1
  // 根据不同的导航类型可以实现不同的排序逻辑
}

const selectProvider = (providerId: number | null) => {
  selectedProviderId.value = providerId
  currentPage.value = 1
  // 不需要重新获取数据，依赖客户端筛选
}


// 提供商排序映射：provider_id -> sort_order
const providerOrderMap = computed(() => {
  const map = new Map<number, number>()
  providers.value.forEach(p => map.set(p.id, p.sort_order ?? Number.POSITIVE_INFINITY))
  return map
})

// 计算属性
const filteredGames = computed(() => {
  let filtered = games.value

  // 根据提供商筛选
  if (selectedProviderId.value !== null) {
    filtered = filtered.filter(game => game.provider_id === selectedProviderId.value)
  }

  // 根据搜索查询过滤
  if (searchQuery.value) {
    filtered = filtered.filter(game =>
      game.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 根据导航类型筛选和排序
  switch (nowCustomNav.value) {
    case 'recent':
      // 只显示有游玩记录的游戏，按最后游玩时间降序
      filtered = filtered
        .filter(game => game.lastPlayedAt)
        .sort((a, b) => (b.lastPlayedAt || 0) - (a.lastPlayedAt || 0))
      break
    case 'favorites':
      // 只显示收藏的游戏，按收藏时间或点击数排序
      filtered = filtered
        .filter(game => game.isFavourite)
        .sort((a, b) => b.clicks - a.clicks)
      break
    default:
      // 热门游戏排序：按点击数降序 -> 提供商 sort_order 升序 -> id 降序
      filtered = filtered.sort((a, b) => {
        // 1) clicks 降序
        if (b.clicks !== a.clicks) {
          return b.clicks - a.clicks
        }
        // 2) provider.sort_order 升序（未找到则视为无穷大，排在后面）
        const aOrder = providerOrderMap.value.get(a.provider_id) ?? Number.POSITIVE_INFINITY
        const bOrder = providerOrderMap.value.get(b.provider_id) ?? Number.POSITIVE_INFINITY
        if (aOrder !== bOrder) {
          return aOrder - bOrder
        }
        // 3) id 降序（新游戏优先）
        return b.id - a.id
      })
      break
  }

  return filtered
})

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(filteredGames.value.length / itemsPerPage)
})

// 计算当前页显示的游戏
const paginatedSlots = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredGames.value.slice(start, end)
})

// 处理页面变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  console.log('切换到第', page, '页')
}

// 处理搜索
const handleSearch = (query: string) => {
  searchQuery.value = query
  currentPage.value = 1
}



// 切换收藏状态
const toggleFavourite = async (gameId: number) => {
  try {
    const newFavouriteState = await gameStorage.toggleFavourite(gameId)

    // 更新本地数据
    const gameIndex = games.value.findIndex(game => game.id === gameId)
    if (gameIndex !== -1) {
      games.value[gameIndex].isFavourite = newFavouriteState
    }

    console.log(`游戏 ${gameId} 收藏状态已${newFavouriteState ? '添加' : '移除'}`)
  } catch (err) {
    console.error('切换收藏状态错误:', err)
  }
}

// 游戏加载状态
const isGameLoading = ref(false)
const currentGameId = ref<number | null>(null)

// 启动游戏
const launchGame = async (gameId: number) => {
  // 检查用户是否已登录
  if (!isAuthenticated.value) {
    // 未登录时跳转到主页并通过事件总线触发登录模态框
    router.push('/')
    // 使用事件总线触发全局登录模态框
    eventBus.emit('open-login-modal', 'login')
    return
  }

  // **新增：检查用户是否被禁止游戏**
  const isGameBanned = store.getters['auth/isGameBanned']
  if (isGameBanned === 1) {
    // 使用toast显示游戏禁用提示
    $toast.error('Sua conta foi restrita de jogar. Entre em contato com o suporte.')
    return
  }

  // **修改：智能余额检查 - 如果本地余额不足，先从API刷新余额**
  let balance = store.getters['auth/balance']
  const minGameBalance = 0.5 // 启动游戏所需的最低余额

  if (balance < minGameBalance) {
    try {
      // 本地余额不足，从API获取最新余额
      console.log('本地余额不足，正在从API刷新余额...')
      const response = await playerApi.getBalance()

      if (response.code === 1) {
        // 更新store中的余额
        await store.dispatch('auth/updateBalance', response.data.balance)
        balance = response.data.balance
        console.log('余额已刷新:', balance)
      } else {
        // 检查是否是认证相关错误
        if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
          // 认证错误：静默处理，不显示错误
          console.log('认证错误，需要重新登录')
          return // 终止游戏启动
        }

        console.error('刷新余额失败:', response.msg, 'code:', response.code)
        // 即使刷新失败，也继续使用本地余额进行检查
      }
    } catch (error) {
      console.error('刷新余额错误:', error)
      // 网络错误时，继续使用本地余额进行检查
    }
  }

  // 最终余额检查
  if (balance < minGameBalance) {
    const confirmed = await $confirm({
      title: 'Saldo Insuficiente',
      message: 'Saldo insuficiente para iniciar o jogo. Deseja fazer um depósito?',
      confirmText: 'Depositar',
      cancelText: 'Cancelar'
    })
    if (confirmed) {
      router.push('/')
      eventBus.emit('open-deposit-modal')
    }
    return // 余额不足，终止函数
  }

  try {
    isGameLoading.value = true
    currentGameId.value = gameId

    const response = await gameApi.launchGame(gameId)
    if (response.code === 1) {
      // 记录游玩时间到IndexedDB
      await gameStorage.updateLastPlayedAt(gameId)

      // 更新本地数据
      const gameIndex = games.value.findIndex(game => game.id === gameId)
      if (gameIndex !== -1) {
        games.value[gameIndex].lastPlayedAt = Date.now()
      }

      // 获取到游戏链接后，编码URL并跳转到游戏页面
      const encodedToken = GameUrlEncoder.encode(response.data.game_url)
      router.push({
        path: `/game/${gameId}`,
        query: { token: encodedToken }
      })
    } else {
      // 检查是否是认证相关错误
      if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
        $toast.error('Sessão expirada. Faça login novamente.') // 会话已过期，请重新登录
        return
      }

      // 检查是否是余额不足错误
      if (response.code === 400 && response.msg?.includes('余额不足')) {
        // 余额不足时，询问用户是否要充值
        const confirmed = await $confirm({
          title: 'Saldo Insuficiente',
          message: 'Saldo insuficiente para iniciar o jogo. Deseja fazer um depósito?',
          confirmText: 'Depositar',
          cancelText: 'Cancelar'
        })
        if (confirmed) {
          router.push('/')
          // 使用事件总线触发充值模态框
          eventBus.emit('open-deposit-modal')
        }
      } else {
        $toast.error(response.msg || 'Falha ao iniciar o jogo')
      }
    }
  } catch (err) {
    console.error('启动游戏错误:', err)
    $toast.error('Falha ao iniciar o jogo')
  } finally {
    isGameLoading.value = false
    currentGameId.value = null
  }
}

// 处理路由查询参数
const handleRouteQuery = () => {
  const { provider } = route.query

  if (provider) {
    // 根据provider设置选中的提供商
    const providerId = parseInt(provider as string, 10)
    if (!isNaN(providerId)) {
      selectedProviderId.value = providerId
      nowCustomNav.value = 'popular'
    }
  } else {
    // 没有provider参数时，重置为默认状态
    selectedProviderId.value = null
    nowCustomNav.value = 'popular'
  }

  // 重置到第一页
  currentPage.value = 1
}

// 组件挂载时初始化数据
onMounted(async () => {
  await initializeData()
  // 处理路由查询参数
  handleRouteQuery()
})

// 监听路由查询参数变化
watch(() => route.query, () => {
  handleRouteQuery()
}, { deep: true })

// 组件卸载时清理监听器
onUnmounted(() => {
  preloadService.removeStatusListener(onPreloadStatusChange)
})

// 重试加载数据
const retryLoadData = async () => {
  error.value = ''
  loading.value = true
  await initializeData()
}
</script>

<style scoped>
/* Slots页面特定样式 */
</style>
