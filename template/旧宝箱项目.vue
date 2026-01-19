<template>
    <div class="h-screen flex flex-col relative z-10 bg-[var(--color-bg-main)] overflow-y-scroll">
        <CommonHeader moreText="Histórico" @more="router.push('/agent?tab=bonus')">
            Convide outros e ganhe um bônus de R$10,00
        </CommonHeader>
        <div class="p-[1rem]">
            <div class="bg-[var(--color-bg-primary)] rounded-[0.5rem] p-[1rem]">
                <p class="py-[1rem] text-white text-[1.2rem] px-[1rem]">Informações de Referência</p>
                <div class="w-full h-[.5px] bg-[var(--color-inactive66)] mb-[1rem]">

                </div>
                <div class="flex">
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
                            <div class="text-[var(--color-highlight-text)] text-[1.1rem]">Meu link</div>
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
                        <div
                            class="border border-[var(--color-inactive66)] rounded-lg p-4 mt-2 flex justify-between items-center">
                            <span
                                class="text-[var(--color-highlight-text)] text-base break-all pr-4 leading-[1.2]">{{ inviteLink }}</span>
                            <div class="flex justify-center items-center ml-2 text-2xl cursor-pointer" @click="goCopy(inviteLink)"><svg aria-hidden="true"
                                    focusable="false" class="w-[1em] h-[1em] fill-[var(--color-active)]">
                                    <use xlink:href="#comm_icon_copy--svgSprite:all"></use>
                                </svg></div>
                        </div>
                        <div class="text-[var(--color-highlight-text)] mt-[1.5rem] text-[1.1rem]">Subordinados diretos
                            {{ directReferralsCount }}</div>
                        <div class="flex items-center mt-[0.1rem] text-[1.1rem]"><span
                                class="text-[var(--color-highlight-text)] mr-2">Código
                                de Convite</span><span class="text-white mr-2">{{ playerId }}</span>
                            <div class="flex justify-center items-center cursor-pointer" @click="goCopy(playerId)"><svg aria-hidden="true" focusable="false"
                                    class="w-[1em] h-[1em] fill-[var(--color-active)]">
                                    <use xlink:href="#comm_icon_copy--svgSprite:all"></use>
                                </svg></div>
                        </div>
                    </div>
                </div>
                <div class="overflow-x-auto mt-[.5rem]">
                    <div class="flex items-center min-w-max">
                        <div v-for="item in shareItems" :key="item.key"
                            class="flex flex-col items-center justify-center mr-[1.1rem] py-[1rem] cursor-pointer"
                            @click="handleShareClick(item.key)">
                            <div v-if="item.key === 'share'"
                                class="w-[3.5rem] h-[3.5rem] rounded-full border border-[var(--color-inactive66)] flex items-center justify-center hover:bg-[var(--color-bg-opacity)] transition-colors">
                                <svg aria-hidden="true" focusable="false" class="w-6 h-6 fill-[var(--color-active)]">
                                    <use :xlink:href="item.icon"></use>
                                </svg>
                            </div>
                            <img v-else :src="item.icon" alt="" class="w-[3.5rem] h-[3.5rem] rounded-full hover:opacity-80 transition-opacity">
                            <p class="text-[var(--color-highlight-text)] mt-[.7rem]">{{ item.label }}</p>
                        </div>
                    </div>
                </div>
                <p class="text-[var(--color-highlight-text)] mb-[.5rem] text-[1rem]">Subordinados válidos
                    <span class="ml-[.5rem] text-[var(--color-active)]">{{ validReferralsCount }}</span>
                </p>
            </div>

            <div class="bg-[var(--color-bg-primary)] rounded-[0.5rem] p-[1rem] mt-[1rem]">
                <p class="text-[var(--color-highlight-text)] text-[.8rem] text-center"> O que é um número válido de indicações? (Cumprindo simultaneamente as seguintes condições) </p>
                <div class="flex items-center rounded-[.5rem] bg-[var(--color-inactive66)] py-[1rem] mt-[1rem]">
                    <span class="text-[.8rem] text-[var(--color-highlight-text)] flex-2 px-[1rem]">Montante do Primeiro Depósito do Subordinado</span>
                    <span class="text-[.9rem] text-white flex-1">{{ formatCurrency(validThreshold) }} ou mais</span>
                </div>
                <div v-if="validBetRequirement > 0" class="flex items-center rounded-[.5rem] bg-[var(--color-inactive66)] py-[1rem] mt-[.5rem]">
                    <span class="text-[.8rem] text-[var(--color-highlight-text)] flex-2 px-[1rem]">Aposta Total Acumulada do Subordinado</span>
                    <span class="text-[.9rem] text-white flex-1">{{ formatCurrency(validBetRequirement) }} ou mais</span>
                </div>
            </div>


            <div class="bg-[var(--color-bg-primary)] rounded-[0.5rem] py-[1rem] mt-[1rem] flex flex-wrap gap-[1rem] w-full">
              <div
                class="w-[22.7%] text-center"
                v-for="box in treasureBoxes"
                :key="box.id"
                @click="handleBoxClick(box)"
                :class="{ 'cursor-pointer': box.is_claimed === 0 || box.is_claimed === -1 }"
              >
                <div class="relative h-[6rem] w-[6rem] text-center m-auto">
                  <img
                    class="w-full h-full"
                    :src="getBoxImage(box.is_claimed)"
                    alt=""
                  >
                  <p class="text-white text-[.8rem] bottom-[.8rem] absolute left-0 right-0 m-auto">
                    {{ box.invite_count }} {{ box.invite_count === 1 ? 'pessoa' : 'pessoas' }}
                  </p>
                </div>
                <p class="text-center m-auto mt-[1rem] text-[1rem] text-[var(--color-highlight-text)]">
                  {{ formatCurrency(box.reward_amount) }}
                </p>
              </div>
            </div>
        </div>
        
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { goCopy } from '../../utils/clipboard';
import { playerApi, treasureBoxApi, type TreasureBox } from '../../services/api';
import type { RootState } from '../../stores';
import { $toast } from '../../components/common/toast';
import { eventBus } from '../../utils/eventBus';
import { getConstantAssetUrl } from '../../utils/assets';
import { useInviteShare } from '../../composables/useInviteShare';

