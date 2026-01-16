<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <div class="bg-[url('/static/profile/headerBg.png')] bg-no-repeat bg-cover bg-center bg-[var(--color-bg-aside-2)] pt-[.6875rem] px-[.75rem] pb-[1rem] sticky z-20 top-0 rounded-b-[1rem]">
            <div class="flex items-center h-[5.5rem]">
                <img class="w-[3.25rem] h-[3.25rem] rounded-[100px]" src="/static/profile/avatar.jpg" alt="">
                <div class="ml-[1rem]">
                    <div class="flex items-center">
                        <p class="text-white font-[600] text-[.875rem] text-left">{{ username }} </p>
                        <div class="flex items-center relative h-[1.5rem] ml-[.4375rem]">
                            <img class="w-[1.5rem] h-[1.5rem] relative z-2" :src="vipImagePath" alt="">
                            <div class="ml-[-1rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[3.125rem] h-[1.105rem] text-[.65rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                                VIP {{ currentVipLevel }}
                            </div>
                        </div>                        
                    </div>
                    <div class="flex items-center">
                        <p class="text-white/40 text-[.75rem]"> ID: {{ userId }} </p>
                        <ion-icon class="text-[var(--color-active)] text-[1rem] ml-[.4375rem] cursor-pointer" name="copy-outline" @click="copyId" aria-label="Copiar ID"></ion-icon>
                    </div>
                </div>
            </div>
            <div class="flex gap-[.75rem] items-center">
                <div class="flex-1 w-full relative pb-[.6rem] overflow-hidden">
                  <div class="absolute rounded-full w-[100.58px] h-[35px] top-[70px] left-[52px] bg-[#CB5563] blur-[24px] z-2"></div>
                    <p class="text-white/40 text-[.6rem]">Saldo</p>
                    <div class="flex items-center justify-between w-full">
                        <p class="text-[1rem] font-[700] text-white w-full mt-[.15rem] flex items-center justify-center">
                            <span class="ml-[.25rem] !text-[var(--color-warning)]">R$</span>
                            <span class="ml-[.25rem] w-[3rem]">{{ formattedBalance }}</span>
                            <span class="ml-[1rem] inline-flex" :class="{ 'animate-[spin_0.2s_linear_4]': isRefreshing }" @click="onRefresh" aria-label="Atualizar saldo">
                                <ion-icon class="text-[1rem] text-white cursor-pointer" name="refresh"></ion-icon>
                            </span>
                        </p>                        
                    </div>
                </div>
                 <div class="flex-1 w-full relative pb-[.6rem] overflow-hidden">
                  <div class="absolute rounded-full w-[100.58px] h-[35px] top-[70px] left-[52px] bg-[#CB5563] blur-[24px] z-2"></div>
                    <p class="text-white/40 text-[.6rem]">O bônus recebido hoje</p>
                    <div class="flex items-center justify-between w-full">
                        <p class="text-[1rem] font-[700] text-white w-full mt-[.15rem] flex items-center justify-center">
                            <span>0.10</span>
                        </p>
                    </div>
                </div>
            </div>            
            <div class="h-[1px] w-full bg-[var(--color-border-2 )]"></div>
            <div class="flex items-center w-full gap-[.75rem] mt-[1.1rem]">
              <div class="bg-[var(--color-bg-aside)] rounded-[.375rem] shadow-[inset_0_-26px_20px_-24px_rgba(215,251,103,0.4)] h-[2.5rem] flex-1 flex items-center justify-center cursor-pointer" @click="router.push('/deposito')">
                <div class="w-[1.875rem] h-[1.875rem] text-[var(--color-active)] mr-[.375rem]  flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" class="w-[1.875rem] h-[1.875rem]">
                    <path d="M16.81 7.668a.378.378 0 0 1 .338.09c.084.081.11.196.066.299-.404.94-.592 1.485-.61 2.156.77.268 1.397.68 1.867 1.226.508.59.71 1.197.788 1.609.018.01.07.03.18.03h.636c.539 0 .978.378.978.843v1.644c0 .464-.439.842-.978.842h-.636c-.187 0-.239.061-.327.222-.468.84-1.199 1.51-2.114 1.938-.073.035-.098.065-.102.077v.025c.01.014.018.03.025.045l.201.46a.756.756 0 0 1-.022.667.965.965 0 0 1-.568.46l-1.256.41a1.159 1.159 0 0 1-.36.058c-.418 0-.797-.225-.947-.559a9.454 9.454 0 0 1-.282-.642.58.58 0 0 0-.032-.07h-.033c-.079 0-.198.01-.348.024-.31.029-.778.072-1.468.072-.765 0-1.24-.085-1.555-.142-.103-.018-.194-.036-.25-.04a.801.801 0 0 0-.053.103c-.133.305-.298.676-.304.69-.149.337-.53.564-.95.564-.123 0-.243-.02-.359-.058l-1.259-.41a.962.962 0 0 1-.565-.46.758.758 0 0 1-.019-.677c.007-.014.225-.465.344-.781.044-.116.017-.135-.095-.21l-.028-.018c-.763-.526-2.052-1.638-2.127-3.181a5.323 5.323 0 0 1 .17-1.67 3.103 3.103 0 0 1-.703-.296c-.587-.344-.897-.832-.897-1.41 0-.61.382-1.148.974-1.368.173-.064.375.005.45.154.074.15-.006.323-.18.387a.858.858 0 0 0-.56.828c0 .373.195.68.582.912.2.12.404.19.528.227a4.288 4.288 0 0 1 1.585-1.903c1.497-1.004 3.221-1.492 5.27-1.492.735 0 1.457.065 2.15.193.588-.968 1.525-1.58 2.855-1.868Zm-.215 5.286c-.414 0-.75.312-.75.696.001.385.336.697.75.697.413 0 .747-.312.747-.697 0-.384-.334-.696-.747-.696ZM9.561 2.77c2.117 0 3.834 1.726 3.834 3.855a3.86 3.86 0 0 1-.373 1.661c-3.22-.353-5.247.452-6.224 1.012a3.854 3.854 0 0 1-1.07-2.673c0-2.13 1.716-3.855 3.833-3.855ZM8.488 5.544v2.16h2.146v-2.16H8.488Z"></path>
                  </svg>
                </div>
                <p class="texy-[.875rem] font-[600] text-white">Depósito</p>
              </div>
              <div class="bg-[var(--color-bg-aside)] rounded-[.375rem] shadow-[inset_0_-26px_20px_-24px_rgba(215,251,103,0.4)] h-[2.5rem] flex-1 flex items-center justify-center cursor-pointer" @click="handleSaqueClick">
                <div class="w-[1.875rem] h-[1.875rem] text-[var(--color-active)] mr-[.375rem] flex items-center justify-center">
                  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-[1.875rem] h-[1.875rem]">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M23.6719 10.8008H4.92188V22.832C4.92188 24.2127 6.04116 25.332 7.42187 25.332H23.6719C25.0526 25.332 26.1719 24.2127 26.1719 22.832V20.5371H21.9531C20.5616 20.5371 19.4336 19.4091 19.4336 18.0176C19.4336 16.6261 20.5616 15.498 21.9531 15.498H26.1719V13.3008C26.1719 11.9201 25.0526 10.8008 23.6719 10.8008Z" fill="currentColor"></path>
                    <path d="M4.92188 9.35547H18.6719V8.08404C18.6719 6.70333 17.5526 5.58404 16.1719 5.58404H7.42188C6.04116 5.58404 4.92188 6.70333 4.92188 8.08404V9.35547Z" fill="currentColor"></path>
                    <circle cx="22.0605" cy="18.0664" r="0.810547" fill="currentColor"></circle>
                  </svg>
                </div>
                <p class="texy-[.875rem] font-[600] text-white">Saque</p>
              </div>
            </div>
        </div>
        <div class="py-[1rem] px-[.75rem] mt-[.75rem]">
          <div :style="{ backgroundImage: `url(${vipBgPath})`, backgroundSize: '100% 11.25rem', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom 0 left 0' }" class="h-[11.875rem] w-full pt-[1.25rem] px-[.8125rem] pb-[.8125rem] mb-[1rem] relative">
            <div class="w-[7.0938rem] h-[2.875rem] px-[.625rem] bg-[url('/static/profile/vipDetail1.png')] bg-no-repeat bg-cover bg-center absolute top-[-.75rem] right-[.125rem] flex justify-center items-center text-[.75rem] text-white">
              Detalhes VIP >
            </div>
            <div>
              <div class="flex items-center">
                <div class="flex items-center relative h-[1.5rem]">
                    <img class="w-[2.375rem] h-[2.375rem] relative z-2" :src="vipImagePath" alt="">
                    <div class="ml-[-1.25rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[4.5rem] h-[1.25rem] text-[.75rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                        VIP {{ currentVipLevel }}
                    </div>
                </div>         
                <p class="ml-[.75rem] text-white/40 text-[.75rem] font-[600]">Nível Atual</p>
              </div>
              <div class="flex items-center mt-[2.375rem] justify-between">
                <div class="releative w-[17.125rem] h-[.25rem] bg-white/20 rounded-[100px]">
                  <div class="h-full bg-[var(--color-active)] rounded-[100px]" :style="{ width: depositPercent }"></div>
                </div>
                <div class="flex items-center relative h-[1.5rem]">
                    <img class="w-[1.5rem] h-[1.5rem] relative z-2" :src="nextVipImagePath" alt="">
                    <div class="ml-[-1rem] bg-[url('/static/profile/vipTextSvg1.svg')] bg-no-repeat bg-center bg-[length:100%_100%] w-[3.125rem] h-[1.105rem] text-[.65rem] font-[600] text-white flex items-center justify-center indent-[.7em]">
                        VIP {{ currentVipLevel + 1 }}
                    </div>
                </div>  
              </div>
              <p class="text-white/40 font-[700] mb-[.25rem] text-left text-[.75rem] mt-[.75rem]">Critérios de Promoção</p>
              <div class="flex items-center justify-start">
                <p class="w-[3px] h-[3px] rounded-[100px] mr-[.625rem] bg-white/40"></p>
                <p class="text-[.625rem] text-white/40"> Aposta necessária： </p>
                <p class="text-[.625rem] text-white">
                  <span class="text-[var(--color-warning)]">{{ betCurrentDisplay }}</span>
                  ({{ betCurrentDisplay }}/{{ betMaxDisplay }})
                </p>
              </div>
            </div>
          </div>
          <!-- 这个项目没有客服 -->
          <!-- <div class="px-[1rem] bg-[var(--color-bg-aside-2)] rounded-[.375rem] h-[3rem] flex items-center">
            <div class="w-[1.5rem] h-[1.5rem] bg-[var(--color-active)] mask-[url('/static/profile/customer.svg')] bg-no-repeat bg-contain"></div>
            <p class="ml-[.625rem] text-white text-[.75rem] font-[500]">Suporte</p>
            <div class="ml-auto flex-1 pr-[1rem] flex items-center justify-end">
              <p class="bg-[var(--color-active)] w-[2rem] h-[1.125rem] flex items-center justify-center text-[.75rem] text-white rounded-[999px]">23</p>
            </div>
            <ion-icon class="ml-auto text-[.875rem] text-white/40" name="chevron-forward-outline"></ion-icon>
          </div>    -->
          
          
          <div class="rounded-[.375rem] overflow-hidden mt-[.75rem]">
            <div 
            v-for="item in navs"
            :key="item.icon"
            @click="handleNavClick(item)"
            class="px-[1rem] bg-[var(--color-bg-aside-2)] h-[3rem] flex items-center">
              <div
                class="w-[1.5rem] h-[1.5rem] bg-white/60 bg-no-repeat bg-center bg-contain"
                :style="{
                  WebkitMaskImage: `url(/static/profile/${item.icon})`,
                  maskImage: `url(/static/profile/${item.icon})`,
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat'
                }"
              />
              <p class="ml-[.625rem] text-white text-[.75rem] font-[500]">{{ item.label }}</p>              
              <div v-if="item.icon == 'convidar.svg'" class="flex-1 pr-[.25rem] flex items-center justify-end" >
                <p class="text-right text-[.625rem] font-[400] text-white/40">
                  Convide 1 pessoa e ganhe R$ 51,50 com comissão da agência de até 5,0%
                </p>
              </div>

              <ion-icon class="ml-auto text-[.875rem] text-white/40" name="chevron-forward-outline"></ion-icon>
            </div>
          </div>   

        </div>

        
        <Tabbar></Tabbar>
        <WithdrawPassAlert v-show="showWithdrawPass" @close="showWithdrawPass = false"></WithdrawPassAlert>
    </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import WithdrawPassAlert from './password/WithdrawPassAlert.vue'
