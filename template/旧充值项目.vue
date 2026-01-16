<template>
  <!-- 遮罩层 -->
  <OverlayMask :show="show" @close="$emit('close')" />

  <!-- 弹窗内容 -->
  <Transition name="slide-up">
    <div v-if="show" class="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[516px] h-full z-50 flex items-end justify-center pointer-events-none">
      <div
        class="w-full max-w-[516px] rounded-t-xl modal-content overflow-hidden pointer-events-auto h-[90%] bg-[var(--color-bg-primary)]"
        @click.stop
      >
        <!-- 顶部标题栏 -->
        <div class="flex items-center justify-between px-4 relative h-[4.6rem]">
          <!-- 返回按钮 -->
          <button @click="$emit('close')" class="fill-white">
            <svg class="w-6 h-6">
              <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
            </svg>
          </button>

          <!-- 标题 -->
          <div class="absolute left-1/2 transform -translate-x-1/2 text-[1.4rem] text-[var(--color-highlight-text)]">
            Depósito <!-- 充值 -->
          </div>

          <div class="flex items-center gap-4">
            <!-- 客服图标 -->
            <button @click="router.push('/support')" class="fill-[var(--color-active)]">
              <svg class="w-8 h-8">
                <use xlink:href="#style_1_icon_top_kf--svgSprite:all"></use>
              </svg>
            </button>

            <!-- 充值记录图标 -->
            <button @click="showDepositHistoryModal = true" class="fill-[var(--color-active)]">
              <svg class="w-6 h-6">
                <use xlink:href="#img_cjc_jl--svgSprite:all"></use>
              </svg>
            </button>
          </div>
        </div>

        <!-- 内容区域 -->
        <div class="p-4 h-full overflow-y-auto">
          <!-- 加载状态 -->
          <div v-if="loading" class="flex items-center justify-center py-8">
            <div class="text-center">
              <!-- 加载中提示文字 -->
              <div class="text-lg font-medium mb-2 text-[var(--color-inactive66)]">Carregando informações de depósito...</div>
              <!-- 请等待提示 -->
              <div class="text-sm text-[var(--color-inactive66)]">Aguarde</div>
            </div>
          </div>

          <!-- 主要内容 -->
          <div v-else>
            <!-- 在线充值标题 -->
            <div class="mb-6 border-b border-[var(--color-inactive66)]">
              <div class="inline-flex items-center pb-2 border-b-[0.2rem] border-[var(--color-active)]">
                <svg class="w-[1.9rem] h-[1.9rem] mr-3 fill-[var(--color-active)]">
                  <use xlink:href="#icon_cz_zxcz1--svgSprite:all"></use>
                </svg>
                <!-- 在线充值标题文字 -->
                <span class="text-[1.1rem] font-medium text-[var(--color-active)]">Depósito on-line</span>
              </div>
            </div>
          

          <!-- PIX 支付方式网格 -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <!-- PIX支付方式按钮 -->
            <DepositButton
              variant="payment"
              label="PIX"
              :icon="getConstantAssetUrl('/payment_method.png')"
              :selected="true"
              :show-badge="true"
            />
          </div>

          <!-- 分割线 -->
          <div class="w-full mb-6 border-b border-[var(--color-inactive66)]"></div>

          <!-- 其他支付方式 -->
          <div class="grid grid-cols-3 gap-3 mb-6">
            <DepositButton
              v-for="channel in channels.slice(0, 3)"
              :key="channel.code"
              variant="selection"
              :label="channel.name.toUpperCase()"
              :selected="selectedChannelCode === channel.code"
              :show-badge="selectedChannelCode === channel.code"
              :value="channel.code"
              @click="selectChannel"
            />
            <!-- 如果channels少于3个，显示占位符（不可见） -->
            <div
              v-for="n in Math.max(0, 3 - channels.length)"
              :key="`placeholder-${n}`"
              class="invisible"
            ></div>
          </div>


          <!-- 分割线 -->
          <div class="h-px w-full mb-6 border-b border-[var(--color-inactive66)]"></div>

          <!-- 充值金额标题 -->
          <div class="text-[1.2rem] font-medium mb-4 text-[var(--color-highlight-text)]">Depósito</div> <!-- 充值 -->

          <!-- 金额选择网格 -->
          <div class="grid grid-cols-4 gap-3 mb-6">
            <!-- 第一行 -->
            <DepositButton
              v-for="amount in firstRowAmounts"
              :key="amount.value"
              variant="amount"
              :label="amount.value.toString()"
              :bonus="needBonus ? amount.bonus : null"
              :selected="selectedAmount === amount.value"
              :value="amount.value"
              @click="selectAmount"
            />

            <!-- 第二行 -->
            <DepositButton
              v-for="amount in secondRowAmounts"
              :key="amount.value"
              variant="amount"
              :label="amount.value.toString()"
              :bonus="needBonus ? amount.bonus : null"
              :selected="selectedAmount === amount.value"
              :value="amount.value"
              @click="selectAmount"
            />

            <!-- 第三行 -->
            <DepositButton
              v-for="amount in thirdRowAmounts"
              :key="amount.value"
              variant="amount"
              :label="amount.value.toString()"
              :bonus="needBonus ? amount.bonus : null"
              :selected="selectedAmount === amount.value"
              :value="amount.value"
              @click="selectAmount"
            />
          </div>

          <!-- 奖金复选框 -->
          <div class="mb-4">
            <Checkbox v-model="needBonus">
              <!-- 我需要提供奖金 -->
              <span class="ml-2 text-[var(--color-highlight-text)]">Eu preciso oferecer um bônus</span>
            </Checkbox>
          </div>

          <!-- 自定义金额输入 + 奖励显示（合并） -->
          <div class="mb-6 border border-[var(--color-inactive66)] rounded-lg focus-within:border-[var(--color-active)]">
            <!-- 输入框区域 - Flexbox 布局 -->
            <div class="flex items-center px-4 h-[3.5rem] rounded-t-lg">
              <!-- 货币符号 -->
              <span class="text-lg font-medium text-[var(--color-highlight-text)] mr-2">R$</span>

              <!-- 输入框 -->
              <input
                v-model="customAmount"
                type="number"
                :placeholder="`Mínimo ${minDepositAmount}, Máximo ${maxDepositAmount}`"
                class="flex-1 bg-transparent placeholder-[var(--color-inactive)] text-white text-lg font-medium focus:outline-none number-input"
                @input="onCustomAmountInput"
                :min="minDepositAmount"
                :max="maxDepositAmount"
              />

              <!-- 清除按钮 -->
              <button
                v-if="customAmount"
                @click="clearCustomAmount"
                class="ml-2 cursor-pointer fill-[var(--color-inactive66)]"
              >
                <svg class="w-[1.7rem] h-[1.7rem]">
                  <use xlink:href="#comm_icon_qc--svgSprite:all"></use>
                </svg>
              </button>
            </div>

            <!-- 奖励显示区域（一行） -->
            <div
              v-if="selectedAmount && needBonus"
              class="border-t border-[var(--color-inactive66)] bg-[var(--color-bg-opacity)] px-4 py-2 flex items-center justify-between rounded-b-lg"
            >
              <!-- 左侧：奖金信息 -->
              <div v-if="currentBonus > 0" class="flex items-center">
                <img :src="getConstantAssetUrl('/icons/bonus.avif')" alt="bonus" class="w-5 h-5 mr-2" />
                <span class="text-[0.95rem] text-[var(--color-highlight-text)]">Bônus:</span>
                <span class="ml-2 text-[0.95rem] font-semibold text-[var(--color-success)]">
                  +R$ {{ formatCurrency(currentBonus) }}
                </span>
              </div>
              <div v-else class="flex items-center">
                <img :src="getConstantAssetUrl('/icons/bonus.avif')" alt="bonus" class="w-5 h-5 mr-2 opacity-50" />
                <span class="text-[0.95rem] text-[var(--color-inactive)]">Sem bônus</span>
              </div>

              <!-- 右侧：总金额 -->
              <div class="flex items-center">
                <span class="text-[0.95rem] font-medium text-[var(--color-highlight-text)] mr-2">Total:</span>
                <span class="text-[0.95rem] font-bold text-[var(--color-active)]">
                  R$ {{ formatCurrency(totalReceiveAmount) }}
                </span>
              </div>
            </div>
          </div>

            <!-- 充值按钮 -->
            <div class="pb-8">
              <Button
                @click="handleDeposit"
                class="w-full py-[0.92rem] text-lg"
                :disabled="buttonDisabled"
              >
                {{ depositLoading ? 'Carregando...' : 'Depositar Agora' }}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <DepositHistoryModal v-if="showDepositHistoryModal" :show="showDepositHistoryModal" @close="closeDepositHistoryModal" />


  <!-- 充值处理加载状态 -->
  <Spinner :visible="depositLoading" text="Processando depósito..." />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Checkbox from '../ui/Checkbox.vue'
