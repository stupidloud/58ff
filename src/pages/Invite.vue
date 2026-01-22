<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <NavBar :canReturn="true" :title="'Indique amigos para receber um bônus'">
          <template #right>
            <div class="p-[.6rem] flex items-center justify-center cursor-pointer" @click="goConvidar">
                <ion-icon name="receipt-outline" class="text-white text-[1rem]"></ion-icon>
            </div>
          </template>
        </NavBar>
        <div class="p-[.75rem] w-full">
            <div class="w-full rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] py-[0]">
                <div class="flex items-center justify-between h-[3.35rem] border-b border-[var(--color-border-2)]">
                    <p class="text-white text-[.75rem] text-left">
                        Meu link:
                        <span class="text-[var(--color-text-link)]">{{ inviteLink }}</span>
                    </p>
                    <div class="flex items-center justify-center w-[3.25rem] h-[1.75rem] hover:bg-white/5 rounded-[.375rem] cursor-pointer" @click="copyAppUrl">
                        <ion-icon class="text-white text-[1rem]" name="copy-outline"></ion-icon>
                    </div>
                </div>
                <p class="text-left text-white text-[.75rem] mt-[.5rem]">Compartilhamento Rápido</p>
                <div class="mt-[.2rem] gap-[.39rem] flex flex-nowrap items-center justify-start overflow-x-auto no-scrollbar py-[.5rem] border-b border-[var(--color-border-2)]">
                    <img 
                    v-for="item in plats"
                    class="w-[2.25rem] h-[2.25rem] flex-shrink-0 hover:opacity-80"
                    :src="'/static/invite/' + item" alt="">
                </div>
                <div class="py-[1.25rem] flex items-center justify-between">
                    <p class="text-white text-[.75rem] text-left">
                        Meus subordinados diretos 
                        <span class="text-[#53C154]">{{ directReferralsCount }}Pessoa</span>
                        <br />
                         (Válido {{ validReferralsCount }}Pessoa)
                    </p>
                    <p class="text-[var(--color-text-link)] text-[.75rem] cursor-pointer" @click="goConvidar">
                        Detalhes >
                    </p>

                </div>
            </div>

            <div class="mt-[1rem] w-full rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] flex-wrap flex">
              <div
                v-for="(box, index) in treasureBoxes"
                :key="box.id"
                class="relative flex justify-between items-center mb-[.625rem]"
                :class="(index + 1) % 4 === 0 ? 'w-[calc(25%_-_1rem)] grow-0' : 'w-[25%] grow'"
                @click="handleBoxClick(box)"
                :data-status="box.is_claimed"
              >
                <div class="relative w-[4.25rem]">
                  <img class="w-[4.25rem]" src="/static/invite/treasureBoxClose.png" alt="">
                  <p class="text-[.6875rem] absolute top-[2.56rem] text-center left-0 right-0 font-[700] text-white">
                    {{ formatCurrency(box.reward_amount) }}
                  </p>
                  <p class="text-white mt-[.625rem] text-[.65rem] leading-[.9rem]">
                    Promoção <span>{{ box.invite_count }}</span>
                    <br />
                    Pessoa
                  </p>
                  <span
                    class="top-[.25rem] right-[.25rem] text-[.625rem] px-[.375rem] py-[.125rem] rounded-[.25rem]"
                    :class="statusBadgeClass(box.is_claimed)"
                  >
                    {{ statusText(box.is_claimed) }}
                  </span>
                </div>
                <ion-icon v-if="(index + 1) % 4 !== 0" class="text-white translate-y-[-1rem]" name="chevron-forward-outline"></ion-icon>
              </div>
            </div>

            <div class="rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] mt-[1rem]">
                <p class="text-[.75rem] pb-[.25rem] font-[700] text-white/40 border-b border-[var(--color-border-2)] text-left">
                    O que é o número de promoção efetiva? (Preenchendo as seguintes condições)
                </p>
                <div class="py-[.25rem] flex items-center justify-between border-b border-[var(--color-border-2)]">
                    <p class="text-white text-[.75rem] text-left">
                        Depositos acumulados do                     
                        <br />
                            subordinado
                    </p>
                    <p class="text-[var(--color-text-link)] text-[.75rem]">
                        ≥{{ formatCurrency(validThreshold) }}
                    </p>

                </div>
                <div class="py-[.25rem] flex items-center justify-between" v-if="validBetRequirement > 0">
                    
                    <p class="text-white text-[.75rem] text-left">
                        Depositos acumulados do                     
                        <br />
                            subordinado
                    </p>
                    <p class="text-[var(--color-text-link)] text-[.75rem]">
                        ≥{{ formatCurrency(validBetRequirement) }}
                    </p>

                </div>
            </div>

            <div class="rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] mt-[1rem]">
                <p class="text-white text-[1rem] font-[700] text-left">Regras do evento</p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    1. Convide amigos para reivindicar bônus. Quanto mais pessoas você convidar, mais bônus você receberá;
                </p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    2. Os bônus precisam ser reivindicados manualmente. Após a expiração, os bônus serão distribuídos automaticamente e podem ser aproveitados junto com bônus e comissões de outros agentes;
                </p>
                
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    3. Os bônus (excluindo o principal) exigem 0 vezes de apostas válidas para serem sacados;
                </p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    4. Somente o proprietário da conta pode realizar operações manuais normais, caso contrário, o bônus será cancelado ou deduzido, congelado ou até mesmo colocado na lista negra;
                </p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    5. Para evitar diferenças na compreensão do texto, a plataforma se reserva o direito final de interpretação desta atividade.
                </p>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { showToast } from '../components/toast/service'
