<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Apostas da Sorte'"></NavBar>
    <div class="top">
      <div class="top-item">
        <div class="top-item-l">
          <div class="top-item-l-mb5">
            Pontos de sorte atuais
            <span class="yellow">{{ luckyPoints }}</span>
          </div>
          <div class="text-[0.9rem]">
            Você ainda precisa apostar
            <span class="white">{{ needBet }}</span>
            para obter
            <span class="yellow">{{ getLucky }}</span>
            Pontos de sorte
          </div>
        </div>
      </div>
      <div class="lottery-box w-full pt-[0.75rem]">
        <Turntable
          ref="turntableRef"
          :themeKey="activeTheme"
          :prizes="prizes"
          :selectedId="selectedPrizeId"
          @start="handleStart"
          @spun="onSpun"
          @spin-error="onSpinError"
        />
      </div>
      <div class="top-button-group">
        <div
          v-for="(item, idx) in wheels"
          :key="item.name"
          class="button"
          :class="activeIndex === idx ? ('button-bg' + item.level) : ''"
          @click="setActiveWheel(idx)"
        >
          <div>
            <div class="button-text1">
              {{ item.name }}
            </div>
            <div class="button-text2">
              {{ item.cost }} Pontos de Sorte
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lucky-content">
      <div class="tab-box">
        <div class="tab">
          <div class="tab-item" :class="{ 'tab-item-active': currentTab === 'platform' }" @click="currentTab = 'platform'">
            <div class="tab-item-text">Notificação de Prêmio</div>
          </div>
        </div>
      </div>
      <div class="list-box">
        <div
          class="list-box-item"
          v-for="(item, index) in platformRecords"
          :key="index"
        >
          <img :src="historyIcon" class="img-fluid" />
          <div class="list-box-item-m">
            <div class="white-space">{{ item.time }}</div>
            <div>{{ item.user }} obtê-lo em {{ item.wheel }}</div>
          </div>
          <div class="yellow white-space">{{ item.amount }}</div>
        </div>
      </div>
    </div>
    <div class="lucky-content intro">
      <div class="title">Instruções Do Evento:</div>
      <div class="intro-text">
        I. Condições do Evento: Apostas acumuladoras<br><br>
        II. Plataforma Específica: Slots e Jogos compatíveis<br><br>
        III. Instruções: Pontos diários expiram no dia seguinte; resgate manual<br><br>
        IV. Bônus: Saque após aposta válida de 1x<br><br>
        V. Operações anormais são proibidas; a plataforma reserva direito de interpretação
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { rouletteApi } from '../../../services/api'
import { useAuthStore } from '../../../stores/auth'
import { showToast } from '../../../components/toast/service'
import Turntable from '../../../components/turntable/Turntable.vue'

const auth = useAuthStore()
const luckyPoints = computed(() => ((auth as any).user?.bet_points ?? 0))
const needBet = ref('1')
const getLucky = ref('1.00')

type Wheel = { name: string; cost: number; level: 1 | 2 | 3; theme: 'blue' | 'yellow' | 'purple' }
type Prize = { id: string | number; label?: string }

const wheels = ref<Wheel[]>([
  { name: 'Roda de Prata', cost: 1500, level: 1, theme: 'blue' },
  { name: 'Roda de Ouro', cost: 5555, level: 2, theme: 'yellow' },
  { name: 'Roda de Diamante', cost: 25555, level: 3, theme: 'purple' }
])
const activeIndex = ref(0)
const prizes = ref<Prize[]>([])
const selectedPrizeId = ref<string | number | undefined>(undefined)
const lastErrorMsg = ref<string | null>(null)
const turntableRef = ref<any>(null)

const setActiveWheel = (idx: number) => {
  activeIndex.value = idx
  if (rouletteCfg.value) updatePrizesFromConfig(rouletteCfg.value)
}
const activeLevel = computed(() => wheels.value[activeIndex.value]?.level ?? 1)
const activeTheme = computed(() => wheels.value[activeIndex.value]?.theme ?? 'blue')

const rouletteCfg = ref<{ silver: { cost: number; prizes: number[] }; gold: { cost: number; prizes: number[] }; diamond: { cost: number; prizes: number[] } } | null>(null)
const updatePrizesFromConfig = (cfg: { silver: { cost: number; prizes: number[] }; gold: { cost: number; prizes: number[] }; diamond: { cost: number; prizes: number[] } }) => {
  const current = wheels.value[activeIndex.value]?.level ?? 1
  const arr = current === 1 ? cfg.silver.prizes : current === 2 ? cfg.gold.prizes : cfg.diamond.prizes
  prizes.value = arr.map((val, i) => ({ id: i, label: String(val) }))
}

async function handleStart() {
  if (!auth.isLoggedIn) {
    showToast('Por favor, faça login')
    if (turntableRef.value?.resetWaiting) turntableRef.value.resetWaiting()
    return
  }
  const type = activeLevel.value === 1 ? 'silver' : activeLevel.value === 2 ? 'gold' : 'diamond'
  try {
    const resp = await rouletteApi.spin(type)
    if (resp.code === 1) {
      selectedPrizeId.value = undefined
      await nextTick()
      selectedPrizeId.value = resp.data.prize_index
      await auth.updateBalance(resp.data.balance_after)
      showToast(`Você ganhou: ${resp.data.prize_amount}`)
    } else {
      lastErrorMsg.value = resp.msg || ''
      showToast(String(lastErrorMsg.value || 'Falha no sorteio, tente novamente'))
    }
  } catch (e) {
    showToast('Falha no sorteio, tente novamente')
  }
}
function onSpun(payload: { index: number; label?: string }) {
  showToast(`Você ganhou: ${payload.label ?? `Prêmio ${payload.index + 1}`}`)
}
function onSpinError() {
  const msg = (lastErrorMsg.value && lastErrorMsg.value.trim()) ? lastErrorMsg.value.trim() : 'Falha no sorteio, tente novamente'
  showToast(msg)
  lastErrorMsg.value = null
}