import Button from '../ui/Button.vue'
import OverlayMask from '../ui/OverlayMask.vue'
import DepositButton from '../ui/DepositButton.vue'
import Spinner from '../ui/Spinner.vue'
import { depositApi } from '../../services/api'
import DepositHistoryModal from './DepositHistoryModal.vue'
import { $toast } from '../common/toast'
import { getConstantAssetUrl } from '../../utils/assets'
import { virtualPlayerStorage } from '../../services/virtualPlayerStorage'

// 路由和store
const router = useRouter()
const store = useStore()
const showDepositHistoryModal = ref(false)

// 关闭充值历史弹窗
const closeDepositHistoryModal = () => {
  showDepositHistoryModal.value = false
}

// 获取当前用户信息
const currentUser = computed(() => store.getters['auth/user'])

// 判断是否为虚拟玩家
const isVirtualPlayer = computed(() => {
  return currentUser.value ? virtualPlayerStorage.isVirtualPlayer(currentUser.value) : false
})

// 获取站点配置的充值限额
const minDepositAmount = computed(() => store.getters['site/minDepositAmount'])
const maxDepositAmount = computed(() => store.getters['site/maxDepositAmount'])


// 充值通道类型
interface DepositChannel {
  code: string
  name: string
  min_amount: number
  max_amount: number
  fixed_fee: number
  percentage_fee: number
}

