<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Entrar'"></NavBar>
    <div class="p-[.6rem] px-[.2rem]">
      <div class="rounded-[.75rem] bg-[var(--color-bg-aside-2)] p-[.75rem]">
        <div class="flex items-center justify-between">
          <div class="text-white text-[.7rem]">
            <div>
              <span class="text-[var(--color-text-link)]">Sessão iniciada </span>
              <span class="text-[var(--color-active)] font-[700]">{{ consecutiveDays }}</span>
              <span class="text-[var(--color-text-link)]"> dias consecutivos</span>
            </div>
            <div class="mt-[.25rem]">
              <span class="text-[var(--color-text-link)]">Recarga de hoje </span>
              <span class="text-[var(--color-active)] font-[700]">{{ todayRecharge.toFixed(2) }} / {{ minDepositRequirement.toFixed(2) }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-[.75rem] rounded-[.75rem] bg-[var(--color-tabbar)] p-[.75rem]">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="h-[2.5rem]">
                <th class="text-[.7rem] text-[var(--color-active)] border-b border-[var(--color-border-2)]">Horas</th>
                <th class="text-[.7rem] text-[var(--color-active)] border-b border-[var(--color-border-2)]">Bônus</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(bonus, index) in bonuses" :key="index" class="h-[2.25rem]" :class="index % 2 === 0 ? 'bg-[var(--color-bg-main)]' : 'bg-[var(--color-bg-aside)]'">
                <td class="text-left px-[.75rem] text-white text-[.7rem]">{{ bonus.day }}</td>
                <td class="text-right px-[.75rem] text-white text-[.7rem]">{{ bonus.amount }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="mt-[.75rem] rounded-[.75rem] bg-[var(--color-bg-aside-2)] p-[.75rem]">
        <p class="text-white font-[700] text-[.75rem] mb-[.5rem]">Instruções Do Evento:</p>
        <div class="text-[.65rem] text-white/80 leading-[1.6]">
          <p>1. Os depósitos diários que atendem às condições do evento podem ser contabilizados para o registro diário.</p>
          <p>2. As recompensas são atualizadas em até 10 minutos após a aposta. Aguarde a distribuição.</p>
          <p>3. Esta é uma atividade contínua; interrupções reiniciam o progresso a partir do dia 1.</p>
          <p>4. As recompensas devem ser resgatadas manualmente; recompensas não resgatadas serão invalidadas.</p>
          <p>5. Para sacar os bônus, é necessário apostar 1.5 vezes o valor do bônus.</p>
          <p>6. Operações anormais (bots, arbitragem, exploração de falhas etc.) resultarão em cancelamento das recompensas e possíveis sanções.</p>
          <p>7. A plataforma reserva-se o direito de interpretação final deste evento.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { dailyCheckinApi, depositApi } from '../../../services/api'

const minDepositRequirement = ref(10)
const consecutiveDays = ref(0)
const todayRecharge = ref(0)
const bonuses = ref<Array<{ day: string; amount: string }>>([])

async function initCheckinInfo() {
  try {
    const resp = await dailyCheckinApi.info()
    if (resp.code === 1 && resp.data) {
      const list = resp.data.daily_bonuses || []
      const mapped = list.map(b => ({
        day: `DIA ${b.day}`,
        amount: `R$ ${Number(b.bonus).toFixed(2)}`
      }))
      const lastBonus = list.length > 0 ? list[list.length - 1].bonus : 0
      bonuses.value = [...mapped, { day: 'Mais', amount: `R$ ${Number(lastBonus).toFixed(2)}` }]
      minDepositRequirement.value = resp.data.min_deposit_requirement ?? minDepositRequirement.value
    }
    const dep = await depositApi.getHistory()
    if (dep.code === 1 && dep.data && Array.isArray(dep.data.deposits)) {
      const successDates = new Set<string>(
        dep.data.deposits
          .filter(d => d.payment_status === 1)
          .map(d => (d.created_at || '').split(' ')[0])
          .filter(Boolean)
      )
      const toDateStr = (d: Date) => {
        const y = d.getFullYear()
        const m = String(d.getMonth() + 1).padStart(2, '0')
        const day = String(d.getDate()).padStart(2, '0')
        return `${y}-${m}-${day}`
      }
      const today = new Date()
      let count = 0
      for (let i = 0; i < 365; i++) {
        const dt = new Date(today)
        dt.setDate(today.getDate() - i)
        const key = toDateStr(dt)
        if (successDates.has(key)) {
          count++
        } else {
          break
        }
      }
      consecutiveDays.value = count
      const todayKey = toDateStr(today)
      todayRecharge.value = dep.data.deposits
        .filter(d => d.payment_status === 1 && (d.created_at || '').split(' ')[0] === todayKey)
        .reduce((sum, d) => sum + Number(d.amount || 0), 0)
    }
  } catch (e) {}
}

onMounted(() => {
  initCheckinInfo()
})
</script>

<style scoped></style>
