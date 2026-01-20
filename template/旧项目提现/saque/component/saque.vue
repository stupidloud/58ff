<template>
    <div>
        <div class="bg-[var(--color-bg-primary)] p-[1rem]">
            <div class="flex items-center">
                <span class="text-[1rem] text-[var(--color-highlight-text)]">Saldo</span>
                <span class="text-[1rem] text-[var(--color-warning)] mx-[.5rem]">{{ formatCurrency(userBalance) }}</span>
                <svg @click="spin" :style="spinStyle" :class="{ 'opacity-50 pointer-events-none': isRefreshing }"
                    class="transition-transform duration-1500 ease-in-out !text-[1.4rem] fill-[var(--color-active)] w-[16px] h-[16px] cursor-pointer"
                    aria-hidden="true" focusable="false">
                    <use xlink:href="#comm_icon_sx--svgSprite:all"></use>
                </svg>
            </div>

            <!-- 投注要求进度条 -->
            <div class="mt-[1rem]">
                <div class="text-[1rem] text-[var(--color-highlight-text)] mb-[0.5rem]">
                    Requisitos de Apostas
                </div>
                <Progress
                    :current="bettingProgress.completed"
                    :max="bettingProgress.required"
                    width="50%"
                    backgroundColor="var(--color-bg-aside)"
                    containerClass="h-5"
                >
                    {{ bettingProgressPercentage }}%
                </Progress>
                <div v-if="bettingProgress.required > 0 && bettingProgress.completed < bettingProgress.required"
                     class="text-[0.8rem] text-[var(--color-highlight-text)] mt-[0.25rem]">
                    Complete os requisitos de apostas para liberar saques
                </div>
                <div v-else-if="bettingProgress.required > 0"
                     class="text-[0.8rem] text-[var(--color-success)] mt-[0.25rem]">
                    Requisitos de apostas atendidos
                </div>
            </div>
        </div>
        <div class="p-[1rem] pt-[2rem]">
            <div class="relative">
                <!-- 有账户时：显示下拉菜单 -->
                <div v-if="withdrawAccounts.length > 0" @click="toggleAccountDropdown"
                    class="px-[1rem] flex items-center h-[3.7rem] w-full rounded-[.5rem] bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)] cursor-pointer transition-colors duration-150"
                    :class="{ 'border-[var(--color-active)]': showAccountDropdown }">
                    <img :src="getConstantAssetUrl('/payment_method.png')" class="w-[2.4rem] h-[2.4rem]" alt="">

                    <!-- 显示当前选中的账户信息 -->
                    <div class="ml-[1rem] flex-1">
                        <div class="text-[1rem] text-white font-medium">{{ withdrawAccounts[0].account_name }}</div>
                        <div class="text-[0.8rem] text-[var(--color-highlight-text)]">
                            {{ withdrawAccounts[0].pix_type.toUpperCase() }}: {{ maskSensitiveInfo(withdrawAccounts[0].pix_number, 'pix') }}
                        </div>
                    </div>

                    <!-- 下拉箭头 -->
                    <svg class="!text-[1.4rem] fill-[var(--color-inactive66)] w-[14px] h-[14px] ml-auto transition-transform duration-150"
                        :class="{ 'rotate-90': showAccountDropdown, 'scale-x-[-1]': !showAccountDropdown }"
                        aria-hidden="true" focusable="false">
                        <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                    </svg>
                </div>

                <!-- 无账户时：直接跳转按钮 -->
                <div v-else @click="handleAdicionarConta"
                    class="px-[1rem] flex items-center h-[3.7rem] w-full rounded-[.5rem] bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)] cursor-pointer transition-colors duration-150 hover:border-[var(--color-active)]">
                    <img :src="getConstantAssetUrl('/payment_method.png')" class="w-[2.4rem] h-[2.4rem]" alt="">
                    <span class="text-[1rem] ml-[1rem] text-[var(--color-highlight-text)] flex-1">Adicionar Conta</span>
                    <span class="text-[var(--color-active)] text-[1rem]">+</span>
                </div>

                <!-- 下拉菜单内容 - 只在有账户时显示 -->
                <div v-if="withdrawAccounts.length > 0" class="absolute top-[4rem] left-0 w-full z-10 transition-all duration-150 origin-top"
                    :class="showAccountDropdown ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0'">

                    <!-- 账户列表 -->
                    <div class="bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)] rounded-[.5rem] overflow-hidden">
                        <!-- 当前账户（已选中状态） -->
                        <div class="px-[1rem] flex items-center h-[3.7rem] w-full bg-[var(--color-bg-secondary)] border-l-2 border-[var(--color-active)]">
                            <img :src="getConstantAssetUrl('/payment_method.png')" class="w-[2.4rem] h-[2.4rem]" alt="">
                            <div class="ml-[1rem] flex-1">
                                <div class="text-[1rem] text-white font-medium">{{ withdrawAccounts[0].account_name }}</div>
                                <div class="text-[0.8rem] text-[var(--color-highlight-text)]">
                                    {{ withdrawAccounts[0].pix_type.toUpperCase() }}: {{ maskSensitiveInfo(withdrawAccounts[0].pix_number, 'pix') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                class="mt-[2rem] mb-[2.5rem] px-[1rem] flex items-center h-[3.7rem] w-full rounded-[.5rem] bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)]">
                <span class="text-[1.2rem] text-[var(--color-highlight-text)]">R$</span>
                <input v-model="moneyAmount"
                    class="flex-1 px-[.5rem] text-[1.1rem] text-white focus:outline-none placeholder-[var(--color-inactive)] focus:ring-0 focus:border-gray-300"
                    type="tel" placeholder="Por favor, insira o valor do saque" autocomplete="off">
                <button @click="handleTudo" class="text-[var(--color-active)] text-[0.9rem] font-medium ml-[0.5rem] whitespace-nowrap hover:opacity-80 transition-opacity">
                    Tudo
                </button>
            </div>
            <div class="bg-[var(--color-inactive66)] h-[1px] w-full">

            </div>
            <div class="mt-[1.5rem] mb-[3rem]">
                <!-- 使用提现密码输入组件 -->
                <WithdrawPasswordInput
                    v-model="withdrawPassword"
                    label="Verificar Senha de Saque"
                    :show-label="true"
                    @complete="handlePasswordComplete"
                />
            </div>

            <button @click="handleWithdraw" :disabled="isWithdrawing"
                class="rounded-[.5rem] bg-[var(--color-active)] text-[var(--color-bg-primary)] text-[1.2rem] flex items-center justify-center w-full h-[3.6rem]">
                {{ isWithdrawing ? 'Processando...' : 'Confirmar' }}
            </button>
        </div>
    </div>

</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { playerApi, withdrawApi, type WithdrawAccount } from '../../../services/api'
import { maskSensitiveInfo } from '../../../utils/maskUtils'
import { $toast } from '../../../components/common/toast'
import WithdrawPasswordInput from '../../../components/ui/WithdrawPasswordInput.vue'
import Progress from '../../../components/ui/Progress.vue'
import { getConstantAssetUrl } from '../../../utils/assets'
import { formatCurrency } from '../../../utils/dateUtils'

const store = useStore()

// 定义 emit 事件
const emit = defineEmits<{
    'switch-to-gerenciar': []
    'switch-to-registro': []
}>()
const moneyAmount = ref("");


// 获取用户余额
const userBalance = computed(() => {
    return store.getters['auth/balance']
})

// 获取用户信息
const userInfo = computed(() => {
    return store.getters['auth/user']
})

// 投注要求进度
const bettingProgress = computed(() => {
    const user = userInfo.value
    if (!user) {
        return {
            required: 0,
            completed: 0,
            remaining: 0
        }
    }

    const required = user.required_betting_amount || 0
    const completed = user.completed_betting_amount || 0
    const remaining = Math.max(0, required - completed)

    return {
        required,
        completed,
        remaining
    }
})

// 投注要求百分比
const bettingProgressPercentage = computed(() => {
    const progress = bettingProgress.value
    if (progress.required <= 0) {
        return 0
    }
    const percentage = Math.min((progress.completed / progress.required) * 100, 100)
    return Number(percentage.toFixed(2))
})

// 提现密码状态
const withdrawPassword = ref('');


// 页面挂载时刷新用户数据
onMounted(async () => {
    try {
        // 如果用户已登录，从API刷新用户数据
        if (store.getters['auth/isAuthenticated']) {
            await store.dispatch('auth/fetchUserProfile')
            // 获取提现账户列表
            await fetchWithdrawAccounts()
        }
    } catch (error) {
        console.error('刷新用户数据失败:', error)
    }
})

const angle = ref(0); // 当前总角度
const isRefreshing = ref(false); // 刷新状态

const spinStyle = computed(() => ({
    transform: `rotate(${angle.value}deg)`,
}));

// 刷新余额函数
async function refreshBalance() {
    if (isRefreshing.value) return; // 防止重复请求

    try {
        isRefreshing.value = true;
        console.log('正在刷新余额...');

        const response = await playerApi.getBalance();

        if (response.code === 1) {
            // 更新store中的用户余额
            await store.dispatch('auth/updateBalance', response.data.balance);
            console.log('余额刷新成功:', response.data.balance);
        } else {
            console.error('刷新余额失败:', response.msg);
        }
    } catch (error) {
        console.error('刷新余额错误:', error);
    } finally {
        isRefreshing.value = false;
    }
}

function spin() {
    angle.value += 1080; // 每次加三圈（360 x 3）
    refreshBalance(); // 调用刷新余额API
}

// 处理"Tudo"按钮点击
const handleTudo = async () => {
    // 先调用spin刷新余额
    spin();

    // 等待刷新完成后，设置金额为余额的向下取整数
    // 由于spin是异步的，我们需要等待一下
    setTimeout(() => {
        const balance = userBalance.value;
        if (balance && balance > 0) {
            moneyAmount.value = Math.floor(balance).toString();
        }
    }, 100);
}

// 下拉菜单状态
const showAccountDropdown = ref(false);

// 提现账户相关状态
const withdrawAccounts = ref<WithdrawAccount[]>([]);
const loadingAccounts = ref(false);

// 处理密码输入完成
const handlePasswordComplete = (password: string) => {
    console.log('密码输入完成:', password);
    // 可以在这里添加自动提交逻辑
};

// 切换下拉菜单显示状态
const toggleAccountDropdown = () => {
    showAccountDropdown.value = !showAccountDropdown.value
}

// 处理点击"Adicionar Conta"按钮
const handleAdicionarConta = () => {
    showAccountDropdown.value = false // 关闭下拉菜单
    emit('switch-to-gerenciar') // 切换到设置提现账户的tab
}



// 提现相关状态
const isWithdrawing = ref(false);

// 提现错误码翻译
const translateWithdrawError = (code: number, defaultMsg: string): string => {
    const errorMessages: Record<number, string> = {
        6001: 'O valor do saque deve ser maior que zero', // 提现金额必须大于0
        6002: 'Por favor, insira a senha de saque', // 请输入提现密码
        6003: 'A senha de saque deve ter 6 dígitos', // 提现密码必须为6位数字
        6004: 'Por favor, faça login primeiro', // 请先登录
        6005: 'Jogador não encontrado', // 玩家不存在/虚拟玩家不存在
        6006: 'Por favor, configure primeiro sua senha de saque', // 请先设置提现密码
        6007: 'Senha de saque incorreta', // 提现密码错误
        6008: 'Saldo insuficiente', // 余额不足
        6009: 'Requisitos de apostas não atendidos', // 未满足投注要求
        6010: 'O valor do saque excede o limite de saque único para o seu nível VIP', // 提现金额超出VIP单笔限额
        6011: 'Excedido o limite de saque diário para o seu nível VIP', // 超出VIP每日提现限额
        6012: 'Excedido o número de saques diários para o seu nível VIP', // 超出VIP每日提现次数限制
        6013: 'Excedido o limite total de saque para o seu nível VIP', // 超出VIP总提现限额
        6014: 'Por favor, configure primeiro sua conta de recebimento', // 请先设置提现账户
        6015: 'Falha ao criar ordem de saque', // 创建提现订单失败
        6016: 'Falha ao deduzir saldo', // 扣除余额失败
        6017: 'O valor atual excede o limite do canal de pagamento, por favor, ajuste o valor do saque' // 当前金额超出支付通道限制
    };

    return errorMessages[code] || defaultMsg;
};

// 提现功能
const handleWithdraw = async () => {
    if (isWithdrawing.value) return;

    // 验证提现金额
    const amountValue = moneyAmount.value;
    if (!/^\d+$/.test(amountValue)) {
        $toast.error('Por favor, insira um valor de saque válido (apenas números)');
        return;
    }

    const amount = parseFloat(amountValue);
    if (isNaN(amount) || amount <= 0) {
        $toast.error('O valor do saque deve ser maior que zero');
        return;
    }

    // 验证提现密码
    const password = withdrawPassword.value;
    if (password.length !== 6) {
        $toast.error('A senha de saque deve ter 6 dígitos');
        return;
    }

    if (!/^\d{6}$/.test(password)) {
        $toast.error('A senha de saque deve conter apenas números');
        return;
    }

    // 验证投注要求
    const progress = bettingProgress.value;
    if (progress.required > 0 && progress.remaining > 0) {
        $toast.error('Requisitos de apostas não atendidos');
        return;
    }

    try {
        isWithdrawing.value = true;

        console.log('提交提现申请:', { amount, password });

        // 调用提现API
        const response = await withdrawApi.create(amount, password);

        if (response.code === 1) {
            console.log('提现申请成功:', response.data);

            // 根据status字段显示不同的成功消息
            const status = response.data?.status;
            if (status === 'auto_approved') {
                $toast.success('Solicitação de saque aprovada automaticamente e está sendo processada!');
            } else if (status === 'pending') {
                $toast.success('Solicitação de saque enviada com sucesso, aguardando aprovação!');
            } else if (status === 'completed') {
                // 虚拟玩家提现完成
                $toast.success('Saque realizado com sucesso!');
            } else {
                // 兼容旧版本响应格式
                $toast.success('Solicitação de saque enviada com sucesso!');
            }

            // 清空表单
            moneyAmount.value = '';
            withdrawPassword.value = '';

            // 刷新余额
            await refreshBalance();

            // 跳转到registro tab
            emit('switch-to-registro');
        } else {
            // 检查是否是认证相关错误
            if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
                $toast.error('Sessão expirada. Faça login novamente.') // 会话已过期，请重新登录
                return
            }

            // 处理其他API错误
            const errorCode = response.code;
            const originalMsg = response.msg || 'Erro ao processar saque';
            const translatedMsg = translateWithdrawError(errorCode, originalMsg);
            $toast.error(translatedMsg);
        }

    } catch (error: any) {
        console.error('提现申请失败:', error);

        // catch块现在主要处理网络错误等异常
        const errorMsg = error instanceof Error ? error.message : 'Erro ao processar saque, tente novamente';
        $toast.error(errorMsg);
    } finally {
        isWithdrawing.value = false;
    }
};

// 获取提现账户列表
const fetchWithdrawAccounts = async () => {
    try {
        loadingAccounts.value = true;
        const response = await playerApi.getWithdrawAccounts();

        if (response.code === 1) {
            withdrawAccounts.value = response.data.accounts;
            console.log('获取提现账户成功:', response.data.accounts);
        } else {
            console.error('获取提现账户失败:', response.msg);
        }
    } catch (error: any) {
        console.error('获取提现账户错误:', error);
        // 不显示错误提示，因为可能是用户还没有设置账户
    } finally {
        loadingAccounts.value = false;
    }
};

</script>