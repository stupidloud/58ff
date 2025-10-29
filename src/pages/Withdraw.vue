<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <div class="p-[.75rem] bg-[var(--color-bg-aside-2)] rounded-[.625rem]">
            <div class="flex items-center">
                <p class="text-white text-[1.125rem] font-[600]">Saque</p>
                <div
                    class="w-[1.5rem] h-[1.5rem] bg-[var(--color-active)] flex items-center justify-center rounded-[100px] ml-[.625rem]">
                    <ion-icon class="text-white w-[1rem] h-[1rem]" name="receipt-outline"></ion-icon>
                </div>
                <div @click="router.back()" class="text-white cursor-pointer ml-auto">   
                    <ion-icon class="w-[2rem] h-[2rem]" name="close"></ion-icon>                    
                </div>
            </div>
            <p class="w-[18.75rem] text-white text-[.75rem] text-left leading-[1.125rem] mt-[1.25rem]">
                Se você tiver dúvidas ou problemas, entre em contato com o suporte ao cliente. Obrigado!
            </p>
            <div
                class="w-[18.75rem] text-[var(--color-highlight)] text-[.75rem] text-left leading-[1.125rem] mb-[1rem] flex items-center mt-[.05rem] font-[600]">
                <div class="w-[1.1rem] h-[1.1rem] bg-[var(--color-highlight)] hover:bg-[#fc974c] mr-[.25rem]"
                    style="-webkit-mask: url('/static/profile/customer.svg') no-repeat center / contain; mask: url('/static/profile/customer.svg') no-repeat center / contain;">
                </div>
                suporte online.
            </div>
            <div class="w-full h-[1px] bg-white/20 mb-[.75rem]"></div>
            <p class="text-white text-[.75rem] font-[600] text-left">Canais de Saque</p>
            <div
                class="mt-[.4375rem] h-[1.875rem] w-[4.3125rem] bg-[var(--color-active)] flex items-center justify-center rounded-[.315rem]  text-white font-[700] text-[.75rem] cursor-pointer hover:brightness-105">
                PIX</div>
            <p class="mt-[.75rem] text-white text-[.875rem] font-[600] text-left">
                Conta Saldo
                <span class="text-[var(--color-warning)]">R${{ myMoney }}</span>
            </p>
            <p class="text-[.75rem] text-white/40 text-left font-[400]">
                Você preciso apostar <span class="text-white">R$ 0,30</span> para sacar <span
                    class="text-[var(--color-text-link)] cursor-pointer">Ver detalhes</span>
            </p>
            <div class="flex items-center w-full rounded-[.315rem] overflow-hidden border px-[.5rem] mt-[.4375rem] my-[1.75rem] bg-[var(--color-main-bg)]"
                :class="inputAmount ? '!border-[var(--color-success)]' : 'border-[var(--color-border-2)]'">
                <span
                    class="pr-[.5rem] text-[.85rem] h-[2.75rem] font-[700] text-[var(--color-warning)] flex items-center justify-center">R$</span>
                <input v-model="inputAmount" @input="onInputChange" type="number" placeholder="5-50.000" name="username"
                    class="flex-1 bg-transparent outline-none text-white text-[.85rem] h-[2.75rem] font-[700]" />
                <div @click="setMaxAmount"
                    class="w-[3rem] h-[2.125rem] flex items-center justify-center text-[.875rem]  rounded-[.315rem] bg-[var(--color-bg-aside)] font-[700] text-white/40  cursor-pointer hover:brightness-105">
                    Máx.</div>
            </div>


            <div class="flex flex-wrap gap-[.75rem] mt-[.75rem]">
                <div v-for="amount in amounts" :key="amount" @click="selectAmount(amount)"
                    class="w-[calc(33.333%-0.5rem)] flex items-center justify-center rounded-[.315rem] h-[2.375rem] text-white text-[1rem] font-[700] cursor-pointer hover:brightness-105 transition-all duration-200"
                    :class="selectedAmount === amount ?
                        'border border-[var(--color-active)] [background:linear-gradient(180deg,rgba(0,0,0,0)_30.59%,var(--color-active)_110.34%),_var(--color-tabbar)]' :
                        'bg-[var(--color-bg-aside)]'">
                    {{ amount }}
                </div>
                <p class="text-white/40 text-[.75rem] flex items-center">
                    <ion-icon name="information-circle-outline"></ion-icon>
                    Taxa de Manuseio: <span class="text-white ml-[.25rem]">R$0,00</span>
                </p>
            </div>
        </div>
        <div class="p-[.75rem]">
            <p class="text-white text-[.75rem] font-[600] text-left">Método de Retirada</p>
            <div class="flex items-center gap-[.5rem]">
                <div 
                    v-for="method in withdrawMethods" 
                    :key="method.id"
                    @click="selectMethod(method.id)"
                    class="mt-[.4375rem] h-[1.875rem] border-1 border-[var(--color-border-1)] w-[4.3125rem] flex items-center justify-center rounded-[.315rem] font-[700] text-[.75rem] cursor-pointer hover:brightness-105 transition-all duration-200"
                    :class="selectedMethod === method.id ? 
                        'bg-[var(--color-bg-aside-2)] text-[var(--color-active)]' : 
                        'bg-transparent text-white/40'"
                >
                    {{ method.label }}
                </div>
            </div>            
            <div class="mt-[1rem]">                
                <div class="mb-[.75rem]">
                    <label class="block text-white/40 text-[.75rem] font-[500] text-left">Nome</label>
                    <div
                        class="flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
                        :class="nameBorderClass"
                    >
                        <div class="flex items-center w-full">                            
                            <input
                                v-model="formData.name"
                                placeholder="Por favor, insira seu nome"
                                class="flex-1 bg-transparent outline-none text-white text-[.85rem] placeholder:text-white/30"
                                @input="onNameInput"
                            />
                            <div
                                v-if="formData.name.length"
                                class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
                                @click="clearName"
                                aria-label="Limpar nome"
                            >
                                <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
                            </div>
                        </div>
                    </div>
                </div>
                
                <template v-if="selectedMethod === 'PHONE'">
                    <div class="mb-[.75rem]">
                        <label class="block text-white/40 text-[.75rem] font-[500] text-left">Telefone</label>
                        <div
                            class="flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
                            :class="phoneBorderClass"
                        >
                            <div class="flex items-center w-full">
                                <img class="mr-[.25rem] w-[1.25rem] h-[1.25rem] rounded-[100px]" src="/static/br.svg" alt="">
                                <span class="text-white text-[.875rem]">+55</span>
                                <span class="mx-[.8rem] w-[.0625rem] h-[1.25rem] bg-white/20"></span>
                                <input
                                    v-model="formData.phone"
                                    inputmode="numeric"
                                    maxlength="11"
                                    placeholder="Número"
                                    class="flex-1 bg-transparent outline-none text-white text-[.85rem] placeholder:text-white/30"
                                    @input="onPhoneInput"
                                />
                                <div
                                    v-if="formData.phone.length"
                                    class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
                                    @click="clearPhone"
                                    aria-label="Limpar telefone"
                                >
                                    <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="hasPhoneInput && formData.phone.length > 0 && !validPhone"
                            class="text-[#E84F46] mt-[.5rem] font-[400] text-[.75rem] flex items-center gap-[.375rem]"
                        >
                            <ion-icon name="alert-circle-outline"></ion-icon>
                            <span>Número de telefone inválido</span>
                        </div>
                    </div>
                </template>

                <template v-if="selectedMethod === 'EMAIL'">
                    <div class="mb-[.75rem]">
                        <label class="block text-white/40 text-[.75rem] font-[500] text-left">Email</label>
                        <div
                            class="flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
                            :class="emailBorderClass"
                        >
                            <div class="flex items-center w-full">
                                <ion-icon name="mail-outline" class="text-white/40 text-[1.4rem] mr-[.5rem]"></ion-icon>
                                <input
                                    v-model="formData.email"
                                    type="email"
                                    placeholder="exemplo@email.com"
                                    class="flex-1 bg-transparent outline-none text-white text-[.85rem] placeholder:text-white/30"
                                    @input="onEmailInput"
                                />
                                <div
                                    v-if="formData.email.length"
                                    class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
                                    @click="clearEmail"
                                    aria-label="Limpar email"
                                >
                                    <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
                                </div>
                            </div>
                        </div>
                        <div
                            v-if="hasEmailInput && formData.email.length > 0 && !validEmail"
                            class="text-[#E84F46] mt-[.5rem] font-[400] text-[.75rem] flex items-center gap-[.375rem]"
                        >
                            <ion-icon name="alert-circle-outline"></ion-icon>
                            <span>Email inválido</span>
                        </div>
                    </div>
                </template>

                <!-- CPF ID输入 -->
                <div class="mb-[.75rem]">
                    <label class="block text-white/40 text-[.75rem] font-[500] text-left">CPF ID</label>
                    <div
                        class="flex items-center justify-between rounded-[.375rem] h-[2.872rem] px-[.75rem] bg-[var(--color-tabbar-2)] border"
                        :class="cpfBorderClass"
                    >
                        <div class="flex items-center w-full">
                            <ion-icon name="card-outline" class="text-white/40 text-[1.4rem] mr-[.5rem]"></ion-icon>
                            <input
                                v-model="formData.cpfId"
                                inputmode="numeric"
                                maxlength="11"
                                placeholder="1"
                                class="flex-1 bg-transparent outline-none text-white text-[.85rem] placeholder:text-white/30"
                                @input="onCpfInput"
                            />
                            <div
                                v-if="formData.cpfId.length"
                                class="w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-[100px] bg-white/20 cursor-pointer ml-auto"
                                @click="clearCpf"
                                aria-label="Limpar CPF"
                            >
                                <ion-icon name="close-sharp" class="text-white text-[1rem]"></ion-icon>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="hasCpfInput && formData.cpfId.length > 0 && !validCpf"
                        class="text-[#E84F46] mt-[.5rem] font-[400] text-[.75rem] flex items-center gap-[.375rem]"
                    >
                        <ion-icon name="alert-circle-outline"></ion-icon>
                        <span>CPF inválido, por favor insira 11 dígitos</span>
                    </div>
                </div>
            </div>

            <div @click="handleDeposit"
                class="mt-[1.5rem] w-full h-[2.875rem] rounded-[.375rem] font-[700] text-[.875rem] flex items-center justify-center !bg-[var(--color-active)] cursor-pointer"
                :class="['text-white transition-all duration-200 ease-out', (loading || !canDeposit) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:brightness-110']">
                <span v-if="loading">Processando...</span>
                <span v-else>Retirar Agora</span>
            </div>
           
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const myMoney = ref(100);
// 金额选项数组
const amounts = ref([
    '20,00',
    '50,00',
    '100,00',
    '1.000,00',
    '5.000,00',
    '10.000,00',
    '30.000,00',
    '50.000,00',
])

