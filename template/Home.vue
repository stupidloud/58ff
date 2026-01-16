<template>
  <div class="h-screen flex flex-col relative">
    <!-- 烟花特效层 -->
    <FireworksCanvas />

    <header
      class="fixed top-0 w-full max-w-[516px] max-h-[62px] h-[4.5rem] flex items-center pl-1 pr-2 text-sm shadow-lg z-50 bg-[var(--color-bg-primary2)]">
      <div class="flex items-center">
        <button @click="toggleSidebar" class="p-2 rounded-md transition-all duration-200 ease-in-out">
          <svg class="w-[1.75rem] h-[1.75rem] transition-transform duration-300 ease-in-out fill-[var(--color-active)]"
            :class="{ 'rotate-180': sidebarOpen }">
            <use xlink:href="#btn_zcl_arrow--svgSprite:all"></use>
          </svg>
        </button>
      </div>
      <LogoSpotlight
        src="/variant/logo.png"
        class-name="w-[11rem] top-[.1rem] relative"
        alt=""
        :spotlight-width="60"
        :spotlight-intensity="1.1"
        :animation-duration="1500"
        :pause-duration="0"
      />

      <!-- PWA 安装按钮 -->
      <button
        v-if="canInstall"
        @click="installPwa"
        class="cursor-pointer ml-2 flex justify-center items-center w-[2rem] h-[2rem] bg-[var(--color-highlight-text)] opacity-60 rounded-[100%] text-[1.4rem] p-[.4rem] transition-colors duration-200 hover:bg-[var(--color-active)]">
        <svg
          class="text-[var(--color-bg-primary)] transition-colors duration-200"
          fill="currentColor"
          aria-hidden="true"
          focusable="false">
          <use xlink:href="#comm_icon_xza--svgSprite:all"></use>
        </svg>
      </button>

      <div class="flex items-center space-x-2 ml-auto">
        <UserStatus @open-modal="$emit('open-modal', $event)" @open-deposit-modal="$emit('open-deposit-modal')" />
        <!-- <svg @click="router.push('/slots')" class="w-[1.5rem] h-[1.5rem]" fill="currentColor" style="color: var(--color-inactive);">
          <use xlink:href="#comm_icon_ss--svgSprite:all"></use>
        </svg> -->
      </div>
    </header>

    <main
      class="mt-[4.5rem] pb-[3rem] flex-1 flex flex-col items-center justify-start overflow-y-auto home-content-bg bg-[var(--color-bg-primary)]">
      <Slider />
      <Jackpot />
      <Announcement :scrollSpeed="800" @announcement-click="handleAnnouncementClick" />
      <div class="w-full">
        <Tab :tabs="tabs" :default-tab="currentTab" @tab-change="handleTabChange" />
      </div>
      <!-- 游戏区 -->
      <div class="w-full">
        <!-- 加载状态 -->
        <div v-if="loading" class="p-[1rem] text-center">
          <div class="text-[var(--color-inactive)] text-[1.2rem]">Carregando jogos...</div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="p-[1rem] text-center">
          <div class="text-[var(--color-warning)] text-[1.2rem]">{{ error }}</div>
        </div>

        <!-- 游戏板块 -->
        <div v-else-if="gameSections.length > 0" class="game-sections">
          <div v-for="section in gameSections" :key="section.id" class="p-[1rem]">
            <div class="flex items-center mb-[1rem] w-full">
              <img class="w-[2.7rem] mr-[.5rem]" :src="getConstantAssetUrl(section.icon)" :alt="section.title">
              <span class="text-[1.4rem] text-white">{{ section.title }}</span>
              <span @click="handleTudoClick(section)" class="text-[1rem] ml-auto text-[var(--color-inactive)] cursor-pointer">Tudo</span>
            </div>
            <div class="flex flex-wrap gap-[1rem]">
              <div
                v-for="game in section.games"
                :key="game.id"
                class="w-[31%] min-h-[14rem] overflow-hidden rounded-[1rem] relative game-item"
                @click="launchGame(game.id)"
              >
                <GameCardWithGif
                  :game="game"
                  container-class="text-[1.3em]"
                  @toggle-favourite="toggleFavourite(game.id)"
                />
              </div>
              <p class="text-[var(--color-inactive)] text-[1.1rem] text-center w-full mt-[1rem]">
                A exibir {{ section.displayedCount }} jogos entre {{ section.totalCount }} {{ section.title }} jogos
              </p>
              <!-- 只有当还有更多游戏时才显示加载更多按钮 -->
              <p
                v-if="section.displayedCount < section.totalCount"
                class="text-[var(--color-highlight-text)] text-[1rem] w-full text-center flex items-center justify-center cursor-pointer"
                @click="loadMoreGames(section.id)"
              >
                Carregar mais
                <svg class="w-[.8rem] h-[.8rem] ml-[.5rem] text-[var(--color-highlight-text)]" fill="currentColor"
                  aria-hidden="true" focusable="false">
                  <use xlink:href="#comm_icon_jzgd--svgSprite:all"></use>
                </svg>
              </p>
            </div>
          </div>
        </div>

        <!-- 空状态显示 -->
        <div v-else class="p-[1rem]">
          <EmptyState :centered="false" :show-em-breve="false" />
          <div class="text-[var(--color-inactive)] text-[1.2rem] text-center mt-[1rem]">
            <span v-if="currentTab === 'recent'">Nenhum jogo recente encontrado</span>
            <span v-else-if="currentTab === 'favorite'">Nenhum jogo favorito encontrado</span>
            <span v-else>Nenhum jogo encontrado</span>
          </div>
        </div>
      </div>

      <!-- FOTTER -->
      <div class="w-full px-[1rem] bg-[var(--color-bg-primary2)]">
        <div class="flex pt-[2rem] pb-[1rem]">
          <div v-for="(item, index) in footerList" :key="index" class="flex-1">
            <p class="text-[1.1rem] text-[var(--color-inactive)] mb-[1rem]">{{ item.header }}</p>
            <p v-for="(it, ind) in item.li" :key="ind" class="text-[12px] text-[var(--color-highlight-text)] mb-[1rem]">
              {{ it.label }} </p>
          </div>
        </div>
        <div class="w-full h-[1px] bg-[var(--color-inactive)]"></div>
        <div class="flex justify-center flex-wrap mt-[2rem] mb-[1rem]">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/telegram.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/facebook.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/r18.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/whatsapp.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/instagram.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/line.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/twitter.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/youtube.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/tiktok.png')" alt="">
          <img class="h-[3.5rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/ks.png')" alt="">
        </div>
        <p
          class="pb-[2rem] text-[.9rem] text-center whitespace-break-spaces !leading-[1.6] text-[var(--color-inactive)]">
          O site {{ siteName }} oferece jogos de experiência de aventura. Para se tornar um usuário do nosso site, você
          deve ter pelo menos 18 anos de idade. Não somos responsáveis por violações das leis locais relativas a jogos
          online. Esperamos que você jogue com responsabilidade e se divirta em nossa plataforma.
        </p>
        <div class="w-full h-[1px] bg-[var(--color-inactive)]"></div>
        <div class="flex justify-center flex-wrap mt-[2rem] mb-[1rem]">
          <img class="h-[1.8rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/f1.png')" alt="">
          <img class="h-[1.8rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/f2.png')" alt="">
          <img class="h-[1.8rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/f3.png')" alt="">
          <img class="h-[1.8rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/f4.png')" alt="">
          <img class="h-[1.8rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/f5.webp')" alt="">
          <img class="h-[1.8rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/f6.webp')" alt="">
          <img class="h-[1.8rem] mr-[1rem] mb-[1rem]" :src="getConstantAssetUrl('/f7.webp')" alt="">
        </div>
        <p class="text-[var(--color-highlight-text)] text-center text-[1rem]">
          @ Direitos De Autor 2010-2030
        </p>
        <div class="h-[16rem]"></div>
      </div>
    </main>





    <!-- 侧边栏遮罩层 -->
    <OverlayMask :show="sidebarOpen" top="top-[4.5rem]" height="h-[calc(100vh-4.5rem)]" z-index="z-40"
      @close="toggleSidebar" />

    <!-- 侧边栏 -->
    <Sidebar :show="sidebarOpen" :tabs="tabs" :current-tab="currentTab" @close="toggleSidebar"
      @tab-change="handleTabChange" />

    <!-- gifs -->
    <teleport to="#pageRoot">
      <div class="absolute  left-[.8rem] bottom-[16rem] z-[11]">
        <img @click="router.push({ path: '/promotion', query: { tab: 'missao' } })" class="w-[8rem] h-auto cursor-pointer" :src="getConstantAssetUrl('/recharge/active.png')" alt="">
        <img @click="router.push({ path: '/turntable' })" class="w-[8rem] h-auto cursor-pointer mt-[1rem]" :src="getConstantAssetUrl('/turntable/router.gif')" alt="">
      </div>
      <div class="absolute  right-0 bottom-[8rem] z-[11]">
        <div class="mb-[.5rem]" @click="router.push('/event3')">
          <img class="h-[6.5rem] cursor-pointer" :src="getConstantAssetUrl('/gif0.gif')" alt="">
        </div>

        <div class="mb-[.5rem]" @click="router.push('/event1')">
          <img class="h-[6.5rem] cursor-pointer" :src="getConstantAssetUrl('/gif1.gif')" alt="">
        </div>
        <div v-if="instagramContact && instagramContact.link_url" class="mb-[.5rem]" @click="handleGif2Click">
          <img class="h-[6.5rem] cursor-pointer" :src="getConstantAssetUrl('/gif2.gif')" alt="">
        </div>
        <div v-if="telegramContact && telegramContact.link_url" class="mb-[.5rem]" @click="handleGif3Click">
          <img class="h-[6.5rem] cursor-pointer" :src="getConstantAssetUrl('/gif3.gif')" alt="">
        </div>
        <div v-if="whatsappContact && whatsappContact.link_url" @click="handleWhatsappClick">
          <img class="h-[6.5rem] cursor-pointer" :src="getConstantAssetUrl('/whatsapp.gif')" alt="">
        </div>
      </div>
    </teleport>
    <!-- 广告弹窗 -->
    <teleport to="#pageRoot">
      <OverlayMask :show="advShow" z-index="z-[998]" @close="closeAdvPopup" />
      <transition name="popup">
        <div v-if="advShow"
             class="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[516px] h-full z-[999] flex items-center justify-center pointer-events-none">
          <div class="popup-content w-[90%] relative translate-y-[-25%] pointer-events-auto" @click.stop>
            <div class="rounded-[1rem] h-[26rem] overflow-hidden flex bg-[var(--color-bg-primary)]">
              <div class="w-[8.5rem]">
                <div v-for="(item, index) in advArr" :key="item.key" class="p-[1rem] flex items-center"
                  :class="{ 'bg-[var(--color-inactive)]': nowAdvIndex === index }" @click="nowAdvIndex = index">
                  <img v-show="nowAdvIndex === index" class="w-[1.4rem] h-[1.4rem] mr-[.5rem]"
                    src="/variant/radio2_a.png" alt="">
                  <img v-show="nowAdvIndex !== index" class="w-[1.4rem] h-[1.4rem] mr-[.5rem]" src="/variant/radio2.png"
                    alt="">
                  <span
                    class="text-[1.1rem] overflow-hidden whitespace-break-spaces text-ellipsis text-[var(--color-inactive)] line-clamp-2"
                    :class="{ '!text-[var(--color-active)]': nowAdvIndex === index }">{{ item.label }}</span>
                </div>
              </div>
              <div class="flex-1" @click="handleAdvClick" :class="{ 'cursor-pointer': advArr[nowAdvIndex].link }">
                <img :src="advArr[nowAdvIndex].img.startsWith('/variant/') ? advArr[nowAdvIndex].img : getConstantAssetUrl(advArr[nowAdvIndex].img)" alt="" fetchpriority="high" class="w-full h-full object-cover">
              </div>
            </div>
            <div @click="closeAdvPopup" class="absolute bottom-[-5rem] right-0 left-0 m-auto p-2 flex justify-center">
              <img class="h-[3rem]" :src="getConstantAssetUrl('/icons/close-icon.png')" alt="">
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </div>

  <!-- 游戏加载组件 -->
  <Spinner :visible="isGameLoading" text="Carregando jogo..." />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useSupportContacts } from '../../composables/useSupportContacts'
