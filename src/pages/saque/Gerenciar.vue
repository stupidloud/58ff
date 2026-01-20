<template>
  <div>
    <div class="rounded-[.5rem] bg-[var(--color-tabbar)] p-[.75rem]">
      <div class="flex items-center bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)] rounded-[.5rem] py-[.75rem] px-[.5rem]">
        <span class="text-white text-[.95rem]">Conta para recebimento</span>
        <span class="text-[var(--color-highlight)] text-[.95rem] ml-[.25rem]">({{ accounts.length }}/1)</span>
        <div class="ml-auto text-white/60 text-[.9rem]">PIX</div>
      </div>
    </div>

    <div class="p-[.5rem]">
      <div v-if="accounts.length > 0" class="space-y-[.5rem]">
        <div v-for="acc in accounts" :key="acc.id" class="bg-[var(--color-tabbar)] border border-[var(--color-border-1)] rounded-[.5rem] p-[.75rem]">
          <div class="flex items-center justify-between mb-[.25rem]">
            <span class="text-white text-[.95rem] font-[600]">{{ acc.account_name }}</span>
            <span class="text-[var(--color-active)] text-[.85rem] uppercase">{{ acc.pix_type }}</span>
          </div>
          <div class="text-white/70 text-[.85rem] text-left">PIX: {{ maskSensitive(acc.pix_number) }}</div>
          <div v-if="acc.cpf" class="text-white/70 text-[.85rem] text-left">CPF: {{ maskSensitive(acc.cpf) }}</div>
        </div>
      </div>

      <div v-else class="fixed bottom-[4.5rem] left-0 right-0 mx-auto max-w-[516px] p-[.75rem]">
        <div class="px-[.5rem] flex items-center h-[4rem] w-full rounded-[.5rem] bg-[var(--color-tabbar)] border border-[var(--color-border-1)] cursor-pointer" @click="openPasswordModal">
          <img src="/static/payment_method.png" class="w-[3rem] h-[3rem]" alt="">
          <span class="text-[1.1rem] ml-[1rem] text-white/80">PIX</span>
          <span class="ml-auto mr-[.5rem] text-[1.1rem] text-[var(--color-active)]">Adicionar</span>
        </div>
      </div>
    </div>

    <div v-if="setPassShow" class="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-[1rem]">
      <div class="max-w-[465px] w-full bg-[var(--color-tabbar)] border border-[var(--color-border-1)] rounded-[1rem] p-[1rem]">
        <p class="text-white text-[1.2rem] text-center mb-[.75rem]">Inserir Senha</p>
        <div class="mb-[1rem]">
          <div class="flex items-center justify-between mb-[.6rem]">
            <span class="text-white text-[.85rem]">Senha de Saque</span>
            <ion-icon
              :name="showPwd ? 'eye-off-outline' : 'eye-outline'"
              class="text-white/70 text-[1.2rem] cursor-pointer"
              @click="showPwd = !showPwd"
            ></ion-icon>
          </div>
          <div class="relative">
            <div class="flex items-center justify-between gap-[.4rem]" @click="focusPwdInput">
              <div
                v-for="i in 6"
                :key="i"
                class="w-[2.5rem] h-[2.5rem] rounded-[.375rem] bg-[var(--color-tabbar-2)] border border-[var(--color-border-1)] flex items-center justify-center"
              >
                <span class="text-white text-[1.2rem] font-[700]">
                  {{ showPwd ? (withdrawPassword[i-1] || '') : (withdrawPassword[i-1] ? '•' : '') }}
                </span>
              </div>
            </div>
            <input
              ref="pwdInputRef"
              :value="withdrawPassword"
              @input="onPwdInput"
              type="tel"
              inputmode="numeric"
              maxlength="6"
              class="absolute inset-0 opacity-0"
            />
          </div>
        </div>
        <div class="flex items-center justify-between my-[1rem]">
          <span class="text-white/80 text-[.9rem] text-left">Para a segurança da sua conta, introduza a senha de saque</span>
          <span class="text-[var(--color-active)] text-[.9rem]">Esqueceu a senha?</span>
        </div>
        <button
          class="w-full h-[3rem] rounded-[.5rem] !bg-[var(--color-active)] text-white text-[1rem]"
          :disabled="loading"
          :class="loading ? 'opacity-70 cursor-not-allowed' : ''"
          @click="verifyWithdrawPassword"
        >
          {{ loading ? 'Verificando...' : 'Próximo' }}
        </button>
        <div class="flex justify-center mt-[.75rem]">
          <ion-icon name="close-circle-outline" class="text-white/60 text-[1.6rem] cursor-pointer" @click="setPassShow=false"></ion-icon>
        </div>
      </div>
    </div>

    <div v-if="showPixModal" class="fixed inset-0 z-[1000] bg-black/50 flex items-center justify-center p-[1rem]">
      <div class="max-w-[465px] w-full bg-[var(--color-tabbar)] border border-[var(--color-border-1)] rounded-[1rem] p-[1rem]">
        <p class="text-white text-[1.2rem] text-center mb-[.75rem]">Adicionar PIX</p>
        <div class="space-y-[.75rem]">
          <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
            <input
              v-model="accountForm.name"
              class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
              placeholder="Por favor, insira o nome"
              type="text"
            />
          </div>
          <div class="relative">
            <div
              class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)] cursor-pointer"
              @click="showCpfDropdown=!showCpfDropdown"
            >
              <span class="text-white/70">{{ selectedCpfType || 'CPF' }}</span>
              <ion-icon name="chevron-down-outline" class="text-white/60 ml-auto"></ion-icon>
            </div>
            <div v-if="showCpfDropdown" class="absolute z-[1001] left-0 right-0 bg-[var(--color-tabbar)] border border-[var(--color-border-1)] rounded-[.5rem] mt-[.25rem]">
              <div
                v-for="opt in cpfOptions"
                :key="opt.value"
                class="px-[.75rem] py-[.5rem] cursor-pointer text-white/80 hover:!text-white hover:!bg-[var(--color-active)]"
                @click="selectCpfType(opt.value)"
              >
                {{ opt.label }}
              </div>
            </div>
          </div>
          <div v-if="selectedCpfType==='CPF'" class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
            <input
              :value="accountForm.cpf"
              @input="onDigitsInput($event,'cpf',11)"
              class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
              placeholder="Por favor, insira o número de CPF de 11 dígitos"
              inputmode="numeric"
            />
          </div>
          <div v-if="selectedCpfType==='CNPJ'" class="space-y-[.75rem]">
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                v-model="accountForm.cnpj"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira a conta PIX"
                type="text"
              />
            </div>
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                :value="accountForm.cpf"
                @input="onDigitsInput($event,'cpf',11)"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira o número de CPF de 11 dígitos"
                inputmode="numeric"
              />
            </div>
          </div>
          <div v-if="selectedCpfType==='PHONE'" class="space-y-[.75rem]">
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                :value="accountForm.phone"
                @input="onDigitsInput($event,'phone',11)"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira o número de telefone (11 dígitos)"
                inputmode="numeric"
              />
            </div>
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                :value="accountForm.cpf"
                @input="onDigitsInput($event,'cpf',11)"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira o número de CPF de 11 dígitos"
                inputmode="numeric"
              />
            </div>
          </div>
          <div v-if="selectedCpfType==='EMAIL'" class="space-y-[.75rem]">
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                v-model="accountForm.email"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira a conta PIX"
                type="email"
              />
            </div>
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                :value="accountForm.cpf"
                @input="onDigitsInput($event,'cpf',11)"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira o número de CPF de 11 dígitos"
                inputmode="numeric"
              />
            </div>
          </div>
          <div v-if="selectedCpfType==='EVP'" class="space-y-[.75rem]">
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                v-model="accountForm.evp"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira a conta PIX"
                type="text"
              />
            </div>
            <div class="flex items-center h-[2.75rem] px-[.75rem] rounded-[.5rem] bg-transparent border border-[var(--color-border-1)]">
              <input
                :value="accountForm.cpf"
                @input="onDigitsInput($event,'cpf',11)"
                class="flex-1 bg-transparent text-white placeholder:text-white/40 outline-none"
                placeholder="Por favor, insira o número de CPF de 11 dígitos"
                inputmode="numeric"
              />
            </div>
          </div>
          <p class="text-white text-[.85rem] my-[.75rem] text-left">Apenas 1 conta PIX do tipo PIX-CPF pode ser adicionada</p>
          <button
            class="w-full h-[3rem] rounded-[.5rem] !bg-[var(--color-active)] text-white text-[1rem]"
            :disabled="loading"
            :class="loading ? 'opacity-70 cursor-not-allowed' : ''"
            @click="confirmAddAccount"
          >
            {{ loading ? 'Processando...' : 'Confirmar' }}
          </button>
          <div class="flex justify-center mt-[.75rem]">
            <ion-icon name="close-circle-outline" class="text-white/60 text-[1.6rem] cursor-pointer" @click="showPixModal=false"></ion-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { playerApi, type WithdrawAccount } from '../../services/api'