// 提现方式选项
const withdrawMethods = ref([
  { id: 'CPF', label: 'CPF' },
  { id: 'PHONE', label: 'PHONE' },
  { id: 'EMAIL', label: 'EMAIL' }
])

// 当前选中的提现方式
const selectedMethod = ref<string>('CPF')

// 当前选中的金额
const selectedAmount = ref<string>('')

// 输入框的金额
const inputAmount = ref<string>('')

// 加载状态
const loading = ref<boolean>(false)

// 表单数据
const formData = ref({
    name: '',
    phone: '',
    cpfId: '',
    email: ''
})

// 表单验证状态
const hasNameInput = ref(false)
const hasPhoneInput = ref(false)
const hasCpfInput = ref(false)
const hasEmailInput = ref(false)

// 验证函数
const validPhone = computed(() => {
    return formData.value.phone.length === 11
})

const validCpf = computed(() => {
    return formData.value.cpfId.length === 11
})

const validEmail = computed(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(formData.value.email)
})

// 边框样式计算
const nameBorderClass = computed(() => {
    if (!hasNameInput.value || formData.value.name.trim() === '') return 'border-[var(--color-border-2)]'
    return formData.value.name.trim() ? 'border-[var(--color-success)]' : 'border-[#E84F46]'
})

const phoneBorderClass = computed(() => {
    if (!hasPhoneInput.value || formData.value.phone.length === 0) return 'border-[var(--color-border-2)]'
    return validPhone.value ? 'border-[var(--color-success)]' : 'border-[#E84F46]'
})

