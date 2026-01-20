<template>
    <div>
        <div class="p-[1rem]">
            <div
                class="flex items-center bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)] rounded-[.5rem] py-[1.5rem] px-[1rem]">
                <span class="text-white text-[1rem]">Conta para recebimento</span>
                <span class="text-[var(--color-highlight-text)] text-[1rem] ml-[.2rem]">({{ withdrawAccounts.length }}/1)</span>
                <div class="ml-auto">
                    <svg @click="showOut = !showOut" v-if="!showOut"
                        class=" w-[1.4rem] h-[1.4rem] fill-[var(--color-inactive)]">
                        <use xlink:href="#comm_icon_hide--svgSprite:all"></use>
                    </svg>
                    <svg @click="showOut = !showOut" v-else class=" w-[1.4rem] h-[1.4rem] fill-[var(--color-active)]">
                        <use xlink:href="#comm_icon_show--svgSprite:all"></use>
                    </svg>
                </div>
            </div>
        </div>

        <!-- 账户列表显示区域 -->
        <div v-if="showOut && withdrawAccounts.length > 0" class="p-[1rem] pt-0">
            <div v-for="account in withdrawAccounts" :key="account.id"
                 class="bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)] rounded-[.5rem] p-[1rem] mb-[1rem]">
                <div class="flex items-center justify-between mb-[0.5rem]">
                    <span class="text-white text-[1rem] font-medium">{{ account.account_name }}</span>
                    <span class="text-[var(--color-active)] text-[0.9rem] uppercase">{{ account.pix_type }}</span>
                </div>
                <div class="text-[var(--color-highlight-text)] text-[0.9rem] mb-[0.5rem]">
                    PIX: {{ maskSensitiveInfo(account.pix_number, 'pix') }}
                </div>
                <div v-if="account.cpf" class="text-[var(--color-highlight-text)] text-[0.9rem]">
                    CPF: {{ maskSensitiveInfo(account.cpf, 'cpf') }}
                </div>
            </div>
        </div>



        <!-- 底部添加账户按钮 - 只在没有账户时显示 -->
        <div v-if="withdrawAccounts.length === 0" class="fixed max-w-[516px] m-auto flex bottom-0 left-0 right-0 bg-[var(--color-bg-primary)] p-[1rem]">
            <div @click="setPassShow = true"
                class="px-[.5rem] flex items-center h-[4rem] w-full rounded-[.5rem] bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)]">
                <img :src="getConstantAssetUrl('/payment_method.png')" class="w-[3rem] h-[3rem]" alt="">
                <span class="text-[1.2rem] ml-[1rem] text-[var(--color-highlight-text)]">PIX</span>
                <span class="ml-auto mr-[.5rem] text-[1.2rem] text-[var(--color-active)]">Adicionar</span>
                <svg class="!text-[1.4rem] fill-[var(--color-inactive66)] w-[1.2rem] h-[1.2rem] scale-x-[-1]"
                    aria-hidden="true" focusable="false">
                    <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                </svg>
            </div>
        </div>

        <div v-if="setPassShow"
            class="fixed top-0 z-999 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center">
            <div
                class="max-w-[465px] relative bg-[var(--color-bg-primary)] p-[1rem] rounded-[1rem] w-[90%] translate-y-[-50%] border border-[var(--color-inactive66)]">
                <p class="text-white text-[1.4rem] text-center p-[1rem] pt-0"> Inserir Senha </p>

                <!-- 使用提现密码输入组件 -->
                <WithdrawPasswordInput
                    v-model="withdrawPassword"
                    label="Senha de Saque"
                    :show-label="true"
                    @complete="handlePasswordComplete"
                />

                <div class="flex items-center justify-between my-[2rem]">
                    <span class="text-white text-[1rem]">
                        Para a segurança da sua conta, introduza a senha de saque
                    </span>
                    <span class="text-[var(--color-active)] text-[1rem] ml-[1rem]">
                        Esqueceu a senha?
                    </span>
                </div>
                <button @click="handlePasswordSubmit" :disabled="loading"
                    class="rounded-[.5rem] bg-[var(--color-active)] text-[var(--color-bg-primary)] text-[1.2rem] flex items-center justify-center w-full h-[3.6rem]">
                    {{ loading ? 'Verificando...' : 'Próximo' }}
                </button>
                <div @click="setPassShow = false"
                    class="absolute bottom-[-5rem] right-0 left-0 m-auto p-2 flex justify-center">
                    <img class="h-[3rem]" :src="getConstantAssetUrl('/icons/close-icon.png')" alt="">
                </div>
            </div>
        </div>

        <!-- Adicionar PIX Modal -->
        <transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition-all duration-300 ease-in"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="showPixModal"
                class="fixed top-0 z-999 left-0 right-0 bottom-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-[1rem]">
                <transition
                    enter-active-class="transition-all duration-300 ease-out"
                    enter-from-class="opacity-0 scale-95 translate-y-4"
                    enter-to-class="opacity-100 scale-100 translate-y-0"
                    leave-active-class="transition-all duration-200 ease-in"
                    leave-from-class="opacity-100 scale-100 translate-y-0"
                    leave-to-class="opacity-0 scale-95 translate-y-4">
                    <div v-if="showPixModal" class="relative bg-[var(--color-bg-primary)] rounded-[1rem] w-120 translate-y-[-25%]">
                <!-- 标题栏 -->
                <div class="flex items-center justify-between p-[1.5rem] pb-[1rem]">
                    <h2 class="text-white text-[1.4rem] text-center w-full mb-[1rem]">Adicionar PIX</h2>
                </div>

                <!-- 表单内容 -->
                <div class="px-[1.5rem] pb-[1.5rem]">
                    <!-- 动态渲染输入框 -->
                    <div v-for="(field, index) in inputFields" :key="field.key" class="mb-[1.5rem]"
                        :class="{ 'mb-[2rem]': index === inputFields.length - 1 }">

                        <!-- 普通输入框 -->
                        <div v-if="field.type !== 'select'" class="relative">
                            <div class="flex items-center w-full h-[3.5rem] px-[1rem] rounded-[0.5rem] bg-transparent border border-[var(--color-inactive66)] transition-colors duration-200"
                                :class="{ 'border-[var(--color-active)]': field.focused }">
                                <input :value="getFieldValue(field.key)" @input="updateFieldValue(field.key, $event)"
                                    :type="field.inputType" :placeholder="field.placeholder"
                                    :maxlength="field.key === 'cpf' || field.key === 'phone' ? 11 : undefined"
                                    @focus="field.focused = true" @blur="field.focused = false"
                                    class="flex-1 bg-transparent text-white placeholder-[var(--color-inactive)] focus:outline-none">

                                <!-- 清空按钮 -->
                                <svg v-if="getFieldValue(field.key)" @click="clearField(field)" viewBox="0 0 24 24"
                                    class="w-[2rem] h-[2rem] text-[var(--color-inactive)] cursor-pointer hover:text-[var(--color-active)] transition-colors duration-200 ml-[0.5rem]">
                                    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.8" />
                                    <path d="M15 9l-6 6M9 9l6 6" stroke="white" stroke-width="2"
                                        stroke-linecap="round" />
                                </svg>
                            </div>
                        </div>

                        <!-- 选择器 -->
                        <div v-else class="relative">
                            <div @click="toggleCpfDropdown"
                                class="w-full h-[3.5rem] px-[1rem] rounded-[0.5rem] bg-transparent border border-[var(--color-inactive66)] text-white flex items-center justify-between cursor-pointer transition-colors duration-200"
                                :class="{ 'border-[var(--color-active)]': showCpfDropdown }">
                                <span class="text-[var(--color-inactive)]">
                                    {{ selectedCpfType || field.placeholder }}
                                </span>
                                <svg class="!text-[1.4rem] fill-[var(--color-inactive66)] w-[14px] h-[14px] ml-auto transition-transform duration-300"
                                    :class="{ 'rotate-90': showCpfDropdown, 'scale-x-[-1]': !showCpfDropdown }"
                                    aria-hidden="true" focusable="false">
                                    <use xlink:href="#comm_icon_fh--svgSprite:all"></use>
                                </svg>
                            </div>

                            <!-- 下拉选项 -->
                            <div v-if="showCpfDropdown"
                                class="absolute top-[3.5rem] left-0 w-full bg-[var(--color-bg-primary)] border border-[var(--color-inactive66)] rounded-[0.5rem] z-10 overflow-hidden">
                                <div v-for="option in cpfOptions" :key="option.value" @click="selectCpfType(option)"
                                    class="px-[1rem] py-[0.8rem] cursor-pointer transition-colors duration-200 hover:bg-[var(--color-active)]"
                                    :class="selectedCpfType === option.value ? 'text-[var(--color-active)]' : 'text-[var(--color-inactive)]'">
                                    {{ option.label }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p class="mt-[1.5rem] !leading-[1.5] mb-[2.5rem] text-white text-[.9rem]">
                        Apenas 1 conta PIX do tipo PIX-CPF pode ser adicionada
                        <br>
                        Por favor, verifique cuidadosamente, caso contrário, não será creditado.
                    </p>

                    <!-- 确认按钮 -->
                    <button @click="confirmAddAccount" :disabled="loading"
                        class="rounded-[.5rem] bg-[var(--color-active)] text-[var(--color-bg-primary)] text-[1.2rem] flex items-center justify-center w-full h-[3.6rem]">
                        {{ loading ? 'Processando...' : 'Confirmar' }}
                    </button>
                </div>

                <div @click="closeModal" class="absolute bottom-[-5rem] right-0 left-0 m-auto p-2 flex justify-center z-[1000] cursor-pointer">
                    <img class="w-[3rem] h-[3rem]" :src="getConstantAssetUrl('/icons/close-icon.png')" alt="">
                </div>
                    </div>
                </transition>
            </div>
        </transition>
    </div>
</template>
<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { playerApi, type WithdrawAccount } from '../../../services/api'
import { $toast } from '../../../components/common/toast'
import { maskSensitiveInfo } from '../../../utils/maskUtils'
import WithdrawPasswordInput from '../../../components/ui/WithdrawPasswordInput.vue'
import { getConstantAssetUrl } from '../../../utils/assets'

// 提现相关错误码翻译
const translateWithdrawError = (code: number, defaultMsg: string): string => {
    const errorMessages: Record<number, string> = {
        // 提现密码相关错误
        6002: 'Por favor, insira a senha de saque', // 请输入提现密码
        6003: 'A senha de saque deve ter 6 dígitos', // 提现密码必须为6位数字
        6004: 'Por favor, faça login primeiro', // 请先登录
        6006: 'Por favor, configure primeiro sua senha de saque', // 请先设置提现密码
        6007: 'Senha de saque incorreta', // 提现密码错误

        // 提现账户相关错误
        6014: 'Por favor, configure primeiro sua conta de recebimento', // 请先设置提现账户
        3007: 'Jogadores virtuais não suportam função de conta de saque', // 虚拟玩家不支持提现账户功能
        3008: 'Jogadores virtuais não suportam configuração de conta de saque', // 虚拟玩家不支持设置提现账户

        // 玩家相关错误
        6005: 'Jogador não encontrado', // 玩家不存在/虚拟玩家不存在
        4008: 'Informações do jogador não existem (configuração de senha de saque)', // 玩家不存在（设置提现密码）
        4009: 'Informações do jogador não existem (verificação de senha de saque)', // 玩家不存在（检查提现密码）

        // 通用错误
        0: 'Operação falhou, tente novamente' // 操作失败，请重试
    };

    return errorMessages[code] || defaultMsg;
};

const showOut = ref(false);
const setPassShow = ref(false);
const showPixModal = ref(false);
const loading = ref(false);
const withdrawPassword = ref('');

// 提现账户相关状态
const withdrawAccounts = ref<WithdrawAccount[]>([]);
const loadingAccounts = ref(false);

// 添加账户相关状态
const showCpfDropdown = ref(false);
const selectedCpfType = ref('CPF');

// CPF 选项
const cpfOptions = [
    { label: 'CPF', value: 'CPF' },
    { label: 'PHONE', value: 'PHONE' },
    { label: 'EMAIL', value: 'EMAIL' },
    { label: 'EVP', value: 'EVP' },
    { label: 'CNPJ', value: 'CNPJ' },
];

// 账户表单数据
const accountForm = ref({
    name: '',
    cpf: '',
    cnpj: '',
    phone: '',
    email: '',
    evp: ''
});

// 输入框配置数组
const inputFields = computed(() => [
    {
        key: 'name',
        type: 'input',
        inputType: 'text',
        placeholder: 'Por favor, insira o nome',
        value: accountForm.value.name,
        focused: false
    },
    {
        key: 'select',
        type: 'select',
        placeholder: 'CPF',
        value: selectedCpfType.value,
        focused: false
    },
    // 当绑定方式是CPF时，只显示CPF输入框
    ...(selectedCpfType.value === 'CPF' ? [{
        key: 'cpf',
        type: 'input',
        inputType: 'text',
        placeholder: 'Por favor, insira o número de CPF de 11 dígitos',
        value: accountForm.value.cpf,
        focused: false
    }] : []),
    // 当绑定方式是其他方式时，显示对应的账号输入框和CPF输入框
    ...(selectedCpfType.value === 'CNPJ' ? [
        {
            key: 'cnpj',
            type: 'input',
            inputType: 'text',
            placeholder: 'Por favor, insira a conta PIX',
            value: accountForm.value.cnpj,
            focused: false
        },
        {
            key: 'cpf',
            type: 'input',
            inputType: 'text',
            placeholder: 'Por favor, insira o número de CPF de 11 dígitos',
            value: accountForm.value.cpf,
            focused: false
        }
    ] : []),
    ...(selectedCpfType.value === 'PHONE' ? [
        {
            key: 'phone',
            type: 'input',
            inputType: 'tel',
            placeholder: 'Por favor, insira o número de telefone (11 dígitos)',
            value: accountForm.value.phone,
            focused: false
        },
        {
            key: 'cpf',
            type: 'input',
            inputType: 'text',
            placeholder: 'Por favor, insira o número de CPF de 11 dígitos',
            value: accountForm.value.cpf,
            focused: false
        }
    ] : []),
    ...(selectedCpfType.value === 'EMAIL' ? [
        {
            key: 'email',
            type: 'input',
            inputType: 'email',
            placeholder: 'Por favor, insira a conta PIX',
            value: accountForm.value.email,
            focused: false
        },
        {
            key: 'cpf',
            type: 'input',
            inputType: 'text',
            placeholder: 'Por favor, insira o número de CPF de 11 dígitos',
            value: accountForm.value.cpf,
            focused: false
        }
    ] : []),
    ...(selectedCpfType.value === 'EVP' ? [
        {
            key: 'evp',
            type: 'input',
            inputType: 'text',
            placeholder: 'Por favor, insira a conta PIX',
            value: accountForm.value.evp,
            focused: false
        },
        {
            key: 'cpf',
            type: 'input',
            inputType: 'text',
            placeholder: 'Por favor, insira o número de CPF de 11 dígitos',
            value: accountForm.value.cpf,
            focused: false
        }
    ] : [])
]);

// 处理密码输入完成
const handlePasswordComplete = (password: string) => {
    console.log('密码输入完成:', password);
    // 可以在这里添加自动提交逻辑
};

// 处理密码提交验证
const handlePasswordSubmit = async () => {
    if (loading.value) return;

    const password = withdrawPassword.value;

    // 表单验证
    if (password.length !== 6) {
        $toast.error('A senha de saque deve ter 6 dígitos');
        return;
    }

    if (!/^\d{6}$/.test(password)) {
        $toast.error('A senha de saque deve conter apenas números');
        return;
    }

    try {
        loading.value = true;

        // 调用验证提现密码API
        const response = await playerApi.verifyWithdrawPassword(password);

        if (response.code === 1 && response.data?.verified) {
            // 验证成功，关闭密码弹窗，显示PIX弹窗
            setPassShow.value = false;
            showPixModal.value = true;

            // 清空密码输入
            withdrawPassword.value = '';

            $toast.success('Senha verificada com sucesso!');
        } else {
            // 检查是否是认证相关错误
            if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
                $toast.error('Sessão expirada. Faça login novamente.') // 会话已过期，请重新登录
                return
            }

            // 使用翻译函数处理提现密码相关错误
            const errorMsg = translateWithdrawError(response.code, response.msg || 'Senha de saque incorreta');
            $toast.error(errorMsg);
        }
    } catch (error: any) {
        console.error('验证提现密码失败:', error);
        const errorMsg = error instanceof Error ? error.message : 'Erro ao verificar senha de saque';
        $toast.error(errorMsg);
    } finally {
        loading.value = false;
    }
};

