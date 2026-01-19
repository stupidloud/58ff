<template>
  <div class="h-screen flex flex-col relative z-10 bg-[var(--color-bg-main)] overflow-scroll">
    <!-- 标题栏 -->
    <CommonHeader>
      Apostas da Sorte
    </CommonHeader>  
    <div class="top">
    <!-- 顶部信息 -->
    <div class="top-item">
      <div class="top-item-l">
        <div class="top-item-l-mb5">
          Pontos de sorte atuais
          <span class="yellow">{{ luckyPoints }}</span>
        </div>
        <div class="text-[1.2rem]">
          Você ainda precisa apostar
          <span class="white">{{ needBet }}</span>
          para obter
          <span class="yellow">{{ getLucky }}</span>
          Pontos de sorte
        </div>
      </div>
      <!-- <div class="nav-text">Detalhes</div> -->
    </div>

    <!-- 转盘组件 -->
    <div class="lottery-box w-full pt-[1rem]">
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
    
    <!-- 转盘按钮 -->
    <div class="top-button-group">
      <div
        v-for="(item, idx) in wheels"
        :key="item.name"
        class="button"
        :class="item.active ? ('button-bg' + item.level) : ''"
        @click="setActiveWheel(idx)"
      >
        <div>
          <div
            class="button-text1"
            :class="{ 'button-text3': item.highlight }"
          >
            {{ item.name }}
          </div>
          <div class="button-text2">
            {{ item.cost }} Pontos de Sorte
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 奖励通知 -->
  <div class="lucky-content">
    <div class="tab-box">
      <div class="tab">
        <div class="tab-item" :class="{ 'tab-item-active': currentTab === 'platform' }" @click="currentTab = 'platform'">
          <div class="tab-item-text">Notificação de Prêmio</div>
        </div>
        <!-- 我的记录，勿删 -->
        <!-- <div class="tab-item" :class="{ 'tab-item-active': currentTab === 'mine' }" @click="currentTab = 'mine'">
          <div class="tab-item-text">Meus Registros</div>          
        </div> -->
      </div>
    </div>

    <div class="list-box">
      <template v-if="currentTab === 'platform'">
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
      </template>
      <template v-else>
        <div v-if="userRecords.length === 0" class="flex items-center justify-center h-[25rem]">
          <img src="/constant/turntable/none.png" alt="" style="width:8rem;height:auto;" />
        </div>
        <div v-else>
          <div
            class="list-box-item"
            v-for="(item, index) in userRecords"
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
      </template>
    </div>
  </div>

  <!-- 活动说明 -->
  <div class="lucky-content intro">
    <div class="title">Instruções Do Evento:</div>
    <div class="intro-text" v-html="intro"></div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, nextTick } from 'vue'
import Turntable from '../../components/turntable/Turntable.vue'
import { rouletteApi } from '../../services/api'
import store from '../../stores'
import { eventBus } from '../../utils/eventBus'
import { $toast } from '../../components/common/toast'
const luckyPoints = computed(() => {
  const user = store.getters['auth/user']
  return (user && typeof user.bet_points === 'number') ? user.bet_points : 0
})
const needBet = ref(1)
const getLucky = ref('1.00')

type Wheel = { name: string; cost: number; level: 1 | 2 | 3; highlight?: boolean; theme: 'blue' | 'yellow' | 'purple'; active?: boolean }
type Prize = { id: string | number; label?: string; icon?: string }

const wheels = ref<Wheel[]>([
  { name: 'Roda de Prata', cost: 1500, level: 1, theme: 'blue', active: true },
  { name: 'Roda de Ouro', cost: 5555, level: 2, theme: 'yellow' },
  { name: 'Roda de Diamante', cost: 25555, level: 3, theme: 'purple', highlight: true }
])

const activeIndex = ref(0)
const rouletteCfg = ref<{ silver: { prizes: number[] }; gold: { prizes: number[] }; diamond: { prizes: number[] } } | null>(null)
const setActiveWheel = (idx: number) => {
  activeIndex.value = idx
  wheels.value = wheels.value.map((w, i) => ({ ...w, active: i === idx }))
  if (rouletteCfg.value) {
    updatePrizesFromConfig(rouletteCfg.value)
  }
}
const activeTheme = computed(() => wheels.value[activeIndex.value].theme)
const updatePrizesFromConfig = (cfg: { silver: { prizes: number[] }; gold: { prizes: number[] }; diamond: { prizes: number[] } }) => {
  const current = wheels.value[activeIndex.value].level
  const arr = current === 1 ? cfg.silver.prizes : current === 2 ? cfg.gold.prizes : cfg.diamond.prizes
  prizes.value = arr.map((val, i) => ({ id: i, label: String(val) }))
}
const activeLevel = computed(() => wheels.value[activeIndex.value].level)
const historyIcon = computed(() => `/constant/turntable/his${activeLevel.value}.png`)