import { usePwaInstall } from '../../composables/usePwaInstall'
import type { RootState } from '../../stores'
import Slider from '../features/Slider.vue'
import Jackpot from '../features/Jackpot.vue'
import Announcement from '../features/Announcement.vue'
import Tab from '../layout/Tab.vue'
import Sidebar from '../layout/Sidebar.vue'
import UserStatus from '../ui/UserStatus.vue'
import Spinner from '../ui/Spinner.vue'
import EmptyState from '../common/EmptyState.vue'
import OverlayMask from '../ui/OverlayMask.vue'
import LogoSpotlight from '../ui/LogoSpotlight.vue'
import FireworksCanvas from '../effects/FireworksCanvas.vue'
import GameCardWithGif from '../common/GameCardWithGif.vue'
import { gameStorage, type GameData } from '../../services/gameStorage'
import { preloadService, type PreloadStatus, type GameProvider } from '../../services/preloadService'
import { gameApi, playerApi } from '../../services/api'
import { GameUrlEncoder } from '../../utils/gameUrlEncoder'
import { $toast } from '../../components/common/toast'
import { $confirm } from '../../components/common/confirmDialog'
import { getConstantAssetUrl } from '../../utils/assets'
import { adsConfig } from '../../config/ads'


// 路由实例
const router = useRouter()

