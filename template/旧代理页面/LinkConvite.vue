<template>
  <div class="rounded-lg bg-[var(--color-bg-primary)] m-4">
    <div class="flex px-4 pb-4 border-b border-[var(--color-inactive66)]">
      <div class="flex"><img :src="getConstantAssetUrl('/agent1.png')" class="h-[5.8rem]">
        <div
          class="flex justify-center items-center w-[1.2rem] h-[1.2rem] rounded-full relative -left-[1rem] top-[0.2rem] bg-[var(--color-active)]">
          <svg class="text-[0.8rem] w-[1em] h-[1em] fill-[var(--color-bg-primary)]" aria-hidden="true"
            focusable="false">
            <use xlink:href="#comm_icon_wh--svgSprite:all"></use>
          </svg>
        </div>
      </div>
      <div class="flex-1">
        <div class="flex justify-between items-center mt-4">
          <div class="text-[var(--color-inactive)]">Bônus<span class="ml-2 text-[var(--color-warning)]">{{ formatCurrency(totalBonusAmount) }}</span></div>
          <div class="flex">
            <Button :disabled="totalBonusAmount <= 0" @click="() => $toast.error('Você ainda não pode obtê-lo. Entre em contato com seu gerente de negócios para obter o bônus')"
              class="min-w-[6.2rem] px-[1rem] h-[2.5rem] leading-[2.5rem] rounded-[0.5rem] text-[1rem] text-center ml-[1rem]">Receber</Button>
            <Button
              class="min-w-[6.2rem] px-[1rem] h-[2.5rem] leading-[2.5rem] rounded-[0.5rem] text-[1rem] text-center ml-[1rem]">Histórico</Button>
          </div>
        </div>
        <div class="flex justify-between items-center mt-4 leading-[1.3]">
          <div class="text-[var(--color-inactive)]">Modo de Agente</div>
          <div>Diferença de nível infinito (Liquidação diária)</div>
        </div>
      </div>
    </div>
    <div class="flex p-4">
      <div class="flex flex-col items-center w-[7.5rem]">
        <div class="bg-white px-[0.3rem] py-[0.2rem] rounded-t-[0.5rem]">
          <canvas ref="qrCanvas" class="max-w-27 max-h-27"></canvas>
        </div>
        <div
          class="bg-[var(--color-active)] text-[var(--color-bg-primary)] p-[0.5rem] text-[1rem] rounded-b-[0.5rem] text-center leading-[1.6]">
          Compartilhar código QR</div>
      </div>
      <div class="flex-1 ml-4">
        <div class="flex items-center gap-2 mb-2">
          <div class="text-[var(--color-inactive)] text-[1.1rem]">Meu link</div>
          <div
            class="flex justify-center items-center w-[1.8rem] h-[1.8rem] cursor-pointer"
            @click="toggleLinkFormat"
            :title="useOldLinkFormat ? 'Mudar para formato curto' : 'Mudar para formato completo'"
          >
            <svg aria-hidden="true" focusable="false" class="w-[1.4em] h-[1.4em] fill-[var(--color-active)]">
              <use xlink:href="#icon_grzx_qh--svgSprite:all"></use>
            </svg>
          </div>
        </div>
        <div class="border border-[var(--color-inactive66)] rounded-lg p-4 mt-2 flex justify-between items-center">
          <span
            class="text-[var(--color-highlight-text)] text-base break-all pr-4 leading-[1.2]">{{ inviteLink }}</span>
          <div class="flex justify-center items-center ml-2 text-2xl cursor-pointer" @click="goCopy(inviteLink)">
            <svg aria-hidden="true" focusable="false" class="w-[1em] h-[1em] fill-[var(--color-active)]">
              <use xlink:href="#comm_icon_copy--svgSprite:all"></use>
            </svg>
          </div>
        </div>
        <div class="text-[var(--color-inactive)] mt-6 text-[1.1rem]">Subordinados diretos {{ directReferralsCount }}</div>
        <div class="flex items-center mt-[0.1rem] text-[1.1rem]"><span class="text-[var(--color-inactive)] mr-2">Código
            de Convite</span><span class="text-white font-medium mr-2">{{ playerId }}</span>
          <div class="flex justify-center items-center cursor-pointer" @click="goCopy(playerId)">
            <svg aria-hidden="true" focusable="false" class="w-[1em] h-[1em] fill-[var(--color-active)]">
              <use xlink:href="#comm_icon_copy--svgSprite:all"></use>
            </svg>
          </div>
        </div>
      </div>
    </div>
    <div class="overflow-x-auto px-4 pb-8">
      <div class="flex items-center min-w-max">
        <div class="flex flex-col items-center cursor-pointer" @click="handleShare">
          <div
            class="w-[3.5rem] h-[3.5rem] rounded-full border border-[var(--color-inactive66)] flex items-center justify-center my-2 mr-4 hover:bg-[var(--color-bg-opacity)] transition-colors">
            <svg aria-hidden="true" focusable="false" class="w-6 h-6 fill-[var(--color-active)]">
              <use xlink:href="#icon_tg_share--svgSprite:all"></use>
            </svg>
          </div>
          <p class="text-[var(--color-inactive)]">Partilhar</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleWhatsappShare">
          <img :src="getConstantAssetUrl('/whatsapp.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">WhatsApp</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleInstagramShare">
          <img :src="getConstantAssetUrl('/instagram.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Instagram</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleFacebookShare">
          <img :src="getConstantAssetUrl('/facebook.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Facebook</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleTelegramShare">
          <img :src="getConstantAssetUrl('/telegram.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Telegram</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleTiktokShare">
          <img :src="getConstantAssetUrl('/tiktok.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Tiktok</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleKwaiShare">
          <img :src="getConstantAssetUrl('/ks.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Kwai</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleTwitterShare">
          <img :src="getConstantAssetUrl('/twitter.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Twitter</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleYoutubeShare">
          <img :src="getConstantAssetUrl('/youtube.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Youtube</p>
        </div>
        <div class="flex flex-col items-center cursor-pointer" @click="handleLineShare">
          <img :src="getConstantAssetUrl('/line.png')" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full my-2 mx-4 hover:opacity-80 transition-opacity">
          <p class="text-[var(--color-inactive)]">Line</p>
        </div>
      </div>
    </div>
  </div>
  <div class="leading-[1.1] m-4">
    <div class="text-[1.4rem] my-6 text-white">Rede do Agente</div>
    <div
      class="flex items-center bg-[var(--color-bg-primary)] rounded-lg border-b border-[var(--color-inactive66)] py-6 px-4">
      <div class="relative"><img :src="getConstantAssetUrl('/agent_root.png')" alt=""
          class="w-20 h-20 rounded-full border border-[var(--color-warning)] ml-10">
        <div class="badge-circle">A</div>
      </div>
      <div class="flex-1 text-white ml-6">
        <div class="flex items-center mb-[0.7rem] whitespace-nowrap">
          <div>Desempenho total 28500</div>
          <div class="ml-[0.7rem]">Comissões totais <span class="text-[var(--color-warning)]">225</span></div>
        </div>
        <div class="mb-[0.7rem] whitespace-nowrap">D. Direto 5500</div>
        <div class="mb-[0.7rem] whitespace-nowrap">Retorno de Comissão 3% Comissão Direta <span
            class="text-[var(--color-warning)]">165</span></div>
        <div class="mb-[0.7rem] whitespace-nowrap">D. dos Outros 3000</div>
        <div class="whitespace-nowrap">Comissão escalonada 2% outra comissão <span class="text-[var(--color-warning)]">60</span>
        </div>
      </div>
    </div>
    <div class="chart mt-4 relative min-h-[53rem] pb-40">
      <div class="textBox absolute top-[0.8rem] left-0 z-[1] w-[11.5rem]">C1 Contribui para A <span>20</span> From
        differentials 2% </div>
      <div class="textBox absolute top-[0.8rem] right-0 z-[1] w-[11.5rem]">C3 Contribui para A <span>0</span> Infinite
        difference </div>
      <div class="textBox absolute top-20 left-10 z-[1]">B1 Contribui comissão <span>15</span> </div>
      <div class="textBox absolute top-20 left-52 z-[1]">B2 Contribui comissão <span>90</span> </div>
      <div class="textBox absolute top-20 right-[1.8rem] z-[1]">B3 Contribui comissão <span>60</span> </div>
      <div class="textBox absolute top-72 right-28 z-[1]">C2 Contribui para A <span>40</span> From Tier
        Differential 2% </div>
      <div class="textBox absolute top-[23rem] left-10 z-[1]">C1 Contribui comissão <span>10</span> </div>
      <div class="textBox absolute top-[23rem] left-52 z-[1]">C2 Contribui comissão <span>20</span> </div>
      <div class="textBox absolute top-[23rem] right-[1.8rem] z-[1]">C3 Contribui comissão <span>600</span> </div>
      <div class="flex justify-around absolute top-[8.5rem]">
        <div class="ml-2">
          <div class="icon-container"><img :src="getConstantAssetUrl('/agent_b1.png')" alt="" class="avatar-circle">
            <div class="badge-circle">B1</div>
          </div>
          <div class="info-card">Apostas válidas<br>500</div>
        </div>
        <div class="ml-2">
          <div class="icon-container"><img :src="getConstantAssetUrl('/agent_b2.png')" alt="" class="avatar-circle">
            <div class="badge-circle">B2</div>
          </div>
          <div class="info-card">Apostas válidas<br>3000</div>
        </div>
        <div class="ml-2">
          <div class="icon-container"><img :src="getConstantAssetUrl('/agent_b1.png')" alt="" class="avatar-circle">
            <div class="badge-circle">B3</div>
          </div>
          <div class="info-card">Apostas válidas<br>2000</div>
        </div>
      </div>
      <div class="flex justify-around absolute top-[26.5rem]">
        <div class="ml-2">
          <div class="icon-container"><img :src="getConstantAssetUrl('/agent_c1.png')" alt="" class="avatar-circle">
            <div class="badge-circle">C1</div>
          </div>
          <div class="info-card">Apostas válidas<br>1000</div>
        </div>
        <div class="ml-2">
          <div class="icon-container"><img :src="getConstantAssetUrl('/agent_c2.png')" alt="" class="avatar-circle">
            <div class="badge-circle">C2</div>
          </div>
          <div class="info-card">Apostas válidas<br>2000</div>
        </div>
        <div class="ml-2">
          <div class="icon-container"><img :src="getConstantAssetUrl('/agent_c1.png')" alt="" class="avatar-circle">
            <div class="badge-circle">C3</div>
          </div>
          <div class="info-card">Apostas válidas<br>20000</div>
        </div>
      </div>
      <img :src="getConstantAssetUrl('/agent_line1.png')" alt="" class="absolute top-0 left-0 h-[26.5rem]">
      <img :src="getConstantAssetUrl('/agent_line2.png')" alt="" class="absolute top-0 left-[57.25%] h-[26.5rem]">
      <img :src="getConstantAssetUrl('/agent_line3.png')" alt="" class="absolute top-0 right-0 h-[26.5rem]">
      <img :src="getConstantAssetUrl('/agent_line4.png')" alt="" class="absolute top-0 left-[6.5rem] h-32">
      <img :src="getConstantAssetUrl('/agent_line5.png')" alt="" class="absolute top-0 left-[17.5rem] h-32">
      <img :src="getConstantAssetUrl('/agent_line6.png')" alt="" class="absolute top-0 left-[23.5rem] h-32">
      <img :src="getConstantAssetUrl('/agent_line7.png')" alt="" class="absolute top-72 left-[5.6rem] h-[8.2rem]">
      <img :src="getConstantAssetUrl('/agent_line8.png')" alt="" class="absolute top-72 left-[11.3rem] h-36">
      <img :src="getConstantAssetUrl('/agent_line7.png')" alt="" class="absolute top-72 left-[28.8rem] h-[8.2rem]">
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../ui/Button.vue'
import { goCopy } from '../../utils/clipboard'
import { playerApi, type InvitationReward } from '../../services/api'
import { eventBus } from '../../utils/eventBus'
import { getConstantAssetUrl } from '../../utils/assets'
import { formatCurrency } from '../../utils/dateUtils'
import { $toast } from '../../components/common/toast'
import { useInviteShare } from '../../composables/useInviteShare'