// 充值方案类型
interface DepositPlan {
  id: number
  amount: number
  gift_amount: number
  is_hot: boolean
}

defineProps<{
  show: boolean
}>()

const emit = defineEmits(['close'])

// API数据
const channels = ref<DepositChannel[]>([])
const plans = ref<DepositPlan[]>([])
const loading = ref(true)
const error = ref('')

// 充值按钮加载状态
const depositLoading = ref(false)
// 按钮禁用状态（防止重复点击）
const buttonDisabled = ref(false)

// 计算充值金额数据（基于API数据）
const firstRowAmounts = ref<Array<{ value: number; bonus: number | null }>>([])
const secondRowAmounts = ref<Array<{ value: number; bonus: number | null }>>([])
const thirdRowAmounts = ref<Array<{ value: number; bonus: number | null }>>([])

// 获取充值通道数据
const fetchChannels = async () => {
  try {
    const response = await depositApi.getChannels()
    if (response.code === 1) {
      channels.value = response.data.channels || []
      console.log('充值通道数据:', channels.value)
    } else {
      error.value = response.msg || 'Falha ao obter canais de depósito' // 获取充值通道失败
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro de rede' // 网络错误
    console.error('获取充值通道错误:', err)
  }
}

// 获取充值方案数据
const fetchPlans = async () => {
  try {
    const response = await depositApi.getPlans()
    if (response.code === 1) {
      plans.value = response.data.plans || []
      console.log('充值方案数据:', plans.value)
      // 处理充值金额数据
      processAmountData()
    } else {
      error.value = response.msg || 'Falha ao obter planos de depósito' // 获取充值方案失败
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erro de rede' // 网络错误
    console.error('获取充值方案错误:', err)
  }
}

// 处理充值金额数据，分配到三行
const processAmountData = () => {
  const sortedPlans = [...plans.value].sort((a, b) => a.amount - b.amount)

  // 清空现有数据
  firstRowAmounts.value = []
  secondRowAmounts.value = []
  thirdRowAmounts.value = []

  // 分配到三行，每行最多4个
  sortedPlans.forEach((plan, index) => {
    const amountData = {
      value: plan.amount,
      bonus: plan.gift_amount > 0 ? plan.gift_amount : null
    }

    if (index < 4) {
      firstRowAmounts.value.push(amountData)
    } else if (index < 8) {
      secondRowAmounts.value.push(amountData)
    } else if (index < 12) {
      thirdRowAmounts.value.push(amountData)
    }
  })
}

// 状态管理
const selectedAmount = ref<number | null>(null)
const customAmount = ref('')
const needBonus = ref(true)
const selectedChannelCode = ref<string>('') // 选中的充值通道代码

// 选择充值通道
const selectChannel = (channelCode: string) => {
  selectedChannelCode.value = channelCode
  console.log('选择充值通道:', channelCode)
}

// 选择金额
const selectAmount = (amount: number) => {
  selectedAmount.value = amount
  customAmount.value = amount.toString()
}

// 自定义金额输入处理
const onCustomAmountInput = () => {
  const value = parseFloat(customAmount.value)
  if (!isNaN(value) && value >= minDepositAmount.value && value <= maxDepositAmount.value) {
    selectedAmount.value = value
  } else if (customAmount.value === '' || customAmount.value === null) {
    selectedAmount.value = null
  }
}

// 清空自定义金额
const clearCustomAmount = () => {
  customAmount.value = ''
  selectedAmount.value = null
}

// 格式化货币显示
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 计算当前选中金额的奖金
const currentBonus = computed(() => {
  if (!selectedAmount.value || !needBonus.value) return 0

  const amount = selectedAmount.value

  // 首先查找完全匹配的充值方案
  const exactMatch = plans.value.find(plan => plan.amount === amount)
  if (exactMatch) {
    return exactMatch.gift_amount
  }

  // 如果没有完全匹配，只有金额大于等于30时才按20%固定比例计算奖金
  if (amount >= 30) {
    return amount * 0.2
  }

  return 0
})

// 计算总入账金额（充值金额 + 奖金）
const totalReceiveAmount = computed(() => {
  const amount = selectedAmount.value || 0
  const bonus = currentBonus.value
  return amount + bonus
})

// 充值错误码翻译
const translateDepositError = (code: number, defaultMsg: string): string => {
  const errorMessages: Record<number, string> = {
    // 参数验证错误
    2004: 'O valor do depósito deve ser um número válido', // 充值金额必须为有效数字
    2005: `O valor do depósito deve estar entre R$ ${minDepositAmount.value} e R$ ${maxDepositAmount.value}`, // 充值金额必须在范围内
    2006: 'Por favor, selecione um canal de pagamento', // 请选择支付通道
    2007: 'O valor do depósito deve estar dentro dos limites do canal', // 充值金额必须在通道限制范围内

    // 业务逻辑错误
    3002: 'Jogadores virtuais não suportam função de depósito', // 虚拟玩家不支持充值功能
    3003: 'Canal de pagamento indisponível', // 支付通道不可用

    // 资源不存在错误
    4004: 'Informações do jogador não existem', // 玩家信息不存在（充值）

    // 系统错误
    5002: 'Falha ao criar pedido', // 创建订单失败
    5003: 'Falha ao criar pagamento', // 创建支付失败

    // 通用错误
    0: 'Falha no depósito, tente novamente' // 充值失败，请重试
  }

  return errorMessages[code] || defaultMsg
}

// 处理充值
const handleDeposit = async () => {
  // 防止重复提交
  if (buttonDisabled.value) return

  const amount = selectedAmount.value || parseInt(customAmount.value)
  if (!amount || amount < minDepositAmount.value || amount > maxDepositAmount.value) {
    $toast.error(`Por favor, insira um valor de depósito válido (${minDepositAmount.value}-${maxDepositAmount.value})`) // 请输入有效的充值金额
    return
  }

  if (!selectedChannelCode.value) {
    $toast.error('Por favor, selecione um canal de depósito') // 请选择充值通道
    return
  }

  // 开始请求：显示加载状态，禁用按钮5秒
  depositLoading.value = true
  buttonDisabled.value = true

  // 5秒后恢复按钮（无论请求是否完成）
  setTimeout(() => {
    buttonDisabled.value = false
  }, 5000)

  try {
    console.log('充值金额:', amount)
    console.log('充值通道:', selectedChannelCode.value)
    console.log('需要奖金:', needBonus.value)

    // 虚拟玩家：模拟充值流程
    if (isVirtualPlayer.value) {
      console.log('虚拟玩家模拟充值')

      // 生成虚拟订单号
      const mockOrderId = virtualPlayerStorage.generateMockOrderNo()

      // 计算实际充值金额（如果勾选 bonus，则为充值金额 + bonus 金额）
      const actualAmount = needBonus.value ? totalReceiveAmount.value : amount

      // 模拟延时（1-2秒）
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      // 跳转到模拟支付页面
      router.push({
        path: '/threePay_fake_pix',
        query: {
          order_id: mockOrderId,
          amount: actualAmount.toString()
        }
      })

      depositLoading.value = false
      return
    }

    // 真实玩家：调用充值API
    const response = await depositApi.create(amount, selectedChannelCode.value, needBonus.value)

    if (response.code === 1) {
      console.log('充值订单创建成功:', response.data)

      // 检查是否有支付链接
      if (response.data.payment_url) {
        // 跳转到 Pix 页面并带上支付链接
        router.push({
          path: '/threePay_pix',
          query: {
            payment_url: response.data.payment_url,
            order_id: response.data.order_id
          }
        })
      } else {
        $toast.success(`Pedido de depósito criado com sucesso! Número do pedido: ${response.data.order_id}`) // 充值订单创建成功！订单号：
        emit('close')
      }
    } else {
      // 检查是否是认证相关错误
      if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
        $toast.error('Sessão expirada. Faça login novamente.') // 会话已过期，请重新登录
        emit('close') // 关闭充值弹窗
        return
      }

      // 尝试翻译错误码
      const errorMsg = translateDepositError(response.code, response.msg || 'Falha no depósito')
      $toast.error(errorMsg)
    }

    // API完成后隐藏加载状态
    depositLoading.value = false
  } catch (err: any) {
    console.error('充值错误:', err)

    // catch块现在主要处理网络错误等异常
    const errorMessage = err instanceof Error ? err.message : 'Falha no depósito' // 充值失败
    $toast.error(errorMessage)

    // 错误时也隐藏加载状态
    depositLoading.value = false
  }
}

// 初始化数据
const initializeData = async () => {
  loading.value = true
  await Promise.all([fetchChannels(), fetchPlans()])

  // 默认选择第一个通道
  if (channels.value.length > 0) {
    selectedChannelCode.value = channels.value[0].code
  }

  loading.value = false
}

// 组件挂载时获取数据
onMounted(() => {
  initializeData()
})
</script>

<style scoped>
/* 从底部滑入动画 */
.slide-up-enter-active {
  transition: all 0.3s ease-out;
}

.slide-up-leave-active {
  transition: all 0.2s ease-in;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(100%);
}

.slide-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(100%);
}

/* 自定义滚动条 */
.modal-content::-webkit-scrollbar {
  display: none;
}

.modal-content {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 金额输入框整体高亮效果 */
.focused > div {
  border-color: var(--color-active);
}

/* 隐藏数字输入框的加减按钮 */
.number-input::-webkit-outer-spin-button,
.number-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.number-input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}


</style>