// Vuex store
const store = useStore<RootState>()

// 客服联系方式组合式函数
const { fetchContacts, openInstagram, openTelegram, openWhatsapp, instagramContact, telegramContact, whatsappContact } = useSupportContacts()

// PWA 安装功能
const { installPwa, canInstall } = usePwaInstall()

// 站点信息 - 从store获取
const siteName = computed(() => store.getters['site/siteName'])
const ifShowCert = computed(() => store.getters['site/ifShowCert'])

// 登录状态
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])

// 侧边栏状态
const sidebarOpen = ref(false)

// Tab数据
const tabs = [
  {
    id: 'popular',
    label: 'Populares',
    icon: {
      png: '/constant/icons/popular.png',
      svg: '#icon_dtfl_rm_0--svgSprite:all'
    }
  },
  {
    id: 'slots',
    label: 'Slots',
    icon: {
      png: '/constant/icons/slots.png',
      svg: '#icon_dtfl_dz_0--svgSprite:all'
    }
  },
  {
    id: 'recent',
    label: 'Recentes',
    icon: {
      png: '/constant/icons/recent.png',
      svg: '#icon_dtfl_zj_0--svgSprite:all'
    }
  },
  {
    id: 'favorite',
    label: 'Favoritos',
    icon: {
      png: '/constant/icons/favorite.png',
      svg: '#icon_dtfl_sc_0--svgSprite:all'
    }
  }
]