type HistoryItem = { time: string; user: string; wheel: string; amount: string }
const platformRecords = ref<HistoryItem[]>([])
const wheelsName = ['Roda de Prata', 'Roda de Ouro', 'Roda de Diamante']
const historyIcon = computed(() => `/constant/turntable/his${activeLevel.value}.png`)
const currentTab = ref<'platform'>('platform')
const formatTime = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm} ${hh}:${mi}`
}
const maskName = (name: string) => {
  const stars = Math.random() < 0.5 ? 3 : 4
  if (name.length <= 1) return '*'.repeat(stars)
  if (name.length === 2) return name[0] + '*'.repeat(stars)
  return name[0] + '*'.repeat(stars) + name[name.length - 1]
}
function genPlatformRecords() {
  const base = Date.now()
  const records: HistoryItem[] = []
  for (let i = 0; i < 20; i++) {
    const ts = base - Math.floor(Math.random() * 3600 * 1000)
    const uname = maskName(Math.random().toString(36).slice(2, 10))
    const wheel = wheelsName[Math.floor(Math.random() * wheelsName.length)]
    const amount = (Math.floor(Math.random() * 90) + 10).toFixed(2)
    records.push({
      time: String(formatTime(new Date(ts))),
      user: String(uname),
      wheel: String(wheel),
      amount: String(amount)
    })
  }
  platformRecords.value = records
}

onMounted(async () => {
  genPlatformRecords()
  try {
    const info = await rouletteApi.info()
    if (info.code === 1 && info.data?.roulette_config) {
      const cfg = info.data.roulette_config
      rouletteCfg.value = cfg
      wheels.value = wheels.value.map(w => {
        if (w.level === 1) return { ...w, cost: cfg.silver.cost }
        if (w.level === 2) return { ...w, cost: cfg.gold.cost }
        return { ...w, cost: cfg.diamond.cost }
      })
      updatePrizesFromConfig(cfg)
    }
  } catch (e) {
    showToast('Falha ao carregar informações da roleta')
  }
})
</script>
<style scoped>
.yellow{ color: var(--color-active) !important; }
.top {
  padding: 0.5625rem;
  box-sizing: border-box;
  background-color: var(--color-bg-aside-2);
  margin: 0.703125rem;
  border-radius: 0.9375rem;
}
.top .top-item {
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 0.0703125rem solid var(--color-active);
  padding-bottom: 0.703125rem;
  margin-bottom: 1.40625rem;
}
.top .top-item .top-item-l {
  width: 80%;
  color: #ffffffd9;
}
.top .top-item .top-item-l-mb5 {
  margin-bottom: 0.4rem;
  font-size: 1.05rem;
}
.top .lottery-box {
  display: flex;
  justify-content: center;
  margin-bottom: 1.40625rem;
}
.top .top-button-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.top .top-button-group .button {
  text-align: center;
  width: 9.84375rem;
  height: 3.9375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color:#fff;
  border-radius: 0.9375rem;
  cursor: pointer;
  position: relative;
  border: 1px solid var(--color-border-2);
}
.top .top-button-group .button .button-text1 { font-size: 0.8rem; }
.top .top-button-group .button .button-text2 { font-size: 0.6rem; }
.top .top-button-group .button-bg1 { background: #1672f2; }
.top .top-button-group .button-bg2 { background: #ffaa09; }
.top .top-button-group .button-bg3 { background: #b751ff; }
.lucky-content {
  background-color: var(--color-bg-aside-2);
  border-radius: 0.5625rem;
  margin: 0.703125rem 0.703125rem 0;
  color: #ffffffd9;
}
.intro {
  padding: 0.703125rem !important;
  color: #ffffffb3;
  line-height: 1.125rem;
  font-size: 0.6375rem;
}
.list-box { padding: 0 0.46875rem; height: 18.75rem; overflow-y: auto; }
.list-box .list-box-item {
  border-bottom: 0.046875rem solid var(--color-border-2);
  padding: 0.6rem 0;
  color: #ffffffd9;
  font-size: 0.825rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.list-box .list-box-item .list-box-item-m {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.9375rem;
  margin-right: 0.46875rem;
}
.list-box .list-box-item .img-fluid { width: 1.5rem; height: 1.5rem; margin-right: 0.6rem; }
.tab-box { height: 3.46875rem; display: flex; align-items: center; border-bottom: 0.046875rem solid var(--color-border-2); }
.tab {
  width: 100%;
  overflow-x: auto;
  display: flex;
  justify-content: space-around;
  padding: 0 0.6rem;
  box-sizing: border-box;
  font-size: 0.75rem;
  user-select: none;
  align-items: center;
}
.tab .tab-item { flex-shrink: 0; color: #ffffffd9; padding: 0 0.384375rem 0.46875rem; position: relative; cursor: pointer; font-size: 0.9rem; }
.tab .tab-item-text { position: relative; font-size: 0.9rem; }
.tab .tab-item-active .tab-item-text::after {
  content: "";
  border-bottom: 0.140625rem solid var(--color-active);
  position: absolute;
  left: 0; right: 0; bottom: -0.46875rem;
}
.tab .tab-item-active, .tab .tab-item:hover { color: var(--color-active); }
.tab::-webkit-scrollbar { display: none; }
</style>
