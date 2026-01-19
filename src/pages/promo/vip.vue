<template>
    <div>
        <div class="px-[.75rem] pt-[1.875rem]">
            <div
                class="bg-[url('/static/profile/vipCardBg1.png')] bg-no-repeat bg-[bottom_0_left_0] bg-[length:100%_11.25rem] h-[11.875rem] w-full pt-[1.25rem] px-[.8125rem] pb-[.8125rem] mb-[1rem] relative">
                <!-- <div
                    class="w-[7.0938rem] h-[2.875rem] px-[.625rem] border border-white absolute top-[-.75rem] right-[.125rem] flex justify-center items-center text-[.75rem] text-white opacity-20 rounded-[100px]">
                    Coletar Tudo >
                </div> -->
                <div>
                    <div class="flex items-center">
                        <div class="flex items-center relative h-[1.5rem]">
                            <img class="w-[2.375rem] h-[2.375rem] relative z-2" src="/static/profile/vip1.png" alt="">
                            <div
                                class="ml-[-1.25rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[4.5rem] h-[1.25rem] text-[.75rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                                VIP {{ currentVipLevel }}
                            </div>
                        </div>
                        <p class="ml-[.75rem] text-white/40 text-[.75rem] font-[700]">Nível Atual</p>
                    </div>
                    <div class="flex items-center mt-[2.375rem] justify-between">
                        <div class="releative w-[17.125rem] h-[.25rem] bg-white/20 rounded-[100px]">
                            <div class="h-full bg-[var(--color-active)] rounded-[100px]" :style="{ width: depositProgress + '%' }"></div>
                        </div>
                        <div class="flex items-center relative h-[1.5rem]">
                            <img class="w-[1.5rem] h-[1.5rem] relative z-2" src="/static/profile/vip2.png" alt="">
                            <div
                                class="ml-[-1rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[3.125rem] h-[1.105rem] text-[.65rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                                VIP {{ nextVipLevelLabel }}
                            </div>
                        </div>
                    </div>
                    <p class="text-white/40 font-[700] mb-[.25rem] text-left text-[.75rem] mt-[.75rem]">Critérios de
                        Promoção</p>
                    <div class="flex items-center justify-start">
                        <p class="w-[3px] h-[3px] rounded-[100px] mr-[.625rem] bg-white/40"></p>
                        <p class="text-[.625rem] text-white/40"> Aposta necessária： </p>
                        <p class="text-[.625rem] text-white">
                            <span class="text-[var(--color-warning)] font-[700]">{{ formatAmount(remainingBet) }}</span>
                            ({{ formatAmount(currentBet) }}/{{ formatAmount(nextTurnoverRequired) }})
                        </p>
                    </div>
                </div>
            </div>
            <p class="text-white pb-[1rem] text-left font-[600] text-[1rem]">Lista de níveis VIP</p>
        </div>
        <div class="sticky top-[3.1rem] z-[20] bg-[var(--color-main-bg)]">
            <div ref="navContainer"
                class="pt-[.75rem] flex items-center border-b border-[var(--color-bg-aside)] pl-[.625rem] overflow-x-auto scrollbar-hide bg-black/5 relative">
                <div v-for="item in navs" :key="item.id" ref="navItems"
                    :class="{ 'bg-[var(--color-bg-aside-2)] !text-[var(--color-active)] border-[var(--color-active)]': item.id === activeNav }"
                    class="flex items-center justify-center px-[.8rem] rounded-t-[.375rem] cursor-pointer h-[2.6rem] text-white/40 text-[.85rem] font-[400] whitespace-nowrap flex-shrink-0 transition-all duration-300"
                    @click="switchNav(item.id)">
                    {{ item.label }}
                </div>
                <div class="absolute bottom-0 h-[2px] bg-[var(--color-active)] transition-all duration-300 ease-out"
                    :style="{ left: indicatorLeft + 'px', width: indicatorWidth + 'px' }" v-show="indicatorWidth > 0">
                </div>
            </div>
            <div class="px-[.75rem] pt-[1.25rem]">
                <div class="w-full h-[3.75rem] bg-[var(--color-bg-aside-2)] flex items-center rounded-[.315rem]">
                    <p class="text-white/40 font-[700] text-[.75rem] flex-1">Nível</p>
                    <template v-if="activeNav === 1">
                        <p class="text-white/40 font-[700] text-[.75rem] flex-1">Aposta necessária</p>
                        <p class="text-white/40 font-[700] text-[.75rem] flex-1">Bônus</p>
                    </template>
                    <template v-if="activeNav === 2">
                        <p class="text-white/40 font-[700] text-[.75rem] flex-1">Aposta Válida Diária</p>
                        <p class="text-white/40 font-[700] text-[.75rem] flex-1">Bônus Diário</p>
                    </template>
                    <template v-if="activeNav === 3">
                        <p class="text-white/40 font-[700] text-[.75rem] flex-1">Bônus Semanal</p>                        
                    </template>
                    <template v-if="activeNav === 4">
                        <p class="text-white/40 font-[700] text-[.75rem] flex-1">Bônus Mensal</p>
                    </template>
                </div>
            </div>            
        </div>
        <div class="px-[.75rem]">
            <div 
            v-for="(level, idx) in vipLevels"
            :key="level.level"
            :class="{ 'bg-black/5': idx % 2 === 0 }"
            class="w-full h-[3.75rem] flex items-center">                
                <div class="flex items-center relative h-[1.5rem] flex-1 justify-center">
                    <img class="w-[2.375rem] h-[2.375rem] relative z-2" :src="`/static/promo/vip${level.level > 30 ? 30 : Number(level.level) + 1}.png`" alt="">
                    <div class="ml-[-1.25rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[4.5rem] h-[1.25rem] text-[.75rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                        VIP {{ level.level }}
                    </div>
                </div>                 
                <template v-if="activeNav === 1">
                     <p class="text-white/40 text-[.6rem] flex-1">
                        {{ formatAmount(level.turnover_requirement) }}
                    </p>
                    <p class="text-[var(--color-warning)] font-[600] text-[.6rem] flex-1">
                        {{ formatAmount(level.level_up_bonus) }}
                    </p>
                </template>                     
                 <template v-if="activeNav === 2">
                     <p class="text-white/40 text-[.6rem] flex-1">
                        {{ formatAmountDailyRequirement(level) }}
                    </p>
                    <p class="text-[var(--color-warning)] font-[600] text-[.6rem] flex-1">
                        {{ formatAmount(level.daily_bonus) }}
                    </p>
                </template>   
                 <template v-if="activeNav === 3">
                     <p class="text-[.6rem] flex-1 text-[var(--color-warning)] font-[600]">
                        {{ formatAmount(level.weekly_bonus) }}
                    </p>
                </template>   
                <template v-if="activeNav === 4">
                     <p class="text-[.6rem] flex-1 text-[var(--color-warning)] font-[600]">
                        {{ formatAmount(level.monthly_bonus) }}
                    </p>
                </template>   
            </div>

            <p class="text-white font-[600] py-[.25rem] text-left text-[.75rem] mt-[.5rem]">Instruções sobre regras VIP</p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Padrão de promoção: atenda aos requisitos da promoção VIP (ou seja, a recarga ou apostas eficazes podem atender às condições), você pode avançar para o nível VIP correspondente e obter o bônus de promoção correspondente.O bônus pode ser recebido de tempos em tempos;
            </p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Salário diário: Se a recarga diária e as apostas válidas atenderem aos requisitos salariais diários do nível atual, você poderá obter o bônus salarial diário correspondente. Se você avançar para vários níveis consecutivos, só poderá obter o bônus salarial diário do atual nível.O bônus pode ser recebido de tempos em tempos
            </p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Salário Semanal: Se a recarga semanal e as apostas válidas atenderem ao nível atual de requisitos salariais semanais, você poderá obter o bônus salarial semanal correspondente. Se você avançar para vários níveis consecutivos, poderá obter apenas o nível atual de bônus salarial semanal.O bônus pode ser recebido de tempos em tempos;
            </p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Salário mensal: Recarga mensal e apostas efetivadas para atender ao nível atual do salário mensal, e você pode obter o bônus de prêmio mensal correspondente.O bônus pode ser recebido de tempos em tempos;
            </p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Tempo de Expiração da Recompensa: A recompensa deve ser reivindicada manualmente, Bônus expirados e não reclamados serão imediatamente invalidados.
            </p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Instruções para auditoria: o bônus VIP oferecido pode ser levantado apenas após o cumprimento do requisito de rollover 1x (ou seja, auditoria, apostas ou apostas válidas), A aposta está limitada a Slot：PG,Tada,JDB,PP,CP,FaChai,POPOK,G759;
            </p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Declaração de Atividade: Esta funcionalidade é limitada apenas ao titular da conta para apostas normais. É proibido alugar contas, realizar apostas sem risco (arbitragem, apostas cruzadas, apostas de baixa probabilidade), arbitragem maliciosa, uso de programas de trapaça, robôs, exploração de protocolos, falhas, interfaces, controle em massa ou qualquer outro meio técnico. Após verificação de qualquer violação, a plataforma se reserva o direito de encerrar o acesso do membro, suspender o uso do site e confiscar bônus e ganhos indevidos, sem a necessidade de aviso prévio.
            </p>
            <p class="mt-[.75rem] text-[.75rem] text-white/40 text-left">
                Explicação: Ao receber as recompensas VIP, a plataforma considerará que o membro concorda e cumpre as condições correspondentes e outras regras relacionadas. Para evitar mal-entendidos de interpretação textual, a plataforma se reserva o direito final de interpretação desta atividade.
            </p>
            <div class="h-[8.5rem]"></div>
        </div>

        <div class="fixed bg-[var(--color-bg-aside-2)] bottom-[calc(106px+env(safe-area-inset-bottom))] left-0 right-0 px-[.75rem] py-[1.25rem] z-[20] max-w-[486px] mx-auto">
            <div class="flex items-center justify-center bg-[var(--color-active-2)] rounded-[.315rem] text-[.875rem] font-[700] text-white/40 h-[2.875rem]">                
                Reivindicar Recompensa Mensal
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue'
import { vipApi, type VipLevel } from '../../services/api'
import { useAuthStore } from '../../stores/auth'