// 当前选中的tab
const currentTab = ref('popular')

// 游戏数据状态
const games = ref<GameData[]>([])
const providers = ref<GameProvider[]>([])
const loading = ref(true)
const error = ref('')


// 提供商排序映射：provider_id -> sort_order
const providerOrderMap = computed(() => {
  const map = new Map<number, number>()
  providers.value.forEach(p => map.set(p.id, p.sort_order ?? Number.POSITIVE_INFINITY))
  return map
})

// 游戏板块数据
interface GameSection {
  id: string
  title: string
  icon: string
  games: GameData[]
  totalCount: number
  displayedCount: number  // 当前显示的游戏数量
  allGames: GameData[]    // 该板块的所有游戏
}

const gameSections = ref<GameSection[]>([])
const GAMES_PER_PAGE = 9  // 每页显示的游戏数量
const MAX_SECTION_GAMES = 90 // 热门和老虎机板块限制显示的游戏总数

// 预加载状态监听器
const onPreloadStatusChange = (status: PreloadStatus) => {
  console.log('预加载状态变化:', status)

  if (status.games === 'loaded') {
    loadGamesFromCache()
  }

  if (status.providers === 'loaded') {
    loadProvidersFromCache()
  }
}

// 从缓存加载提供商数据
const loadProvidersFromCache = async () => {
  try {
    const cachedProviders = await preloadService.getCachedProviders()
    console.log('===ccc===')
    console.log(cachedProviders)
    console.log('===ccc===')

    providers.value = cachedProviders
    console.log('从缓存加载游戏提供商:', cachedProviders.length, '个')

    // 提供商数据加载完成后，重新生成游戏板块
    if (games.value.length > 0) {
      await generateGameSections()
    }
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

    // 游戏数据加载完成后，生成游戏板块
    await generateGameSections()
  } catch (err) {
    console.error('从缓存加载游戏失败:', err)
    error.value = 'Falha ao carregar dados dos jogos'
    loading.value = false
  }
}