import { playerApi, treasureBoxApi, siteApi, type TreasureBox, type SiteInfo } from '../services/api'
import { useAuthStore } from '../stores/auth'
const playerId = computed(() => String(auth.user?.id ?? ''))
const useOldLinkFormat = ref(true)
const inviteLink = computed(() => {
  const user = auth.user
  if (user?.player_type === 'virtual') {
    return ''
  }
  const baseUrl = getSiteUrl()
  if (useOldLinkFormat.value) {
    return `${baseUrl}/?id=${playerId.value}&currency=BRL&type=2`
  } else {
    return `${baseUrl}/${playerId.value}`
  }
})
const toggleLinkFormat = () => { useOldLinkFormat.value = !useOldLinkFormat.value }
const getSiteUrl = () => {
  try {
    const fromEnv = (import.meta.env.VITE_SHARE_BASE_URL as string) || ''
    if (fromEnv) return fromEnv
    return window.location.origin
  } catch (error) {
    return 'https://dtfl.com'
  }
}
const plats = ref([
    'email.svg',
    'youtube.svg',
    'kwai.svg',
    'twitter.svg',
    'whatsapp.svg',
    'tiktok.svg',
    'instagram.svg',
    'telegram.svg',
    'facebook.svg'
])
const copyAppUrl = async () => {
  const text = inviteLink.value
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

const auth = useAuthStore()
const router = useRouter()
const directReferralsCount = ref(0)
const validReferralsCount = ref(0)
const treasureBoxes = ref<TreasureBox[]>([])
const siteInfo = ref<SiteInfo | null>(null)
const validThreshold = computed(() => siteInfo.value?.valid_treasure_box_threshold ?? 25)
const validBetRequirement = computed(() => 0)

const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

const statusText = (is_claimed: number | null) => {
  if (is_claimed === 1) return 'Coletado'
  if (is_claimed === 0) return 'Disponível'
  if (is_claimed === -1) return 'Aguardando'
  return 'Bloqueado'
}
const statusBadgeClass = (is_claimed: number | null) => {
  if (is_claimed === 1) return 'bg-white/20 text-white'
  if (is_claimed === 0) return 'bg-[var(--color-active)] text-[var(--color-main-bg)]'
  if (is_claimed === -1) return 'bg-yellow-500/60 text-white'
  return 'bg-white/10 text-white'
}

const fetchReferralsData = async () => {
  try {
    const response = await playerApi.getReferralStats()
    if ((response as any).code === 1) {
      const level1 = (response as any).data.level_stats?.find((s: any) => s.level === 1)
      directReferralsCount.value = level1?.invited_count || 0
      validReferralsCount.value = level1?.valid_depositor_count || 0
    }
  } catch {}
}
const fetchTreasureBoxes = async () => {
  try {
    const response = await treasureBoxApi.getList()
    if ((response as any).code === 1) {
      treasureBoxes.value = (response as any).data.treasure_boxes || []
    }
  } catch {}
}
const handleBoxClick = async (box: TreasureBox) => {
  if (box.is_claimed === null) {
    showToast(`Você precisa convidar ${box.invite_count} pessoas para desbloquear esta caixa`)
    return
  }
  if (box.is_claimed === 1) {
    showToast('Esta caixa já foi coletada')
    return
  }
  if (box.is_claimed === -1) {
    showToast('Caixa ainda não foi liberada, entre em contato com seu gerente')
    return
  }
  if (box.is_claimed !== 0) {
    showToast('Status da caixa inválido')
    return
  }
  try {
    const resp = await treasureBoxApi.claim(box.id)
    if ((resp as any).code === 1) {
      showToast('Caixa coletada com sucesso!')
      await fetchTreasureBoxes()
    } else {
      showToast((resp as any).msg || 'Erro ao coletar a caixa')
    }
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Erro ao coletar a caixa. Tente novamente.'
    showToast(msg)
  }
}

onMounted(async () => {
  await fetchReferralsData()
  await fetchTreasureBoxes()
  try {
    const resp = await siteApi.getInfo()
    if ((resp as any).code === 1) {
      siteInfo.value = (resp as any).data
    }
  } catch {}
})

const goConvidar = () => {
  router.push({ path: '/convidar', query: { tab: 6 } })
}
</script>
<style scoped>
/* 页面特定样式 */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
