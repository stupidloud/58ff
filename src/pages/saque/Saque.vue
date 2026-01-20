<template>
  <div>
    <div class="rounded-[.5rem] bg-[var(--color-tabbar)] p-[.75rem]">
      <div class="flex items-center">
        <span class="text-white/80 text-[.9rem]">Saldo</span>
        <span class="text-[var(--color-warning)] font-[700] ml-[.5rem]">{{ formatCurrency(balance) }}</span>
        <ion-icon
          name="refresh"
          class="text-[var(--color-active)] text-[1rem] ml-[.5rem] cursor-pointer"
          :class="{ 'opacity-50 pointer-events-none': refreshing }"
          @click="refreshBalance"
        />
      </div>
      <div class="mt-[.75rem]">
        <div class="text-white/70 text-[.8rem] mb-[.65rem] text-left">Requisitos de Apostas{{ progressPercent }}%</div>
        <div class="w-full h-[.5rem] rounded-[.25rem] !bg-[var(--color-bg-aside)] overflow-hidden mb-[.2rem]">
          <div class="h-full !bg-[var(--color-active)]" :style="{ width: progressPercent + '%' }" />
        </div>        
      </div>
    </div>

    <div class="rounded-[.5rem] bg-[var(--color-tabbar)] p-[.75rem] mt-[.75rem]">
      <div class="text-white text-[.9rem] font-[700] mb-[.5rem]">Conta de Saque</div>
      <div v-if="currentAccount" class="flex items-center h-[3rem] px-[.5rem] rounded-[.375rem] bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)]">
        <img src="/static/payment_method.png" class="w-[1.6rem] h-[1.6rem]" alt="">
        <div class="ml-[.5rem] flex-1">
          <div class="text-white text-[.85rem] font-[600] text-left">{{ currentAccount.account_name }}</div>
          <div class="text-white/60 text-[.75rem] text-left">{{ currentAccount.pix_type.toUpperCase() }}: {{ maskPix(currentAccount.pix_number) }}</div>
        </div>
      </div>
      <div v-else class="flex items-center h-[3rem] px-[.5rem] rounded-[.375rem] bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)] cursor-pointer" @click="goManageAccount">
        <img src="/static/payment_method.png" class="w-[1.6rem] h-[1.6rem]" alt="">
        <div class="ml-[.5rem] text-[var(--color-highlight)] text-[.85rem]">Adicionar Conta</div>
        <div class="ml-auto text-[var(--color-active)] text-[1rem]">+</div>
      </div>
    </div>

    <div class="rounded-[.5rem] bg-[var(--color-tabbar)] p-[.75rem] mt-[.75rem]">
      <div class="flex items-center h-[3rem] px-[.5rem] rounded-[.375rem] bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)]">
        <span class="text-[var(--color-warning)] font-[700] mr-[.5rem]">R$</span>
        <input
          v-model="amount"
          type="tel"
          inputmode="numeric"
          class="flex-1 bg-transparent outline-none text-white text-[.9rem]"
          placeholder="Por favor, insira o valor do saque"
        />
        <p class="ml-[.5rem] px-[.5rem] rounded-[.375rem] !bg-[var(--color-bg-aside)] text-white/80" @click="setTudo">Tudo</p>
      </div>
      <div class="mt-[1rem]">
        <div class="text-white text-[.85rem] mb-[.25rem]">Senha de Saque</div>
        <input
          v-model="withdrawPassword"
          type="password"
          inputmode="numeric"
          maxlength="6"
          class="w-full h-[2.5rem] rounded-[.375rem] bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)] px-[.5rem] text-white"
          placeholder="6 dígitos"
        />
      </div>
      <div class="mt-[1rem]">
        <button
          class="w-full h-[2.75rem] rounded-[.375rem] !bg-[var(--color-active)] text-white font-[700]"
          :class="withdrawing ? 'opacity-70 cursor-not-allowed' : ''"
          :disabled="withdrawing"
          @click="submitWithdraw"
        >
          {{ withdrawing ? 'Processando...' : 'Confirmar' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { playerApi, withdrawApi, type WithdrawAccount } from '../../services/api'
import { showToast } from '../../components/toast/service'

const emit = defineEmits<{ (e: 'switch-to-gerenciar'): void; (e: 'switch-to-registro'): void }>()

const router = useRouter()
const auth = useAuthStore()

const balance = computed(() => auth.balance)
const required = computed(() => auth.user?.required_betting_amount || 0)
const completed = computed(() => auth.user?.completed_betting_amount || 0)
const progressPercent = computed(() => {
  if (required.value <= 0) return 0
  return Math.min(100, Math.round((completed.value / required.value) * 100))
})

const refreshing = ref(false)
const refreshBalance = async () => {
  if (refreshing.value) return
  refreshing.value = true
  try {
    const res = await playerApi.getBalance()
    if (res.code === 1) {
      await auth.updateBalance(res.data.balance)
    } else {
      showToast(res.msg || 'Falha ao atualizar saldo')
    }
  } catch (e: any) {
    showToast(e?.message || 'Falha ao atualizar saldo')
  } finally {
    refreshing.value = false
  }
}

const accounts = ref<WithdrawAccount[]>([])
const currentAccount = computed(() => (accounts.value.length > 0 ? accounts.value[0] : null))
const fetchAccounts = async () => {
  try {
    const res = await playerApi.getWithdrawAccounts()
    if (res.code === 1) {
      accounts.value = (res.data as any).accounts || []
    }
  } catch {}
}

const goManageAccount = () => {
  emit('switch-to-gerenciar')
}

const amount = ref('')
const withdrawPassword = ref('')
const setTudo = async () => {
  await refreshBalance()
  amount.value = Math.floor(balance.value || 0).toString()
}

const maskPix = (v: string) => {
  if (!v) return ''
  const len = v.length
  if (len <= 4) return '*'.repeat(len)
  return v.slice(0, 2) + '*'.repeat(Math.max(0, len - 4)) + v.slice(len - 2)
}

const formatCurrency = (val: number) => {
  try {
    return new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val || 0)
  } catch {
    return String(val || 0)
  }
}

const withdrawing = ref(false)
const submitWithdraw = async () => {
  if (withdrawing.value) return
  const digits = amount.value.replace(/\D/g, '')
  if (!digits || isNaN(Number(digits)) || Number(digits) <= 0) {
    showToast('O valor do saque deve ser maior que zero')
    return
  }
  if (withdrawPassword.value.length !== 6 || !/^\d{6}$/.test(withdrawPassword.value)) {
    showToast('A senha de saque deve ter 6 dígitos')
    return
  }
  if (required.value > 0 && completed.value < required.value) {
    showToast('Requisitos de apostas não atendidos')
    return
  }
  try {
    withdrawing.value = true
    const res = await withdrawApi.create(Number(digits), withdrawPassword.value)
    if (res.code === 1) {
      const status = (res.data as any)?.status
      if (status === 'auto_approved') showToast('Solicitação de saque aprovada automaticamente e está sendo processada!')
      else if (status === 'pending') showToast('Solicitação de saque enviada com sucesso, aguardando aprovação!')
      else if (status === 'completed') showToast('Saque realizado com sucesso!')
      else showToast('Solicitação de saque enviada com sucesso!')
      amount.value = ''
      withdrawPassword.value = ''
      await refreshBalance()
      emit('switch-to-registro')
    } else {
      showToast(res.msg || 'Erro ao processar saque')
    }
  } catch (e: any) {
    showToast(e?.message || 'Erro ao processar saque, tente novamente')
  } finally {
    withdrawing.value = false
  }
}

onMounted(fetchAccounts)
</script>

<style scoped></style>