const cpfBorderClass = computed(() => {
    if (!hasCpfInput.value || formData.value.cpfId.length === 0) return 'border-[var(--color-border-2)]'
    return validCpf.value ? 'border-[var(--color-success)]' : 'border-[#E84F46]'
})

const emailBorderClass = computed(() => {
    if (!hasEmailInput.value || formData.value.email.length === 0) return 'border-[var(--color-border-2)]'
    return validEmail.value ? 'border-[var(--color-success)]' : 'border-[#E84F46]'
})

// 选择金额的方法
const selectAmount = (amount: string) => {
    selectedAmount.value = amount
    // 将选中的金额同步到输入框，去掉逗号和小数点后的00
    inputAmount.value = amount.replace(',', '').replace('.00', '')
}

// 输入框变化时的处理
const onInputChange = () => {
    // 清除选中状态，因为用户手动输入了
    selectedAmount.value = ''
}

// 设置最大金额
const setMaxAmount = () => {
  inputAmount.value = myMoney.value.toString()
  selectedAmount.value = ''
}

// 选择提现方式
const selectMethod = (methodId: string) => {
  selectedMethod.value = methodId
}

// 清空表单字段的函数
const clearName = () => {
    formData.value.name = ''
}

const clearPhone = () => {
    formData.value.phone = ''
}