const router = useRouter()

// 使用邀请分享 Composable
const {
  playerId,
  inviteLink,
  useOldLinkFormat,
  toggleLinkFormat,
  qrCanvas,
  generateQRCode,
  handleShare,
  handleTelegramShare,
  handleFacebookShare,
  handleWhatsappShare,
  handleTwitterShare,
  handleKwaiShare,
  handleLineShare,
  handleInstagramShare,
  handleTiktokShare,
  handleYoutubeShare
} = useInviteShare()

// 监听邀请链接变化，自动重新生成二维码
watch(inviteLink, () => {
  nextTick(() => {
    generateQRCode()
  })
})

// 直接下级数量
const directReferralsCount = ref(0)

// 邀请奖励数据
const invitationRewards = ref<InvitationReward[]>([])

// 计算总奖励金额 - 只累加未发放的奖励记录
const totalBonusAmount = computed(() => {
  return invitationRewards.value.reduce((total, reward) => {
    // 只累加未发放的奖励 (is_released === 0)
    if (reward.is_released === 0) {
      return total + reward.reward_amount
    }
    return total
  }, 0)
})

// 获取推荐统计数据
const fetchReferralsData = async () => {
  try {
    const response = await playerApi.getReferralStats()
    if (response.code === 1) {
      // 从第一级统计数据获取直接下级数量
      const level1Stats = response.data.level_stats.find(stat => stat.level === 1)
      directReferralsCount.value = level1Stats?.invited_count || 0
    } else {
      // 检查是否是认证相关错误
      if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
        // 认证错误：跳转到首页并显示登录模态框
        router.push('/')
        eventBus.emit('open-login-modal', 'login')
        return // 不继续处理错误
      }

      console.error('获取推荐统计失败:', response.msg, 'code:', response.code)
      // 保持默认值 0
    }
  } catch (error) {
    // catch块现在主要处理网络错误等异常
    console.error('获取推荐统计数据失败:', error)
    // 保持默认值 0
  }
}

