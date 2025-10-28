<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <div class="p-[.75rem] bg-[var(--color-bg-aside-2)] rounded-[.625rem]">
        <div class="flex items-center">
            <p class="text-white text-[1.125rem] font-[600]">Depósito</p>
            <div class="w-[1.5rem] h-[1.5rem] bg-[var(--color-active)] flex items-center justify-center rounded-[100px] ml-[.625rem]">
                <ion-icon class="text-white w-[1rem] h-[1rem]" name="receipt-outline"></ion-icon>
            </div>
        </div>
        <p class="w-[18.75rem] text-white text-[.75rem] text-left leading-[1.125rem] mt-[1.25rem]">
            Se você tiver dúvidas ou problemas, entre em contato com o suporte ao cliente. Obrigado!
        </p>
        <div class="w-[18.75rem] text-[var(--color-highlight)] text-[.75rem] text-left leading-[1.125rem] mb-[1.85rem] flex items-center mt-[.05rem] font-[600]">
            <div class="w-[1.1rem] h-[1.1rem] bg-[var(--color-highlight)] hover:bg-[#fc974c] mr-[.25rem]" 
                style="-webkit-mask: url('/static/profile/customer.svg') no-repeat center / contain; mask: url('/static/profile/customer.svg') no-repeat center / contain;">
            </div>
            suporte online.
        </div>
        <div class="w-full h-[2.75rem] flex items-center justify-center rounded-[.315rem] bg-[var(--color-bg-aside)]  text-white text-[13px] font-[600] border-2 border-black/30 cursor-pointer hover:brightness-105">
            Depósito on-line 
        </div>
    </div>
    <div class="p-[.75rem]">
        <p class="text-white text-[.75rem] font-[700] text-left">Pagamento</p>
        <div class="mt-[.4375rem] h-[1.875rem] w-[4.3125rem] bg-[var(--color-bg-aside-2)] flex items-center justify-center rounded-[.315rem] border-1 border-[var(--color-border-1)] text-[var(--color-active)] font-[700] text-[.75rem] cursor-pointer hover:brightness-105">PIX-1</div>
        <p class="mt-[.75rem] text-white text-[.75rem] font-[700] text-left">Montante</p>
        <div class="flex items-center w-full rounded-[.315rem] overflow-hidden border border-[var(--color-border-2)] px-[.5rem] mt-[.4375rem] my-[1.75rem]">
            <span class="pr-[.5rem] text-[.85rem] h-[2.75rem] font-[700] text-[var(--color-warning)] flex items-center justify-center">R$</span>
            <input          
                v-model="inputAmount"
                @input="onInputChange"
                type="number"                    
                placeholder="5-50.000"          
                name="username"
                class="flex-1 bg-transparent outline-none text-white text-[.85rem] h-[2.75rem] font-[700]"          
            />                 
        </div>
        <p class="text-[.75rem] text-[var(--color-text-link)] font-[400] text-left ">
            Ocasionalmente, a 58ff oferece eventos ocultos exclusivos. Esteja atento às “promoções” todos os dias e não as perca.
        </p>

        <div class="flex flex-wrap gap-[.75rem] mt-[.75rem]">
            <div 
                v-for="amount in amounts" 
                :key="amount"
                @click="selectAmount(amount)"
                class="w-[calc(33.333%-0.5rem)] flex items-center justify-center rounded-[.315rem] h-[3rem] text-white text-[1rem] font-[700] cursor-pointer hover:brightness-105 transition-all duration-200"
                :class="selectedAmount === amount ? 
                    'border border-[var(--color-active)] [background:linear-gradient(180deg,rgba(0,0,0,0)_30.59%,var(--color-active)_110.34%),_var(--color-tabbar)]' : 
                    'bg-[var(--color-bg-aside)]'"
            >
                {{ amount }}
            </div>
        </div>

        <div
            @click="handleDeposit"
            class="mt-[1.5rem] w-full h-[2.875rem] rounded-[.375rem] font-[700] text-[.875rem] flex items-center justify-center !bg-[var(--color-active)] cursor-pointer"
            :class="[ 'text-white transition-all duration-200 ease-out', (loading || !canDeposit) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:brightness-110' ]"
            >            
            <span v-if="loading">Processando...</span>
            <span v-else>Depositar Agora</span>            
        </div>
    </div>
    <Tabbar></Tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import Tabbar from '../components/tabbar/Tabbar.vue'

// 金额选项数组
const amounts = ref([
  '10,00',
  '30,00', 
  '50,00',
  '100,00',
  '500,00',
  '1.000,00',
  '3.000,00',
  '5.000,00',
  '10.000,00'
])

// 当前选中的金额
const selectedAmount = ref<string>('')

// 输入框的金额
const inputAmount = ref<string>('')

// 加载状态
const loading = ref<boolean>(false)

// 计算是否可以存款
const canDeposit = computed(() => {
  const amount = inputAmount.value.trim()
  return amount !== '' && !loading.value && parseFloat(amount) >= 5
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

<style scoped>

</style>