const clearCpf = () => {
    formData.value.cpfId = ''
}

const clearEmail = () => {
    formData.value.email = ''
}

// 表单输入处理函数
const onNameInput = () => {
    hasNameInput.value = true
}

const onPhoneInput = () => {
    hasPhoneInput.value = true
    // 只允许数字输入
    formData.value.phone = formData.value.phone.replace(/\D/g, '')
}

const onCpfInput = () => {
    hasCpfInput.value = true
    // 只允许数字输入
    formData.value.cpfId = formData.value.cpfId.replace(/\D/g, '')
}

const onEmailInput = () => {
    hasEmailInput.value = true
}

// 表单验证
const isFormValid = computed(() => {
    const baseValid = formData.value.name.trim() !== ''
    
    if (selectedMethod.value === 'CPF') {
        return baseValid && validCpf.value
    } else if (selectedMethod.value === 'PHONE') {
        return baseValid && validPhone.value
    } else if (selectedMethod.value === 'EMAIL') {
        return baseValid && validEmail.value
    }
    
    return false
})

// 更新canDeposit计算，包含表单验证
const canDeposit = computed(() => {
    const amount = inputAmount.value
    return amount !== '' && 
           !loading.value && 
           parseFloat(amount) >= 5 && 
           isFormValid.value &&
           selectedMethod.value !== ''
})

// 处理存款
const handleDeposit = () => {
    if (!canDeposit.value) return

    loading.value = true
    // 这里可以添加存款逻辑
    const amount = inputAmount.value || selectedAmount.value
    console.log('存款金额:', amount)

    // 模拟API调用
    setTimeout(() => {
        loading.value = false
        // 存款成功后的处理
    }, 2000)
}
</script>

<style scoped></style>