const navs = ref([
    {
        id: 1,
        label: 'Bônus'
    },
    {
        id: 2,
        label: 'Bônus Diário'
    },
    {
        id: 3,
        label: 'Bônus Semanal'
    },
    {
        id: 4,
        label: 'Bônus Mensal'
    },
])

const activeNav = ref(1)
const navContainer = ref<HTMLElement>()
const navItems = ref<HTMLElement[]>([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)
const vipLevels = ref<VipLevel[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const auth = useAuthStore()
const currentVipLevel = computed(() => auth.user?.vip_level ?? 0)
const nextLevelObj = computed(() => vipLevels.value.find(l => l.level === currentVipLevel.value + 1) || null)
const currentDeposit = computed(() => auth.user?.total_deposit ?? 0)
const currentBet = computed(() => auth.user?.total_bet ?? 0)
const nextTurnoverRequired = computed(() => nextLevelObj.value?.turnover_requirement ?? 0)
const remainingBet = computed(() => Math.max(0, nextTurnoverRequired.value - currentBet.value))
const depositProgress = computed(() => {
  const req = nextLevelObj.value?.deposit_requirement ?? 0
  if (req <= 0) return 0
  return Math.min(100, (currentDeposit.value / req) * 100)
})
const nextVipLevelLabel = computed(() => {
  const next = currentVipLevel.value + 1
  return next
})
const formatAmountDailyRequirement = (level: VipLevel) => {
  // 若接口无每日有效投注要求，显示 “—”
  return level.daily_deposit_rebate_rate ? `${level.daily_deposit_rebate_rate}%` : '—'
}
function formatAmount(num:number) {
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
async function fetchVipRequirements() {
  loading.value = true
  error.value = null
  try {
    const resp = await vipApi.getRequirements()
    if (resp.code === 1) {
      vipLevels.value = resp.data.levels || []
    } else {
      error.value = resp.msg || 'Falha ao obter dados VIP'
    }
  } catch (e:any) {
    error.value = e?.message || 'Erro de rede'
  } finally {
    loading.value = false
  }
}

// 计算指示线位置和宽度
const updateIndicator = () => {
    if (!navItems.value || !navContainer.value) return

    const activeIndex = navs.value.findIndex(nav => nav.id === activeNav.value)
    if (activeIndex === -1) return

    const activeItem = navItems.value[activeIndex]
    if (!activeItem) return

    // 获取容器的实际padding值
    const containerStyle = getComputedStyle(navContainer.value)
    const containerPaddingLeft = parseFloat(containerStyle.paddingLeft) || 0

    // 指示线位置 = 激活项的offsetLeft（这已经是相对于容器的位置）
    // 不需要减去padding，因为offsetLeft已经包含了padding的影响
    indicatorLeft.value = activeItem.offsetLeft
    indicatorWidth.value = activeItem.offsetWidth

}

// 切换导航
const switchNav = (navId: number) => {
    activeNav.value = navId
    nextTick(() => {
        updateIndicator()
        scrollToActiveItem()
    })
}

// 滚动到激活的项目
const scrollToActiveItem = () => {
    if (!navContainer.value || !navItems.value) return

    const activeIndex = navs.value.findIndex(nav => nav.id === activeNav.value)
    if (activeIndex === -1) return

    const activeItem = navItems.value[activeIndex]
    if (!activeItem) return

    const container = navContainer.value
    const containerWidth = container.clientWidth
    const itemLeft = activeItem.offsetLeft
    const itemWidth = activeItem.offsetWidth

    // 计算滚动位置，让激活项居中显示
    const scrollLeft = itemLeft - (containerWidth - itemWidth) / 2

    container.scrollTo({
        left: Math.max(0, scrollLeft),
        behavior: 'smooth'
    })
}




onMounted(() => {
    // 使用setTimeout确保DOM完全渲染后再计算位置
    setTimeout(() => {
        updateIndicator()
    }, 100)
    fetchVipRequirements()
})
</script>
<style scoped></style>