// 生成游戏板块数据
const generateGameSections = async () => {
  if (games.value.length === 0) return

  const sections: GameSection[] = []

  // 根据当前选中的tab生成不同的内容
  if (currentTab.value === 'recent') {
    // Recent tab: 显示最近游玩的游戏
    try {
      const recentGames = await gameStorage.getRecentGames(50) // 获取最近50个游戏
      if (recentGames.length > 0) {
        sections.push({
          id: 'recent',
          title: 'Recentes',
          icon: '/constant/icons/recent.png',
          games: recentGames.slice(0, GAMES_PER_PAGE),
          totalCount: recentGames.length,
          displayedCount: Math.min(GAMES_PER_PAGE, recentGames.length),
          allGames: recentGames
        })
      }
    } catch (err) {
      console.error('获取最近游戏失败:', err)
    }
  } else if (currentTab.value === 'favorite') {
    // Favorite tab: 显示收藏的游戏
    try {
      const favouriteGames = await gameStorage.getFavouriteGames()
      if (favouriteGames.length > 0) {
        // 按clicks排序收藏的游戏
        const sortedFavouriteGames = [...favouriteGames].sort((a, b) => b.clicks - a.clicks)
        sections.push({
          id: 'favorite',
          title: 'Favoritos',
          icon: '/constant/icons/favorite.png',
          games: sortedFavouriteGames.slice(0, GAMES_PER_PAGE),
          totalCount: sortedFavouriteGames.length,
          displayedCount: Math.min(GAMES_PER_PAGE, sortedFavouriteGames.length),
          allGames: sortedFavouriteGames
        })
      }
    } catch (err) {
      console.error('获取收藏游戏失败:', err)
    }
  } else {
    // Popular tab (默认): 显示popular、slots和provider板块
    const displayedGameIds = new Set<number>()

    // 第一个板块：热门游戏，按规则排序后取前90个
    const allPopularGames = [...games.value]
      .sort((a, b) => {
        if (b.clicks !== a.clicks) return b.clicks - a.clicks
        const aOrder = providerOrderMap.value.get(a.provider_id) ?? Number.POSITIVE_INFINITY
        const bOrder = providerOrderMap.value.get(b.provider_id) ?? Number.POSITIVE_INFINITY
        if (aOrder !== bOrder) return aOrder - bOrder
        return b.id - a.id
      })
      .slice(0, MAX_SECTION_GAMES)

    // 记录已显示的游戏ID
    allPopularGames.forEach(game => displayedGameIds.add(game.id))

    sections.push({
      id: 'popular',
      title: 'Populares',
      icon: '/constant/icons/popular.png',
      games: allPopularGames.slice(0, GAMES_PER_PAGE),
      totalCount: allPopularGames.length,
      displayedCount: Math.min(GAMES_PER_PAGE, allPopularGames.length),
      allGames: allPopularGames
    })

    // 第二个板块：老虎机，排除热门已显示的，取前90个
    const allSlotsGames = [...games.value]
      .filter(game => game.type === 'slot' && !displayedGameIds.has(game.id))
      .sort((a, b) => {
        return b.id - a.id
      })
      .slice(0, MAX_SECTION_GAMES)

    // 记录已显示的游戏ID
    allSlotsGames.forEach(game => displayedGameIds.add(game.id))

    sections.push({
      id: 'slots',
      title: 'Slots',
      icon: '/constant/icons/slots.png',
      games: allSlotsGames.slice(0, GAMES_PER_PAGE),
      totalCount: allSlotsGames.length,
      displayedCount: Math.min(GAMES_PER_PAGE, allSlotsGames.length),
      allGames: allSlotsGames
    })

    // 随后的板块：每个provider一个板块，排除热门和老虎机已显示的
    if (providers.value.length > 0) {
      providers.value.forEach(provider => {
        const allProviderGames = games.value
          .filter(game => game.provider_id === provider.id && !displayedGameIds.has(game.id))
          .sort((a, b) => {
            // 先按clicks排序，再按id排序
            if (b.clicks !== a.clicks) {
              return b.clicks - a.clicks
            }
            return b.id - a.id
          })

        if (allProviderGames.length > 0) {
          sections.push({
            id: `provider_${provider.id}`,
            title: provider.name,
            icon: provider.image,
            games: allProviderGames.slice(0, GAMES_PER_PAGE),
            totalCount: allProviderGames.length,
            displayedCount: Math.min(GAMES_PER_PAGE, allProviderGames.length),
            allGames: allProviderGames
          })
        }
      })
    }
  }

  gameSections.value = sections
  console.log('生成游戏板块:', sections.length, '个', '当前tab:', currentTab.value)
}