// 定义props(接收从App.vue传递的属性,但不使用)
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// 定义emits(接收从App.vue传递的事件监听器,但不使用)
defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

const router = useRouter();
const store = useStore<RootState>();

// 登录状态检查
const isAuthenticated = computed(() => store.getters['auth/isAuthenticated']);

// 检查登录状态，未登录时跳转到首页并显示登录模态框
const checkAuthAndRedirect = () => {
  if (!isAuthenticated.value) {
    // 未登录时跳转到主页并触发登录模态框
    router.push('/');
    eventBus.emit('open-login-modal', 'login');
    return false;
  }
  return true;
};

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
  handleLineShare,
  handleKwaiShare,
  handleInstagramShare,
  handleTiktokShare,
  handleYoutubeShare
} = useInviteShare();

// 监听邀请链接变化，自动重新生成二维码
watch(inviteLink, () => {
  nextTick(() => {
    generateQRCode();
  });
});

// 直接下级数量
const directReferralsCount = ref(0);
// 有效下级数量（首次充值≥阈值的下级）
const validReferralsCount = ref(0);
// 宝箱列表
const treasureBoxes = ref<TreasureBox[]>([]);
// 加载状态
const loading = ref(false);

// 从 store 获取有效宝箱阈值
const validThreshold = computed(() => {
  return store.getters['site/validTreasureBoxThreshold'] || 25;
});

// 从 store 获取有效下属投注要求
const validBetRequirement = computed(() => {
  return store.getters['site/treasureBoxBetRequirement'] || 0;
});



// 获取推荐统计数据
const fetchReferralsData = async () => {
  try {
    const response = await playerApi.getReferralStats();
    if (response.code === 1) {
      // 从第一级统计数据获取直接下级数量和有效下级数量
      const level1Stats = response.data.level_stats.find(stat => stat.level === 1);
      directReferralsCount.value = level1Stats?.invited_count || 0;
      validReferralsCount.value = level1Stats?.valid_depositor_count || 0;
    } else {
      console.error('获取推荐统计失败:', response.msg, 'code:', response.code);
      // 保持默认值 0
    }
  } catch (error) {
    // catch块现在主要处理网络错误等异常
    console.error('获取推荐统计数据失败:', error);
    // 保持默认值 0
  }
};