// 表单验证错误信息
const formValidationError = ref('');

// 表单验证
const isFormValid = computed(() => {
    const form = accountForm.value;
    const hasName = form.name.trim() !== '';

    // 清空之前的错误信息
    formValidationError.value = '';

    // 验证姓名
    if (!hasName) {
        formValidationError.value = 'Por favor, insira o nome';
        return false;
    }

    // 验证类型选择
    if (!selectedCpfType.value) {
        formValidationError.value = 'Por favor, selecione o tipo de PIX';
        return false;
    }

    // 根据选择的类型验证对应字段
    let hasRequiredField = false;
    switch (selectedCpfType.value) {
        case 'CPF':
            // CPF方式只需要验证CPF字段
            hasRequiredField = form.cpf.trim() !== '';
            if (!hasRequiredField) {
                formValidationError.value = 'Por favor, insira o número de CPF de 11 dígitos';
            }
            break;
        case 'CNPJ':
            // CNPJ方式需要验证CNPJ账号和CPF字段
            const hasCnpj = form.cnpj.trim() !== '';
            const hasCpfForCnpj = form.cpf.trim() !== '';
            hasRequiredField = hasCnpj && hasCpfForCnpj;
            if (!hasCnpj) {
                formValidationError.value = 'Por favor, insira a conta PIX';
            } else if (!hasCpfForCnpj) {
                formValidationError.value = 'Por favor, insira o número de CPF de 11 dígitos';
            }
            break;
        case 'PHONE':
            const phoneValue = form.phone.trim();
            const hasCpfForPhone = form.cpf.trim() !== '';
            const isPhoneFormatValid = /^[1-9][1-9]9\d{8}$/.test(phoneValue);

            if (!phoneValue) {
                formValidationError.value = 'Por favor, insira o número de telefone (11 dígitos)';
                hasRequiredField = false;
            } else if (phoneValue.length !== 11) {
                formValidationError.value = 'Número de telefone deve ter exatamente 11 dígitos';
                hasRequiredField = false;
            } else if (!isPhoneFormatValid) {
                formValidationError.value = 'Formato de telefone celular inválido (ex: 11999999999)';
                hasRequiredField = false;
            } else if (!hasCpfForPhone) {
                formValidationError.value = 'Por favor, insira o número de CPF de 11 dígitos';
                hasRequiredField = false;
            } else {
                hasRequiredField = true;
            }
            break;
        case 'EMAIL':
            // 邮箱方式需要验证邮箱和CPF字段
            const hasEmail = form.email.trim() !== '';
            const hasCpfForEmail = form.cpf.trim() !== '';
            hasRequiredField = hasEmail && hasCpfForEmail;
            if (!hasEmail) {
                formValidationError.value = 'Por favor, insira a conta PIX';
            } else if (!hasCpfForEmail) {
                formValidationError.value = 'Por favor, insira o número de CPF de 11 dígitos';
            }
            break;
        case 'EVP':
            // EVP方式需要验证EVP和CPF字段
            const hasEvp = form.evp.trim() !== '';
            const hasCpfForEvp = form.cpf.trim() !== '';
            hasRequiredField = hasEvp && hasCpfForEvp;
            if (!hasEvp) {
                formValidationError.value = 'Por favor, insira a conta PIX';
            } else if (!hasCpfForEvp) {
                formValidationError.value = 'Por favor, insira o número de CPF de 11 dígitos';
            }
            break;
        default:
            hasRequiredField = false;
            formValidationError.value = 'Tipo de PIX inválido';
    }

    return hasRequiredField;
});