import { showToast } from '../../components/toast/service'

const router = useRouter()
const accounts = ref<WithdrawAccount[]>([])
const setPassShow = ref(false)
const showPixModal = ref(false)
const withdrawPassword = ref('')
const loading = ref(false)
const showPwd = ref(false)
const pwdInputRef = ref<HTMLInputElement | null>(null)
const showCpfDropdown = ref(false)
const selectedCpfType = ref('CPF')
const cpfOptions = [
  { label: 'CPF', value: 'CPF' },
  { label: 'PHONE', value: 'PHONE' },
  { label: 'EMAIL', value: 'EMAIL' },
  { label: 'EVP', value: 'EVP' },
  { label: 'CNPJ', value: 'CNPJ' }
]
const accountForm = ref({ name: '', cpf: '', cnpj: '', phone: '', email: '', evp: '' })

const maskSensitive = (v: string) => {
  if (!v) return ''
  const len = v.length
  if (len <= 4) return '*'.repeat(len)
  return v.slice(0, 2) + '*'.repeat(Math.max(0, len - 4)) + v.slice(len - 2)
}

const load = async () => {
  try {
    const res = await playerApi.getWithdrawAccounts()
    if (res.code === 1) {
      accounts.value = (res.data as any).accounts || []
    }
  } catch {}
}