// 获取邀请奖励数据
const fetchInvitationRewards = async () => {
  try {
    const response = await playerApi.getInvitationRewards()
    if (response.code === 1 && response.data?.rewards) {
      invitationRewards.value = response.data.rewards
    } else {
      console.error('获取邀请奖励失败:', response.msg, 'code:', response.code)
      // 保持默认值空数组
    }
  } catch (error) {
    console.error('获取邀请奖励数据失败:', error)
    // 保持默认值空数组
  }
}

// 组件挂载时获取数据
onMounted(async () => {
  fetchReferralsData()
  fetchInvitationRewards()

  // 等待DOM更新后生成二维码
  await nextTick()
  generateQRCode()
})
</script>

<style scoped>
.textBox {
  background-color: var(--color-bg-primary70);
  width: 8.5rem;
  font-size: 0.8rem;
  border-radius: 0.5rem;
  text-align: center;
  padding: 0.3rem;
  color: #fff;
  word-break: break-all;
}

.textBox span {
  color: var(--color-warning);
}

.avatar-circle {
  width: 4.6rem;
  height: 4.6rem;
  border-radius: 50%;
  border: 1px solid var(--color-warning);
}

.badge-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 1.2rem;
  height: 1.2rem;
  border-radius: 50%;
  background: var(--color-warning);
  color: #fff;
  position: absolute;
  right: 0;
  bottom: 0;
  font-size: 0.7rem;
}

.icon-container {
  position: relative;
  width: 4.6rem;
  height: 4.6rem;
  margin: 0 auto;
  z-index: 1;
}

.info-card {
  color: var(--color-highlight-text);
  width: 10.5rem;
  background: var(--color-bg-primary);
  border-radius: 0.5rem;
  border: 1px solid var(--color-inactive66);
  padding: 3rem 1rem 1rem;
  text-align: center;
  position: relative;
  bottom: 2rem;
  font-size: 1rem;
  margin-left: 0.57rem;
}
</style>