const prizes = ref<Prize[]>([])
const selectedPrizeId = ref<string | number | undefined>(undefined)
const lastErrorMsg = ref<string | null>(null)
const turntableRef = ref<any>(null)
const handleStart = async () => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  if (!isAuthenticated) {
    eventBus.emit('open-login-modal', 'login')
    if (turntableRef.value && typeof turntableRef.value.resetWaiting === 'function') {
      turntableRef.value.resetWaiting()
    }
    return
  }
  const type = wheels.value[activeIndex.value].level === 1 ? 'silver' : wheels.value[activeIndex.value].level === 2 ? 'gold' : 'diamond'
  try {
    const resp = await rouletteApi.spin(type)
    if (resp.code === 1) {
      selectedPrizeId.value = undefined
      await nextTick()
      selectedPrizeId.value = resp.data.prize_index
      store.dispatch('auth/updateBalance', resp.data.balance_after)
    } else {
      lastErrorMsg.value = resp.msg ? String(resp.msg) : null
      selectedPrizeId.value = undefined
      await nextTick()
      selectedPrizeId.value = -1
    }
  } catch (e) {
    lastErrorMsg.value = 'Falha no sorteio, tente novamente'
    selectedPrizeId.value = undefined
    await nextTick()
    selectedPrizeId.value = -1
  }
}
const onSpun = (payload: { index: number; label?: string }) => {
  $toast.success(`Você ganhou: ${payload.label ?? `Prêmio ${payload.index + 1}`}`)
}
const onSpinError = () => {
  const msg = (lastErrorMsg.value && lastErrorMsg.value.trim()) ? lastErrorMsg.value.trim() : 'Falha no sorteio, tente novamente'
  $toast.error(msg)
  lastErrorMsg.value = null
}

type HistoryItem = { time: string; user: string; wheel: string; amount: string }
const currentTab = ref<'platform' | 'mine'>('platform')
const platformRecords = ref<HistoryItem[]>([])
const userRecords = ref<HistoryItem[]>([])
const maskName = (name: string) => {
  const stars = Math.random() < 0.5 ? 3 : 4
  if (name.length <= 1) return '*'.repeat(stars)
  if (name.length === 2) return name[0] + '*'.repeat(stars)
  return name[0] + '*'.repeat(stars) + name[name.length - 1]
}
const formatTime = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const hh = String(d.getHours()).padStart(2, '0')
  const mi = String(d.getMinutes()).padStart(2, '0')
  return `${dd}/${mm} ${hh}:${mi}`
}
const wheelsName = ['Roda de Prata', 'Roda de Ouro', 'Roda de Diamante']
const genPlatformRecords = () => {
  const base = Date.now()
  const raw: { ts: number; user: string; wheel: string; amount: string }[] = []
  for (let i = 0; i < 20; i++) {
    const ts = base - Math.floor(Math.random() * 3600 * 1000)
    const uname = maskName(Math.random().toString(36).slice(2, 10))
    const wheel = wheelsName[Math.floor(Math.random() * wheelsName.length)]
    const amount = (Math.floor(Math.random() * 90) + 10).toFixed(2)
    raw.push({ ts, user: uname, wheel, amount })
  }
  raw.sort((a, b) => b.ts - a.ts)
  return raw.map(r => ({
    time: formatTime(new Date(r.ts)),
    user: r.user,
    wheel: r.wheel,
    amount: r.amount
  }))
}
onMounted(() => {
  platformRecords.value = genPlatformRecords()
  rouletteApi.info().then(resp => {
    if (resp.code === 1 && resp.data?.roulette_config) {
      const cfg = resp.data.roulette_config
      rouletteCfg.value = cfg
      wheels.value = wheels.value.map(w => {
        if (w.level === 1) return { ...w, cost: cfg.silver.cost }
        if (w.level === 2) return { ...w, cost: cfg.gold.cost }
        return { ...w, cost: cfg.diamond.cost }
      })
      updatePrizesFromConfig(cfg)
    }
  })
})