// 加载更多游戏
const loadMoreGames = (sectionId: string) => {
  const sectionIndex = gameSections.value.findIndex(section => section.id === sectionId)
  if (sectionIndex === -1) return

  const section = gameSections.value[sectionIndex]
  const currentDisplayed = section.displayedCount
  const nextDisplayed = Math.min(currentDisplayed + GAMES_PER_PAGE, section.totalCount)

  // 更新显示的游戏
  section.games = section.allGames.slice(0, nextDisplayed)
  section.displayedCount = nextDisplayed

  console.log(`${section.title} 板块加载更多游戏: ${currentDisplayed} -> ${nextDisplayed}`)
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
        await generateGameSections()
      }
    }

    // 如果没有任何数据且预加载还没开始，手动触发预加载
    if (currentStatus.games === 'idle' && currentStatus.providers === 'idle') {
      console.log('预加载还未开始，手动触发预加载...')
      preloadService.startPreload()
    }
  } catch (err) {
    console.error('初始化数据失败:', err)
    error.value = 'Falha ao carregar dados'
    loading.value = false
  }
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

    // 重新生成游戏板块以反映收藏状态变化
    await generateGameSections()

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
    // 未登录时显示登录模态框
    emit('open-modal', 'login')
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
      emit('open-deposit-modal')
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
          emit('open-deposit-modal')
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

// 切换侧边栏
const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}





// 处理tab切换
const handleTabChange = async (tabId: string) => {
  if (tabId === 'slots') {
    // 当点击slots时，跳转到slots页面
    emit('navigate-to-slots')
    return
  }
  currentTab.value = tabId
  console.log('切换到tab:', tabId)

  // 重新生成游戏板块以显示对应tab的内容
  await generateGameSections()
}

// 处理Tudo按钮点击
const handleTudoClick = (section: GameSection) => {
  // 所有板块都跳转到slots页面
  if (section.id.startsWith('provider_')) {
    // 提取provider_id
    const providerId = section.id.replace('provider_', '')
    // 跳转到slots页面，选中对应的提供商
    router.push(`/slots?provider=${providerId}`)
  } else {
    // 对于popular、slots、recent、favorite等板块，也跳转到slots页面但不选中provider
    router.push('/slots')
  }
}

// 定义props（接收从App.vue传递的属性，但不使用）
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// 定义emit函数
const emit = defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

// 处理公告点击事件
const handleAnnouncementClick = () => {
  // 通过事件向上传递，让父组件处理页面跳转
  emit('announcement-click')
}



// 处理gif2点击事件
const handleGif2Click = async () => {
  await openInstagram()
}

// 处理gif3点击事件
const handleGif3Click = async () => {
  await openTelegram()
}