// 获取宝箱列表
const fetchTreasureBoxes = async () => {
  try {
    loading.value = true;
    const response = await treasureBoxApi.getList();
    if (response.code === 1) {
      treasureBoxes.value = response.data.treasure_boxes;
    } else {
      console.error('获取宝箱列表失败:', response.msg, 'code:', response.code);
    }
  } catch (error) {
    console.error('获取宝箱列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 处理宝箱点击
const handleBoxClick = async (box: TreasureBox) => {
  // 处理不可领取的状态
  if (box.is_claimed === null) {
    $toast.error(`Você precisa convidar ${box.invite_count} pessoas para desbloquear esta caixa`);
    return;
  } else if (box.is_claimed === 1) {
    $toast.error('Esta caixa já foi coletada');
    return;
  } else if (box.is_claimed === -1) {
    $toast.error('Caixa ainda não foi liberada, entre em contato com seu gerente');
    return;
  } else if (box.is_claimed !== 0) {
    $toast.error('Status da caixa inválido');
    return;
  }

  try {
    const response = await treasureBoxApi.claim(box.id);
    if (response.code === 1) {
      // 领取成功，更新宝箱状态
      box.is_claimed = 1;
      // 显示成功消息
      $toast.success(`Caixa coletada com sucesso! Você ganhou R$ ${formatCurrency(response.data.reward_amount)}`);
      // 刷新宝箱列表
      await fetchTreasureBoxes();
    } else {
      // API返回其他错误
      $toast.error(response.msg || 'Erro ao coletar a caixa');
    }
  } catch (error: any) {
    console.error('领取宝箱失败:', error);
    // catch块现在主要处理网络错误等异常
    const errorMsg = error instanceof Error ? error.message : 'Erro ao coletar a caixa. Tente novamente.';
    $toast.error(errorMsg);
  }
};

// 获取宝箱图片
const getBoxImage = (is_claimed: number | null) => {
  switch (is_claimed) {
    case 1:
      // 已领取
      return getConstantAssetUrl('/box_claimed.png')
    case null:
      // 无记录（未达到邀请要求）
      return getConstantAssetUrl('/box_locked.png')
    case -1:
      // 未发放（需管理员手动发放）
      return getConstantAssetUrl('/box_available.png')
    case 0:
      // 已发放但未领取
      return getConstantAssetUrl('/box_available.png')
    default:
      return getConstantAssetUrl('/box_locked.png')
  }
};

// 格式化货币
const formatCurrency = (amount: number) => {
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const shareItems = ref([
    {
        label: 'Partilhar',
        key: 'share',
        icon: '#icon_tg_share--svgSprite:all',
        router: ''
    },
    {
        label: 'WhatsApp',
        key: 'whatsapp',
        icon: getConstantAssetUrl('/whatsapp.png'),
        router: ''
    },
    {
        label: 'Instagram',
        key: 'instagram',
        icon: getConstantAssetUrl('/instagram.png'),
        router: ''
    },
    {
        label: 'Facebook',
        key: 'facebook',
        icon: getConstantAssetUrl('/facebook.png'),
        router: ''
    },
    {
        label: 'Telegram',
        key: 'telegram',
        icon: getConstantAssetUrl('/telegram.png'),
        router: ''
    },
    {
        label: 'Tiktok',
        key: 'tiktok',
        icon: getConstantAssetUrl('/tiktok.png'),
        router: ''
    },
    {
        label: 'Kwai',
        key: 'kwai',
        icon: getConstantAssetUrl('/ks.png'),
        router: ''
    },
    {
        label: 'Twitter',
        key: 'twitter',
        icon: getConstantAssetUrl('/twitter.png'),
        router: ''
    },
    {
        label: 'Youtube',
        key: 'youtube',
        icon: getConstantAssetUrl('/youtube.png'),
        router: ''
    },
    {
        label: 'Line',
        key: 'line',
        icon: getConstantAssetUrl('/line.png'),
        router: ''
    }
]);

// 处理分享按钮点击
const handleShareClick = (key: string) => {
  switch (key) {
    case 'share':
      handleShare();
      break;
    case 'telegram':
      handleTelegramShare();
      break;
    case 'facebook':
      handleFacebookShare();
      break;
    case 'whatsapp':
      handleWhatsappShare();
      break;
    case 'twitter':
      handleTwitterShare();
      break;
    case 'line':
      handleLineShare();
      break;
    case 'kwai':
      handleKwaiShare();
      break;
    case 'instagram':
      handleInstagramShare();
      break;
    case 'youtube':
      handleYoutubeShare();
      break;
    case 'tiktok':
      handleTiktokShare();
      break;
    default:
      break;
  }
};

// 组件挂载时获取数据
onMounted(async () => {
  // 检查登录状态，未登录时跳转到首页
  if (!checkAuthAndRedirect()) {
    return;
  }

  // 获取站点信息（不需要登录）
  store.dispatch('site/fetchSiteInfo');

  // 获取推荐数据和宝箱数据
  fetchReferralsData();
  fetchTreasureBoxes();

  // 等待DOM更新后生成二维码
  await nextTick();
  generateQRCode();
});
</script>