// 关闭模态框
const closeModal = () => {
    // 关闭 PIX 模态框
    showPixModal.value = false;

    // 重置表单
    accountForm.value = {
        name: '',
        cpf: '',
        cnpj: '',
        phone: '',
        email: '',
        evp: ''
    };
    selectedCpfType.value = '';
    showCpfDropdown.value = false;
};

// 切换 CPF 下拉菜单
const toggleCpfDropdown = () => {
    showCpfDropdown.value = !showCpfDropdown.value;
};

// 选择 CPF 类型
const selectCpfType = (option: { label: string; value: string }) => {
    selectedCpfType.value = option.value;
    showCpfDropdown.value = false;

    // 清空其他字段
    accountForm.value.cpf = '';
    accountForm.value.phone = '';
    accountForm.value.email = '';
    accountForm.value.evp = '';
};

// 获取字段值
const getFieldValue = (key: string) => {
    switch (key) {
        case 'name':
            return accountForm.value.name;
        case 'cpf':
            return accountForm.value.cpf;
        case 'phone':
            return accountForm.value.phone;
        case 'email':
            return accountForm.value.email;
        case 'evp':
            return accountForm.value.evp;
        default:
            return '';
    }
};

// 更新字段值
const updateFieldValue = (key: string, event: Event) => {
    const target = event.target as HTMLInputElement;
    let value = target.value;

    switch (key) {
        case 'name':
            accountForm.value.name = value;
            break;
        case 'cpf':
            // 限制CPF只能输入数字，最多11位
            value = value.replace(/\D/g, ''); // 移除所有非数字字符
            if (value.length > 11) {
                value = value.slice(0, 11); // 限制最多11位
            }
            accountForm.value.cpf = value;
            // 更新输入框的值
            target.value = value;
            break;
        case 'cnpj':
            accountForm.value.cnpj = value;
            break;
        case 'phone':
            // 限制手机号只能输入数字，最多11位（巴西手机号格式）
            value = value.replace(/\D/g, ''); // 移除所有非数字字符
            if (value.length > 11) {
                value = value.slice(0, 11); // 限制最多11位
            }
            accountForm.value.phone = value;
            // 更新输入框的值
            target.value = value;
            break;
        case 'email':
            accountForm.value.email = value;
            break;
        case 'evp':
            accountForm.value.evp = value;
            break;
    }
};