const openPasswordModal = () => {
  setPassShow.value = true
}
const focusPwdInput = () => {
  pwdInputRef.value?.focus()
}
const onPwdInput = (e: Event) => {
  const t = e.target as HTMLInputElement
  const val = (t.value || '').replace(/\D/g, '').slice(0, 6)
  withdrawPassword.value = val
  t.value = val
}
const verifyWithdrawPassword = async () => {
  if (loading.value) return
  if (withdrawPassword.value.length !== 6 || !/^\d{6}$/.test(withdrawPassword.value)) {
    showToast('A senha de saque deve ter 6 dígitos')
    return
  }
  try {
    loading.value = true
    const resp = await playerApi.verifyWithdrawPassword(withdrawPassword.value)
    if (resp.code === 1 && (resp.data as any)?.verified) {
      setPassShow.value = false
      showPixModal.value = true
      withdrawPassword.value = ''
      showToast('Senha verificada com sucesso!')
    } else {
      showToast(resp.msg || 'Senha de saque incorreta')
    }
  } catch (e: any) {
    showToast(e?.message || 'Erro ao verificar senha de saque')
  } finally {
    loading.value = false
  }
}
const selectCpfType = (v: string) => {
  selectedCpfType.value = v
  showCpfDropdown.value = false
  accountForm.value.cpf = ''
  accountForm.value.phone = ''
  accountForm.value.email = ''
  accountForm.value.evp = ''
  accountForm.value.cnpj = ''
}
const onDigitsInput = (e: Event, key: 'cpf' | 'phone', max: number) => {
  const t = e.target as HTMLInputElement
  const val = (t.value || '').replace(/\D/g, '').slice(0, max)
  accountForm.value[key] = val
  t.value = val
}
const confirmAddAccount = async () => {
  if (loading.value) return
  const nameOk = accountForm.value.name.trim().length > 0
  if (!nameOk) { showToast('Por favor, insira o nome'); return }
  let pix_number = ''
  let cpf: string | undefined = undefined
  if (selectedCpfType.value === 'CPF') {
    if (!accountForm.value.cpf) { showToast('Por favor, insira o número de CPF de 11 dígitos'); return }
    pix_number = accountForm.value.cpf.trim()
    cpf = accountForm.value.cpf.trim()
  } else if (selectedCpfType.value === 'CNPJ') {
    if (!accountForm.value.cnpj) { showToast('Por favor, insira a conta PIX'); return }
    if (!accountForm.value.cpf) { showToast('Por favor, insira o número de CPF de 11 dígitos'); return }
    pix_number = accountForm.value.cnpj.trim()
    cpf = accountForm.value.cpf.trim()
  } else if (selectedCpfType.value === 'PHONE') {
    if (!accountForm.value.phone || accountForm.value.phone.length !== 11) { showToast('Número de telefone deve ter exatamente 11 dígitos'); return }
    if (!accountForm.value.cpf) { showToast('Por favor, insira o número de CPF de 11 dígitos'); return }
    pix_number = accountForm.value.phone.trim()
    cpf = accountForm.value.cpf.trim()
  } else if (selectedCpfType.value === 'EMAIL') {
    if (!accountForm.value.email) { showToast('Por favor, insira a conta PIX'); return }
    if (!accountForm.value.cpf) { showToast('Por favor, insira o número de CPF de 11 dígitos'); return }
    pix_number = accountForm.value.email.trim()
    cpf = accountForm.value.cpf.trim()
  } else if (selectedCpfType.value === 'EVP') {
    if (!accountForm.value.evp) { showToast('Por favor, insira a conta PIX'); return }
    if (!accountForm.value.cpf) { showToast('Por favor, insira o número de CPF de 11 dígitos'); return }
    pix_number = accountForm.value.evp.trim()
    cpf = accountForm.value.cpf.trim()
  }
  try {
    loading.value = true
    const resp = await playerApi.setWithdrawAccount({
      pix_type: selectedCpfType.value.toLowerCase(),
      pix_number,
      account_name: accountForm.value.name.trim(),
      cpf
    })
    if (resp.code === 1) {
      showToast('Conta PIX adicionada com sucesso!')
      showPixModal.value = false
      accountForm.value = { name: '', cpf: '', cnpj: '', phone: '', email: '', evp: '' }
      await load()
    } else {
      showToast(resp.msg || 'Erro ao adicionar conta PIX')
    }
  } catch (e: any) {
    showToast(e?.message || 'Erro ao adicionar conta PIX')
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>

<style scoped></style>
