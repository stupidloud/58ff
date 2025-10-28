<template>
    <div>
        <div class="px-[.75rem] pt-[1.875rem]">
            <div
                class="bg-[url('/static/profile/vipCardBg1.png')] bg-no-repeat bg-[bottom_0_left_0] bg-[length:100%_11.25rem] h-[11.875rem] w-full pt-[1.25rem] px-[.8125rem] pb-[.8125rem] mb-[1rem] relative">
                <div
                    class="w-[7.0938rem] h-[2.875rem] px-[.625rem] border border-white absolute top-[-.75rem] right-[.125rem] flex justify-center items-center text-[.75rem] text-white opacity-20 rounded-[100px]">
                    Coletar Tudo >
                </div>
                <div>
                    <div class="flex items-center">
                        <div class="flex items-center relative h-[1.5rem]">
                            <img class="w-[2.375rem] h-[2.375rem] relative z-2" src="/static/profile/vip1.png" alt="">
                            <div
                                class="ml-[-1.25rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[4.5rem] h-[1.25rem] text-[.75rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                                VIP 0
                            </div>
                        </div>
                        <p class="ml-[.75rem] text-white/40 text-[.75rem] font-[700]">Nível Atual</p>
                    </div>
                    <div class="flex items-center mt-[2.375rem] justify-between">
                        <div class="releative w-[17.125rem] h-[.25rem] bg-white/20 rounded-[100px]">
                            <div class="w-[20%] h-full bg-[var(--color-active)] rounded-[100px]"></div>
                        </div>
                        <div class="flex items-center relative h-[1.5rem]">
                            <img class="w-[1.5rem] h-[1.5rem] relative z-2" src="/static/profile/vip2.png" alt="">
                            <div
                                class="ml-[-1rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[3.125rem] h-[1.105rem] text-[.65rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                                VIP 1
                            </div>
                        </div>
                    </div>
                    <p class="text-white/40 font-[700] mb-[.25rem] text-left text-[.75rem] mt-[.75rem]">Critérios de
                        Promoção</p>
                    <div class="flex items-center justify-start">
                        <p class="w-[3px] h-[3px] rounded-[100px] mr-[.625rem] bg-white/40"></p>
                        <p class="text-[.625rem] text-white/40"> Aposta necessária： </p>
                        <p class="text-[.625rem] text-white">
                            <span class="text-[var(--color-warning)] font-[700]">0,00</span>
                            (0,00/100,00)
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
            v-for="item in 35"
            :class="{ 'bg-black/5': item % 2 === 0 }"
            class="w-full h-[3.75rem] flex items-center">                
                <div class="flex items-center relative h-[1.5rem] flex-1 justify-center">
                    <img class="w-[2.375rem] h-[2.375rem] relative z-2" :src="`/static/promo/vip${item > 30 ? 30 : item}.png`" alt="">
                    <div class="ml-[-1.25rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[4.5rem] h-[1.25rem] text-[.75rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                        VIP {{ item }}
                    </div>
                </div>                 
                <template v-if="activeNav === 1">
                     <p class="text-white/40 text-[.6rem] flex-1">
                        {{ formatAmount(getAmount(item)) }}
                    </p>
                    <p class="text-[var(--color-warning)] font-[600] text-[.6rem] flex-1">
                        {{ formatAmount(getReward(item)) }}
                    </p>
                </template>                     
                 <template v-if="activeNav === 2">
                     <p class="text-white/40 text-[.6rem] flex-1">
                        {{ formatAmount(getValida(item)) }}
                    </p>
                    <p class="text-[var(--color-warning)] font-[600] text-[.6rem] flex-1">
                        {{ formatAmount(getBonus(item)) }}
                    </p>
                </template>   
                 <template v-if="activeNav === 3">
                     <p class="text-[.6rem] flex-1 text-[var(--color-warning)] font-[600]">
                        {{ formatAmount(getWeeklyBonus(item)) }}
                    </p>
                </template>   
                <template v-if="activeNav === 4">
                     <p class="text-[.6rem] flex-1 text-[var(--color-warning)] font-[600]">
                        {{ formatAmount(getMonthlyBonus(item)) }}
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
import { ref, onMounted, nextTick } from 'vue'

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




