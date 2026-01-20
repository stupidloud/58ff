<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Pesquisar Jogos'"></NavBar>
    <div class="p-[.75rem]">
      <div class="rounded-[.5rem] bg-[var(--color-tabbar)] p-[.5rem] mb-[.75rem]">
        <div class="flex items-center">
          <ion-icon name="search-outline" class="text-white/70 text-[1.2rem] mr-[.5rem]"></ion-icon>
          <input
            v-model="query"
            class="flex-1 h-[2.25rem] bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)] rounded-[.375rem] px-[.5rem] text-white text-[.85rem]"
            placeholder="Buscar por nome"
            @input="onQueryChange"
          />
        </div>
      </div>

      <div class="rounded-[.5rem] bg-[var(--color-tabbar)] p-[.5rem] mb-[.75rem]">
        <div class="flex items-center overflow-x-auto scrollbar-hide gap-[.5rem]">
          <div
            class="h-[2.2rem] flex-shrink-0 flex items-center justify-center text-[.8rem] rounded-[.375rem] cursor-pointer border px-[.5rem]"
            :class="selectedProvider === 'popular' ? 'bg-[var(--color-active)] text-white border-[var(--color-active)]' : 'bg-[var(--color-tabbar-2)] text-white/80 border-[var(--color-border-1)]'"
            @click="setProvider('popular')"
          >
            Populares
          </div>
          <div
            v-for="p in providers"
            :key="p.id"
            class="h-[2.2rem] flex-shrink-0 flex items-center justify-center text-[.8rem] rounded-[.375rem] cursor-pointer border px-[.5rem]"
            :class="selectedProvider === p.id ? 'bg-[var(--color-active)] text-white border-[var(--color-active)]' : 'bg-[var(--color-tabbar-2)] text-white/80 border-[var(--color-border-1)]'"
            @click="setProvider(p.id)"
          >
            <span class="truncate">{{ p.name }}</span>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-[1rem] text-white/60">Carregando...</div>
      <div v-else-if="error" class="text-center py-[1rem] text-[#E84F46]">{{ error }}</div>

      <div v-else>
        <div class="flex items-center justify-between px-[.25rem] mb-[.5rem]">
          <div class="text-white text-[.9rem] font-[700]">{{ headerTitle }}</div>
          <div class="text-white/70 text-[.75rem]">Exibindo {{ displayedCount }} de {{ totalCount }}</div>
        </div>
        <div class="grid grid-cols-4 gap-[.5rem]">
          <div
            v-for="g in displayedGames"
            :key="g.id"
            class="relative rounded-[.75rem] overflow-hidden border border-[var(--color-border-2)] cursor-pointer"
            @click="launch(g.id)"
          >
            <img :src="g.image" :alt="g.name" class="w-full h-auto" />
            <div class="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[.75rem] px-[.375rem] py-[.25rem] truncate">
              {{ g.name }}
            </div>
          </div>
        </div>
        <div class="mt-[.75rem] flex items-center justify-center">
          <div
            v-if="displayedCount < totalCount"
            class="px-[.75rem] h-[2.25rem] rounded-[2rem] flex items-center justify-center text-white text-[.85rem] cursor-pointer border border-[var(--color-active)]"
            @click="loadMore"
          >
            Carregar mais
          </div>
        </div>
      </div>
    </div>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gameApi, type Game, type GameProvider } from '../services/api'
import { showToast } from '../components/toast/service'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const providers = ref<GameProvider[]>([])
const allGames = ref<Game[]>([])
const loading = ref(true)
const error = ref('')
const query = ref('')
const selectedProvider = ref<'popular' | number>('popular')
const PAGE_SIZE = 24
const displayedCount = ref(PAGE_SIZE)

const onQueryChange = () => {
  displayedCount.value = PAGE_SIZE
}

const setProvider = (id: 'popular' | number) => {
  selectedProvider.value = id
  displayedCount.value = PAGE_SIZE
}

const filteredGames = computed(() => {
  let list = allGames.value
  if (selectedProvider.value !== 'popular') {
    list = list.filter(g => g.provider_id === selectedProvider.value)
  }
  if (query.value.trim()) {
    const q = query.value.trim().toLowerCase()
    list = list.filter(g => g.name.toLowerCase().includes(q))
  }
  return [...list].sort((a, b) => {
    if (b.clicks !== a.clicks) return b.clicks - a.clicks
    return b.id - a.id
  })
})

const totalCount = computed(() => filteredGames.value.length)
const displayedGames = computed(() => filteredGames.value.slice(0, displayedCount.value))
const headerTitle = computed(() => {
  if (selectedProvider.value === 'popular') return 'Populares'
  const p = providers.value.find(x => x.id === selectedProvider.value)
  return p?.name || 'Jogos'
})

const loadMore = () => {
  displayedCount.value = Math.min(displayedCount.value + PAGE_SIZE, totalCount.value)
}

const launch = async (gameId: number) => {
  if (!auth.isLoggedIn) {
    showToast('Por favor, faça login')
    return
  }
  try {
    const res = await gameApi.launchGame(gameId)
    if (res.code === 1) {
      const token = encodeURIComponent(res.data.game_url)
      window.location.assign(`/game/${gameId}?token=${token}`)
    } else {
      showToast(res.msg || 'Falha ao iniciar o jogo')
    }
  } catch (e: any) {
    showToast(e?.message || 'Falha ao iniciar o jogo')
  }
}

const fetchData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [prov, games] = await Promise.all([
      gameApi.getProviders(),
      gameApi.getGames()
    ])
    if (prov.code === 1 && prov.data?.providers) {
      providers.value = prov.data.providers
    }
    if (games.code === 1 && games.data?.games) {
      allGames.value = games.data.games
    }
  } catch (e: any) {
    error.value = e?.message || 'Falha ao carregar dados'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<style scoped>
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
.scrollbar-hide::-webkit-scrollbar { display: none; }
</style>