import { useRouter } from 'vue-router'
import { playerApi, vipApi, type VipLevel } from '../services/api'
const router = useRouter()
const auth = useAuthStore()
const showWithdrawPass = ref(false)

type NavItem = { icon: string; label: string; routerName?: string }

// 处理Saque按钮点击事件
const handleSaqueClick = () => {
  // 如果没有设置提现密码，显示WithdrawPass弹窗
  if (!auth.hasWithdrawPassword) {
    showWithdrawPass.value = true
  } else {
    // 跳转到提现页面
    router.push('/withdraw')
  }
}
const handleNavClick = async (item: NavItem) => {
  if (item.icon === 'logout.svg') {
    await auth.logout()
    window.showToast?.('Saiu com sucesso')
    router.push('/')
    return
  }
  if (item.routerName) {
    router.push(item.routerName)
  }
}
const navs = ref([
  {
    icon: 'detail.svg',
    label: 'Relatórios'
  },
  {
    icon: 'convidar.svg',
    label: 'Convidar',
    routerName: 'convidar'
  },
  {
    icon: 'resgate.svg',
    label: 'Código de Resgate'
  },
  {
    icon: 'security.svg',
    label: 'Centro de Segurança'
  },
  {
    icon: 'logout.svg',
    label: 'Sair'
  }
])