// 处理whatsapp点击事件
const handleWhatsappClick = async () => {
  await openWhatsapp()
}


// 计算属性：根据ifShowCert控制广告数组
const advArr = computed(() => {
  const baseAdvs = []

  // 只有当ifShowCert为1时才显示"Sobre nós"，并且放在第一位
  if (ifShowCert.value === 1) {
    baseAdvs.push({
      label: 'Sobre nós',
      key: 'pop3',
      img: '/variant/pop3.jpg',
      link: ''
    })
  }

  // 添加其他广告项
  baseAdvs.push(
    {
      label: 'Política da plataforma',
      key: 'pop1',
      img: '/variant/pop1.jpg',
      link: ''
    },
    {
      label: 'Bônus de Primeiro Depósito',
      key: 'pop2',
      img: '/variant/pop2.jpg',
      link: ''
    },
    adsConfig.pop4
  )

  return baseAdvs
})
const nowAdvIndex = ref(0)
const handleAdvClick = () => {
  const currentAdv = advArr.value[nowAdvIndex.value]
  if (currentAdv && currentAdv.link) {
    window.open(currentAdv.link, '_blank')
  }
}
const advShow = ref(false);
const footerList = [
  {
    header: 'Cassino',
    li: [
      {
        label: 'Eventos',
        router: ''
      },
      {
        label: 'Rebate',
        router: ''
      },
      {
        label: 'Pendente',
        router: ''
      },
      {
        label: 'Histórico',
        router: ''
      },
      {
        label: 'VIP',
        router: ''
      },
    ]
  },
  {
    header: 'Jogo',
    li: [
      {
        label: 'Populares',
        router: ''
      },
      {
        label: 'Slots',
        router: ''
      },
      {
        label: 'Recentes',
        router: ''
      },
      {
        label: 'Favoritos',
        router: ''
      },
    ]
  },
  {
    header: 'Suporte',
    li: [
      {
        label: 'Serviço Online',
        router: ''
      },
      {
        label: 'Centro de Ajuda',
        router: ''
      },
    ]
  }
]
// 广告弹窗控制逻辑
const ADV_POPUP_KEY = 'adv_popup_last_shown'
const POPUP_INTERVAL = 60 * 60 * 1000 // 1小时的毫秒数

function shouldShowAdvPopup(): boolean {
  const lastShownTime = localStorage.getItem(ADV_POPUP_KEY)

  if (!lastShownTime) {
    // 如果没有记录，说明是第一次访问，应该显示
    return true
  }

  const lastShownTimestamp = parseInt(lastShownTime, 10)
  const currentTime = Date.now()

  // 检查是否已经过了1小时
  return (currentTime - lastShownTimestamp) >= POPUP_INTERVAL
}

function markAdvPopupShown(): void {
  localStorage.setItem(ADV_POPUP_KEY, Date.now().toString())
}

function closeAdvPopup(): void {
  advShow.value = false
  // 用户手动关闭时也记录时间戳，避免立即再次弹出
  markAdvPopupShown()
}



function _init() {
  setTimeout(() => {
    if (shouldShowAdvPopup()) {
      advShow.value = true
      markAdvPopupShown()
    }
  }, 1000)
}

// 组件挂载时的初始化
onMounted(async () => {
  // 获取站点信息（包含if_show_cert字段）
  store.dispatch('site/fetchSiteInfo')

  // 预热客服链接配置
  fetchContacts()
  // 初始化游戏数据
  await initializeData()

  // 广告图片预加载已移除，以避免与 fetchpriority="high" 冲突
})

// 组件卸载时清理监听器
onUnmounted(() => {
  preloadService.removeStatusListener(onPreloadStatusChange)
})

_init()
</script>


<style scoped>
/* HomePage组件样式 */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.3s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}

.popup-enter-active .popup-content,
.popup-leave-active .popup-content {
  transition: all 0.3s ease-out;
}

.popup-enter-from .popup-content,
.popup-leave-to .popup-content {
  opacity: 0;
  transform: translateY(-25%) scale(0.95);
}

/* 游戏项交互效果已移除 */

/* 游戏板块动画 */
.game-sections {
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