const intro = `

I. Condições do Evento:<br>
Apostas acumuladoras (ou seja, apostas válidas ou em andamento)<br><br>
II. Plataforma Específica:<br>
- Cartas: Todos os Jogos, Pesca<br>
- Slots: Todos os Jogos, Caça-Níqueis<br>
- Todos os Jogos<br><br>
III. Instruções do Evento:<br>
1. Durante o período do evento, cada 1 aposta válida pode automaticamente ganhar um certo número de Números da Sorte.<br>
2. O valor de sorte obtido hoje não poderá ser usado no dia seguinte e será zerado.<br>
3. As recompensas só podem ser resgatadas manualmente no APP/iOS, APP/Android, PC/Windows.<br>
4. O bônus (excluindo o principal) apresentado neste evento só pode ser retirado após o cumprimento da exigência de apostas de 1 vez, com apostas limitadas a:<br>
5. Este evento está limitado a operações normais realizadas pelo titular da conta. É proibido alugar, usar plug-ins externos, robôs, apostar em diferentes contas, escovar mutuamente, arbitragem, interface, protocolo, exploração de vulnerabilidades, controle de grupo ou outros meios técnicos para participar. Caso contrário, as recompensas serão canceladas ou deduzidas, a conta será congelada ou até adicionada à lista negra.<br>
6. Para evitar diferenças na interpretação do texto, a plataforma manterá o direito final de interpretação deste evento.
            
`
</script>

<style scoped>
  .nav-text{
    font-size: 1rem;
    color: var(--color-active);
    cursor: pointer
  }
.top {
    padding: 0.75rem;
    box-sizing: border-box;
    background-color: var(--color-bg-primary);
    margin: 0.9375rem;
    border-radius: 0.9375rem
}

.top .top-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.09375rem solid var(--color-highlight-text);
    padding-bottom: 0.9375rem;
    margin-bottom: 1.875rem
}

.top .top-item .top-item-l {
    width: 80%;
    color: var(--color-inactive)
}

.top .top-item .top-item-l-mb5 {
    margin-bottom: 0.4rem;
    font-size: 1.4rem;
}

.top .lottery-box {
    display: flex;
    justify-content: center;
    margin-bottom: 1.875rem
}

.top .top-button-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem
}

.top .top-button-group .button {
    text-align: center;
    width: 13.125rem;
    height: 5.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color:#fff;
    border-radius: 0.9375rem;    
    cursor: pointer;
    position: relative;
    border: 1px solid #3a3a3a;
}

.top .top-button-group .button .button-text1 {
    font-size: 1.2rem;
}
.top .top-button-group .button .button-text2 {
    font-size: .95rem;
}
.yellow{
  color: var(--color-active)!important;
}



.top .top-button-group .button-bg1 {
    background: #1672f2
}

.top .top-button-group .button-bg2 {
    background: #ffaa09
}

.top .top-button-group .button-bg3 {
    background: #b751ff
}

.bottom-box {
    margin: 0.9375rem 0.9375rem 0
}

.lucky-content {
    background-color: var(--color-bg-primary);
    border-radius: 0.75rem;
    margin: 0.9375rem 0.9375rem 0;
    color: var(--color-inactive)
}

.intro {
    padding: 0.9375rem !important;
    color: var(--color-inactive);
    line-height: 1.5rem;
    font-size: .85rem
}
.list-box {
    padding: 0 0.625rem;
    height: 25rem;
    overflow-y: auto;
}

.list-box .list-box-item {
    border-bottom: 0.0625rem solid #42345c;
    padding: 0.8rem 0;
    color: var(--color-inactive);
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.list-box .list-box-item .list-box-item-m {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-right: 0.625rem;
}

.list-box .list-box-item .img-fluid {
    width: 2rem;
    height: 2rem;
    margin-right: 0.8rem;
}

.lucky {
    padding-bottom: 6.25rem;
}

.mrb-10 {
    margin-bottom: 0.625rem;
}
.tab-box {
    height: 4.625rem;
    display: flex;
    align-items: center;
    border-bottom: 0.0625rem solid #42345c;
}

.tab {
    width: 100%;
    overflow-x: auto;
    display: flex;
    justify-content: space-around;
    padding: 0 0.8rem;
    box-sizing: border-box;
    font-size: 1rem;
    user-select: none;
    align-items: center;
}

.tab .tab-item {
    flex-shrink: 0;
    color: #ffffffd9;
    padding: 0 0.5125rem 0.625rem;
    position: relative;
    cursor: pointer;
    font-size: 1.2rem;

}

.tab .tab-item-text {
    position: relative;
    font-size: 1.2rem;
}

.tab .tab-item-active .tab-item-text::after {
    content: "";
    border-bottom: 0.1875rem solid var(--color-active);
    position: absolute;
    left: 0;
    right: 0;
    bottom: -0.625rem;
}

.tab .tab-item-active,
.tab .tab-item:hover {
    color: var(--color-active);
}

.tab::-webkit-scrollbar {
    display: none;
}



</style>
