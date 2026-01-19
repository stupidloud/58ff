<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Missão'"></NavBar>
    <div class="p-[.6rem] px-[.2rem]">
      <div class="rounded-[.5rem] bg-[var(--color-bg-aside-2)] p-[.75rem] mb-[1rem]">
        <div class="flex items-center justify-between">
          <div class="text-left">
            <p class="text-[.9rem] text-[var(--color-active)] font-[700]">Depósito + 60%</p>
            <p class="text-[.6rem] text-white/80">Recarregue todos os dias e receba bônus todos os dias!</p>
          </div>
          <img class="w-[5rem] h-auto" src="/recharge/calendar.png" alt="">
        </div>
        <div class="mt-[.75rem] rounded-[.5rem] bg-[var(--color-tabbar)] p-[.75rem]">
          <p class="text-white text-[.7rem] mb-[.5rem]">
            Já foi contactado para o check-in por
            <span class="text-[var(--color-active)] font-[700]">{{ consecutiveDays }}</span>
            dias consecutivos
          </p>
          <div class="grid grid-cols-4 gap-[.5rem]">
            <div
              v-for="(item, index) in rewardList"
              :key="index"
              class="rounded-[.5rem] text-center p-[.5rem]"
              :class="index < activeCount ? 'border border-[var(--color-active)] bg-[var(--color-tabbar-2)]' : 'border border-transparent bg-[var(--color-tabbar-2)]'"
            >
              <div :class="index < activeCount ? 'text-[var(--color-active)]' : 'text-white'" class="font-[700] text-[.8rem] mb-[.25rem]">
                {{ item.day }}
              </div>
              <img class="w-[2.5rem] mx-auto" src="/recharge/jinbi.png" alt="">
              <div :class="index < activeCount ? 'text-[var(--color-active)]' : 'text-white/70'" class="font-[700] text-[.7rem]">
                +{{ item.amount }}
              </div>
            </div>
          </div>
          <div
            class="mt-[.75rem] h-[2.5rem] rounded-[2rem] flex items-center justify-center font-[700] text-[.8rem]"
            :class="canSign ? 'bg-[var(--color-active)] text-white cursor-pointer' : 'bg-[var(--color-bg-aside)] text-[var(--color-active)] border border-[var(--color-active)] opacity-80 cursor-not-allowed'"
            @click="handleSign"
          >
            {{ isAuthenticated ? 'Receber recompensa' : 'Entrar' }}
          </div>
          <div
            class="mt-[.5rem] h-[2.5rem] rounded-[2rem] flex items-center justify-center font-[700] text-[.8rem] text-[var(--color-active)] border border-[var(--color-active)] cursor-pointer"
            @click="showDetail"
          >
            Detalhes
          </div>
        </div>
      </div>      
      <div class="flex flex-col gap-[.5rem]">
        <div
          v-for="(img, idx) in cardList"
          :key="idx"
          class="rounded-[.5rem] overflow-hidden"
        >
          <img :src="img" class="w-full h-auto" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { depositApi } from '../../../services/api'
import { dailyCheckinApi } from '../../../services/api'
import { showToast } from '../../../components/toast/service'
import { useRouter } from 'vue-router'

const router = useRouter()
const auth = useAuthStore()
const isAuthenticated = computed(() => auth.isLoggedIn)
const consecutiveDays = ref(0)
const canSign = ref(false)
const rewardList = ref<Array<{ day: string; amount: string }>>([])
const minDepositRequirement = ref(10)
const cardList = ref([
  '/variable/banner1.png',
  '/variable/banner2.png',
  '/variable/banner3.png',
  '/variable/banner4.png',
  '/variable/banner5.png'
])

const activeIndex = computed(() => {
  const total = rewardList.value.length
  if (total === 0) return -1
  const hasMore = rewardList.value[total - 1]?.day === 'Mais'
  const actualLen = hasMore ? total - 1 : total
  const idx = consecutiveDays.value - 1
  if (idx < 0) return -1
  return Math.min(idx, Math.max(actualLen - 1, 0))
})
const activeCount = computed(() => {
  const total = rewardList.value.length
  if (total === 0) return 0
  const hasMore = rewardList.value[total - 1]?.day === 'Mais'
  const actualLen = hasMore ? total - 1 : total
  if (consecutiveDays.value <= 0) return 0
  return Math.min(consecutiveDays.value, Math.max(actualLen, 0))
})

async function initCheckinInfo() {
  try {
    const resp = await dailyCheckinApi.info()
    if (resp.code === 1 && (resp.data as any)) {
      const bonuses = (resp.data as any).daily_bonuses || []
      const mapped = bonuses.map((b: any) => ({
        day: `Dia ${b.day}`,
        amount: (b.bonus).toFixed(2)
      }))
      const lastBonus = bonuses.length > 0 ? bonuses[bonuses.length - 1].bonus : 0
      rewardList.value = [...mapped, { day: 'Mais', amount: (lastBonus).toFixed(2) }]
      minDepositRequirement.value = (resp.data as any).min_deposit_requirement ?? minDepositRequirement.value
    }
    const dep = await depositApi.getHistory()
    if (dep.code === 1 && dep.data && Array.isArray((dep.data as any).deposits)) {
      const depositByDate = new Map<string, number>()
      ;(dep.data as any).deposits
        .filter((d: any) => d.payment_status === 1)
        .forEach((d: any) => {
          const dateStr = (d.created_at || '').split(' ')[0]
          if (dateStr) {
            const prevAmount = depositByDate.get(dateStr) || 0
            depositByDate.set(dateStr, prevAmount + (d.amount || 0))
          }
        })
      const toDateStr = (d: Date) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      }
      const today = new Date()
      let count = 0
      for (let i = 0; i < 8; i++) {
        const dt = new Date(today)
        dt.setDate(today.getDate() - i)
        const key = toDateStr(dt)
        const dayAmount = depositByDate.get(key) || 0
        if (dayAmount >= minDepositRequirement.value) {
          count++
        } else {
          break
        }
      }
      consecutiveDays.value = count
      canSign.value = isAuthenticated.value && consecutiveDays.value > 0
    }
  } catch (e) {
    showToast('Falha ao carregar informações de check-in')
    canSign.value = false
  }
}

async function handleSign() {
  if (!isAuthenticated.value) {
    showToast('Por favor, faça login')
    return
  }
  if (!canSign.value) return
  consecutiveDays.value = Math.min(consecutiveDays.value, 7)
  try {
    const resp = await dailyCheckinApi.claim()
    if (resp.code === 1) {
      const reward_amount = (resp.data as any).reward_amount
      const balance_after = (resp.data as any).balance_after
      showToast(`Resgate bem-sucedido +${Number(reward_amount).toFixed(2)}`)
      await auth.updateBalance(balance_after)
      canSign.value = false
    } else {
      let msg = resp.msg
      if (resp.code === 4002) {
        msg = 'Depósito de hoje insuficiente'
        router.push('/deposito')
      } else if (resp.code === 4003) {
        msg = 'Você já recebeu a recompensa de hoje'
      } else {
        msg = msg || 'Falha ao receber recompensa'
      }
      showToast(msg)
    }
  } catch (error) {
    showToast('Erro de rede, falha ao resgate')
  }
}

function showDetail() {
  if (!isAuthenticated.value) {
    showToast('Por favor, faça login')
    return
  }
  router.push('/promo/event/missao-detail')
}

onMounted(() => {
  initCheckinInfo()
  canSign.value = isAuthenticated.value
})
</script>

<style scoped></style>