const username = computed(() => auth.username)
const userId = computed(() => String(auth.user?.id ?? ''))

const currentVipLevel = computed(() => auth.vipLevel)
const vipLevels = ref<VipLevel[]>([])
const vipBgPath = computed(() => {
  const l = currentVipLevel.value
  if (l >= 25) return '/static/promo/levelBg6.png'
  if (l >= 20) return '/static/promo/levelBg5.png'
  if (l >= 15) return '/static/promo/levelBg4.png'
  if (l >= 10) return '/static/promo/levelBg3.png'
  if (l >= 5) return '/static/promo/levelBg2.png'
  return '/static/promo/levelBg1.png'
})
const vipImagePath = computed(() => {
  const l = Math.max(1, Math.min(30, currentVipLevel.value || 1))
  return `/static/promo/vip${l}.png`
})
const nextVipImagePath = computed(() => {
  const l = Math.max(1, Math.min(30, (currentVipLevel.value || 0) + 1))
  return `/static/promo/vip${l}.png`
})
const betCurrent = computed(() => auth.user?.total_bet || 0)
const betMax = computed(() => {
  const next = vipLevels.value.find(v => v.level === (currentVipLevel.value + 1))
  return next?.turnover_requirement || 0
})
const betPercent = computed(() => {
  const max = betMax.value || 1
  return Math.min(100, Math.round((betCurrent.value / max) * 100)) + '%'
})
const depositCurrent = computed(() => auth.user?.total_deposit || 0)
const depositMax = computed(() => {
  const next = vipLevels.value.find(v => v.level === (currentVipLevel.value + 1))
  return next?.deposit_requirement || 0
})
const depositPercent = computed(() => {
  const max = depositMax.value || 1
  return Math.min(100, Math.round((depositCurrent.value / max) * 100)) + '%'
})
const numberFormatter2 = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const betCurrentDisplay = computed(() => numberFormatter2.format(betCurrent.value))
const betMaxDisplay = computed(() => numberFormatter2.format(betMax.value))
const depositCurrentDisplay = computed(() => numberFormatter2.format(depositCurrent.value))
const depositMaxDisplay = computed(() => numberFormatter2.format(depositMax.value))