/*
这一块是模拟数据，我不知道真实是什么样的，要接真实直接替换算法就行了，如果只是展示就这样就行=。=
*/
// 计算充值金额
function getAmount(vip:number) {
  if (vip === 0) return 0
  if (vip <= 5) return 100 * Math.pow(3, vip - 1)
  if (vip <= 10) return 1000 * Math.pow(2, vip - 2)
  if (vip <= 20) return (vip - 10) * 2000000 + 1000000
  if (vip <= 30) return 16000000 + (vip - 20) * 4000000
  return 60000000 + (vip - 30) * 10000000
}

// 计算奖励
function getReward(vip:number) {
  if (vip === 0) return 0
  if (vip <= 5) return Math.round(getAmount(vip) * 0.001 + vip)
  if (vip <= 10) return Math.round(getAmount(vip) * 0.00035 + 10 * vip)
  if (vip <= 20) return Math.round(355 + (vip - 10) * 200)
  if (vip <= 30) return Math.round(2655 + (vip - 20) * 1000)
  return Math.round(12555 + (vip - 30) * 5000 + Math.pow(vip - 30, 2) * 500)
}


function getValida(vip:number) {
  if (vip === 0) return 0
  if (vip <= 1) return 0
  if (vip <= 2) return 3 * (vip - 1)
  if (vip <= 5) return 6 + (vip - 4) * 3
  if (vip <= 10) return 30 + (vip - 7) * 10
  if (vip <= 15) return 70 + (vip - 10) * 50
  if (vip <= 20) return 320 + (vip - 15) * 230
  if (vip <= 25) return 1450 + (vip - 20) * 600
  if (vip <= 30) return 4450 + (vip - 25) * 1500
  return 12050 + (vip - 30) * 1800
}

function getBonus(vip:number) {
  if (vip === 0) return 0
  if (vip === 1) return 0.1
  if (vip <= 5) return 0.2 + (vip - 2) * 0.3
  if (vip <= 10) return 1 + (vip - 5) * 1.5
  if (vip <= 15) return 7 + (vip - 10) * 8
  if (vip <= 20) return 47 + (vip - 15) * 30
  if (vip <= 25) return 197 + (vip - 20) * 80
  if (vip <= 30) return 597 + (vip - 25) * 250
  return 1847 + (vip - 30) * 700
}

function getWeeklyBonus(vip:number) {
  if (vip === 0 || vip === 1) return 0
  if (vip <= 2) return 1
  if (vip <= 6) return 1 + (vip - 2) * 1        // VIP3~6 每级+1
  if (vip <= 10) return 5 + (vip - 7) * 5       // VIP7~10 每级+5
  if (vip <= 20) return 25 + (vip - 11) * 30    // VIP11~20 每级+30
  if (vip <= 30) return 355 + (vip - 21) * 200  // VIP21~30 每级+200
  return 2555 + (vip - 30) * 1000               // VIP31~35 每级+1000
}
function getMonthlyBonus(vip:number) {
  if (vip === 0 || vip === 1) return 0
  if (vip === 2) return 1
  if (vip <= 4) return 1 + (vip - 2) * 2         // VIP3~4 每级+2
  if (vip <= 6) return 5 + (vip - 4) * 4         // VIP5~6 每级+4
  if (vip <= 7) return 12 + (vip - 6) * 3        // VIP7 每级+3
  if (vip <= 10) return 15 + (vip - 7) * 11      // VIP8~10 每级+11
  if (vip <= 15) return 49 + (vip - 10) * 100    // VIP11~15 每级+100
  if (vip <= 20) return 600 + (vip - 15) * 200   // VIP16~20 每级+200
  if (vip <= 25) return 1_800 + (vip - 20) * 300 // VIP21~25 每级+300
  if (vip <= 30) return 3_000 + (vip - 25) * 800 // VIP26~30 每级+800
  if (vip <= 34) return 7_000 + (vip - 30) * 2_000 // VIP31~34 每级+2,000
  return 15_000 + (vip - 34) * 10_555             // VIP35 单级暴增到 25,555
}
// 千分位格式化（1,000,000）
function formatAmount(num:number) {
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

onMounted(() => {
    // 使用setTimeout确保DOM完全渲染后再计算位置
    setTimeout(() => {
        updateIndicator()
    }, 100)
})
</script>
<style scoped></style>
