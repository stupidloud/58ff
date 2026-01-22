<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Clube VIP'"></NavBar>
    <div class="p-[.6rem] px-[.2rem]">
      <p class="mt-[1rem] text-[.9rem] text-[var(--color-active)] text-center">Plataforma Global de Jogos Online</p>
      <div class="text-[.6rem] mt-[2rem]">
        <p class="mt-[1rem]  text-[var(--color-active)]">Plataforma Global de Jogos Online</p>
        <p class="mt-[1rem] !leading-[2] text-white"> A partir de hoje, o {{ siteName }} acumulará permanentemente e, após a atualização, você poderá receber os bônus promocionais correspondentes, bem como bônus semanais e mensais gratuitos. </p>
        <p class="!leading-[2] text-white"> Junte-se ao VIP e ganhe valor exclusivo de assinatura!</p>
        <p class="!leading-[2] text-white"> Atualizações diárias, reivindique recompensas a qualquer momento!</p>
        <p class="!leading-[2] text-white"> Aproveite experiências valiosas e para a vida toda!</p>
      </div>
      <div class="mt-[1rem] overflow-x-auto">
        <div class="flex border border-white">
          <div class="w-[10%] border-r border-white py-[.3rem] text-[0.5rem] text-[var(--color-active)] text-center whitespace-nowrap">
            {{ tableHeaders[0] }}
          </div>
          <div class="w-[15%] border-r border-white py-[.3rem] text-[0.5rem] text-[var(--color-active)] text-center whitespace-nowrap">
            {{ tableHeaders[1] }}
          </div>
          <div class="w-[15%] border-r border-white py-[.3rem] text-[0.5rem] text-[var(--color-active)] text-center whitespace-nowrap">
            {{ tableHeaders[2] }}
          </div>
          <div class="w-[20%] border-r border-white py-[.3rem] text-[0.5rem] text-[var(--color-active)] text-center whitespace-nowrap">
            {{ tableHeaders[3] }}
          </div>
          <div class="w-[20%] border-r border-white py-[.3rem] text-[0.5rem] text-[var(--color-active)] text-center whitespace-nowrap">
            {{ tableHeaders[4] }}
          </div>
          <div class="w-[20%] py-[.3rem] text-[var(--color-active)] text-[0.5rem] text-center whitespace-nowrap ">
            {{ tableHeaders[5] }}
          </div>
        </div>
        <div v-for="row in vipLevels" :key="row.nivel" class="flex transition-colors border-l border-r border-b border-white">
          <div class="w-[10%] border-r border-white py-[.3rem] text-white text-[0.65rem] text-center font-bold">
            {{ row.nivel }}
          </div>
          <div class="w-[15%] border-r border-white py-[.3rem] text-white text-[0.65rem] text-center">
            {{ row.deposito }}
          </div>
          <div class="w-[15%] border-r border-white py-[.3rem] text-white text-[0.65rem] text-center">
            {{ row.aposta }}
          </div>
          <div class="w-[20%] border-r border-white py-[.3rem] text-white text-[0.65rem] text-center">
            {{ row.bonusAtualizacao }}
          </div>
          <div class="w-[20%] border-r border-white py-[.3rem] text-white text-[0.65rem] text-center">
            {{ row.bonusSemanal }}
          </div>
          <div class="w-[20%] py-[.3rem] text-white text-[0.65rem] text-center">
            {{ row.bonusMensal }}
          </div>
        </div>
      </div>
      <div class="text-[.6rem] mt-[2rem]">
        <p class="!leading-[2] text-white"> Exemplo: A aposta efetiva total do membro é de 100.000, então o bônus de nível é de R$20, o bônus semanal é de R$3 e o bônus mensal é de R$10. </p>
        <div class="mt-[2rem]">
          <p class="!leading-[2] text-white"> Como Reivindicar Bônus Promocionais:</p>
          <p class="!leading-[2] text-white"> Após atualizar seu nível VIP, clique em Promoções → VIP → Reivindicação com um Clique (o período de reivindicação do prêmio é de 7 dias). Após o prazo, será considerado como saque. </p>
        </div>
        <div class="mt-[2rem]">
          <p class="!leading-[2] text-white"> Como Reivindicar Bônus Semanais:</p>
          <p class="!leading-[2] text-white"> Não é necessário registro. Os bônus são distribuídos em tempo real após 00:01 de toda segunda-feira. Clique em Promoções → VIP → Reivindicação com um Clique (o período de reivindicação é de 3 dias). O atraso é considerado como desistência. </p>
        </div>
        <div class="mt-[2rem]">
          <p class="!leading-[2] text-white"> Como Reivindicar Bônus Mensais:</p>
          <p class="!leading-[2] text-white"> Não é necessário registro. Após 00:01 do primeiro dia de cada mês, clique em Promoções → VIP → Reivindicação com um Clique (o período de reivindicação é de 3 dias). O atraso é considerado como desistência. </p>
        </div>
        <div class="mt-[2rem]">
          <p class="!leading-[2] text-[var(--color-active)]">Regra do Evento: </p>
          <p class="!leading-[2] text-white"> 1. Para sacar o bônus, você deve completar pelo menos uma rolagem. </p>
          <p class="!leading-[2] text-white"> 2. Reivindique os bônus promocionais/semanais/mensais dentro do período especificado; caso contrário, serão considerados como desistência. </p>
          <p class="!leading-[2] text-white"> 3. Este evento é limitado apenas às operações normais dos titulares de contas. Alugar contas, usar trapaças, bots, múltiplas contas, apostas mútuas, arbitragem, manipulação de interface, exploração de falhas, controle em grupo e outros meios técnicos são proibidos. Caso contrário, as recompensas serão canceladas ou deduzidas, as contas serão congeladas ou até mesmo incluídas na lista negra. </p>
          <p class="!leading-[2] text-white"> 4. A participação dos membros no evento é registrada automaticamente pelo sistema. Em caso de disputa, prevalecerão os resultados da investigação da plataforma. </p>
          <p class="!leading-[2] text-white"> 5. Se você esquecer sua conta/senha de membro, entre em contato com o 'atendimento ao cliente online 24 horas' para recuperar suas informações de conta. </p>
          <p class="!leading-[2] text-white"> 6. A plataforma reserva-se o direito de alterar, terminar ou cancelar esta promoção a qualquer momento. </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { vipApi } from '../../../services/api'

const siteName = ref(localStorage.getItem('site_name') || 'DTFL')
const tableHeaders = ref(['nível','Depósito','Aposta','Bônus de Atualização','Bônus Semanal','Bônus Mensal'])
interface VipLevelRow { nivel: number; deposito: string; aposta: string; bonusAtualizacao: string; bonusSemanal: string; bonusMensal: string }
const vipLevels = ref<VipLevelRow[]>([])
const formatCurrency = (amount:number) => {
  if (amount === 0 || amount === null || amount === undefined) return '–'
  return amount.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
const fetchVipRequirements = async () => {
  const response = await vipApi.getRequirements()
  if (response.code === 1) {
    vipLevels.value = response.data.levels.map(level => ({
      nivel: level.level,
      deposito: formatCurrency(level.deposit_requirement),
      aposta: formatCurrency(level.turnover_requirement),
      bonusAtualizacao: formatCurrency(level.level_up_bonus),
      bonusSemanal: formatCurrency(level.weekly_bonus),
      bonusMensal: formatCurrency(level.monthly_bonus)
    }))
  }
}
onMounted(() => { fetchVipRequirements() })
</script>

<style scoped></style>