const copyId = async () => {
  const text = userId.value
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.top = '0'
      textarea.style.left = '0'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
    window.showToast?.('Cópia Bem-sucedida')
    console.log('Copied to clipboard:', text)
  } catch (err) {
    window.showToast?.('Cópia Falhou')
    console.error('Copy failed:', err)
  }
}

// Balance animation state
const isRefreshing = ref(false)
const targetBalance = ref<number>(auth.balance)
const animatedBalance = ref<number>(targetBalance.value)

const numberFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const formattedBalance = computed(() => numberFormatter.format(animatedBalance.value))

function animateNumber(from: number, to: number, duration: number, onUpdate: (val: number) => void, onDone?: () => void) {
  const start = performance.now()
  function tick(now: number) {
    const t = Math.min((now - start) / duration, 1)
    const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t // easeInOutQuad
    onUpdate(from + (to - from) * eased)
    if (t < 1) {
      requestAnimationFrame(tick)
    } else {
      onDone && onDone()
    }
  }
  requestAnimationFrame(tick)
}

function onRefresh() {
  if (isRefreshing.value) return
  isRefreshing.value = true
  ;(async () => {
    try {
      const res = await playerApi.getBalance()
      if (res.code === 1) {
        animatedBalance.value = 0
        targetBalance.value = res.data.balance
        await auth.updateBalance(res.data.balance)
        animateNumber(0, targetBalance.value, 800, (v) => {
          animatedBalance.value = v
        }, () => {
          isRefreshing.value = false
        })
      } else {
        isRefreshing.value = false
      }
    } catch {
      isRefreshing.value = false
    }
  })()
}

animatedBalance.value = auth.balance
;(async () => {
  try {
    const res = await vipApi.getRequirements()
    if (res.code === 1) {
      vipLevels.value = res.data.levels || []
    }
  } catch {}
})()
</script>
<style scoped>

</style>