// 清空输入框
const clearField = (field: any) => {
    switch (field.key) {
        case 'name':
            accountForm.value.name = '';
            break;
        case 'cpf':
            accountForm.value.cpf = '';
            break;
        case 'cnpj':
            accountForm.value.cnpj = '';
            break;
        case 'phone':
            accountForm.value.phone = '';
            break;
        case 'email':
            accountForm.value.email = '';
            break;
        case 'evp':
            accountForm.value.evp = '';
            break;
    }
};

// 确认添加账户
const confirmAddAccount = async () => {
    if (loading.value) return;

    // 验证表单，如果无效则显示错误信息
    if (!isFormValid.value) {
        if (formValidationError.value) {
            $toast.error(formValidationError.value);
        }
        return;
    }

    try {
        loading.value = true;

        // 构建API提交数据
        const apiData = {
            pix_type: selectedCpfType.value.toLowerCase(), // API要求小写
            pix_number: '',
            account_name: accountForm.value.name.trim(),
            cpf: undefined as string | undefined
        };

        // 根据类型设置PIX号码和CPF
        switch (selectedCpfType.value) {
            case 'CPF':
                // CPF方式：pix_number是CPF，同时也要提交cpf字段
                apiData.pix_number = accountForm.value.cpf.trim();
                apiData.cpf = accountForm.value.cpf.trim() || undefined;
                break;
            case 'CNPJ':
                // CNPJ方式：pix_number是CNPJ，cpf是单独的CPF
                apiData.pix_number = accountForm.value.cnpj.trim();
                apiData.cpf = accountForm.value.cpf.trim() || undefined;
                break;
            case 'PHONE':
                // 手机方式：pix_number是手机号，cpf是单独的CPF
                apiData.pix_number = accountForm.value.phone.trim();
                apiData.cpf = accountForm.value.cpf.trim() || undefined;
                break;
            case 'EMAIL':
                // 邮箱方式：pix_number是邮箱，cpf是单独的CPF
                apiData.pix_number = accountForm.value.email.trim();
                apiData.cpf = accountForm.value.cpf.trim() || undefined;
                break;
            case 'EVP':
                // EVP方式：pix_number是EVP，cpf是单独的CPF
                apiData.pix_number = accountForm.value.evp.trim();
                apiData.cpf = accountForm.value.cpf.trim() || undefined;
                break;
        }

        // 清理undefined的cpf字段
        if (!apiData.cpf) {
            delete (apiData as any).cpf;
        }

        console.log('提交账户数据:', apiData);

        // 调用设置提现账户API
        const response = await playerApi.setWithdrawAccount(apiData);

        if (response.code === 1) {
            console.log('账户设置成功:', response.data);
        } else {
            // 检查是否是认证相关错误
            if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
                $toast.error('Sessão expirada. Faça login novamente.') // 会话已过期，请重新登录
                return
            }

            // 使用翻译函数处理提现账户相关错误
            const errorMsg = translateWithdrawError(response.code, response.msg || 'Erro ao adicionar conta PIX');
            $toast.error(errorMsg);
            return
        }

        // 成功提示
        $toast.success('Conta PIX adicionada com sucesso!');

        // 重新获取账户列表
        await fetchWithdrawAccounts();

        // 关闭模态框
        closeModal();

    } catch (error: any) {
        console.error('添加账户失败:', error);

        // catch块现在主要处理网络错误等异常
        const errorMsg = error instanceof Error ? error.message : 'Erro ao adicionar conta PIX, tente novamente';
        $toast.error(errorMsg);
    } finally {
        loading.value = false;
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
            // 检查是否是认证相关错误
            if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
                // 认证错误：静默处理，不显示错误
                console.log('认证错误，需要重新登录');
                return;
            }

            console.error('获取提现账户失败:', response.msg, 'code:', response.code);
        }
    } catch (error: any) {
        console.error('获取提现账户错误:', error);
        // 不显示错误提示，因为可能是用户还没有设置账户
    } finally {
        loadingAccounts.value = false;
    }
};



// 组件挂载时获取提现账户
onMounted(() => {
    fetchWithdrawAccounts();
});
</script>