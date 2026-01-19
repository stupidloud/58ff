<template>
    <div class="h-screen flex flex-col">
        <CommonHeader moreText="Histórico" @more="showDepositHistory = true">
            Entrar
        </CommonHeader>
        <div class="dailyCheckIn flex-1">

            <div class="dailyCheckIn-content" style="margin-top: 0px;">
                <div class="dailyCheckIn-content-top">
                    <div class="dailyCheckIn-content-top-item">
                        <div>
                            <span class="key">Sessão iniciada </span>
                            <span class="value">{{ consecutiveDays }}</span>
                            <span class="key"> dias consecutivos</span>
                        </div>
                        <div>
                            <span class="key">Recarga de hoje </span>
                            <span class="value">{{ todayRecharge.toFixed(2) }} / {{ minDepositRequirement.toFixed(2) }}</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 奖励表格 -->
            <div class="dailyCheckIn-content" style="color: var(--color-text-tertiary);">
                <div class="table w-full">
                    <table border="0">
                        <thead>
                            <tr>
                                <th>Horas</th>
                                <th>Bônus</th>
                            </tr>
                        </thead>
                        <tbody class="zebra show-border">
                            <tr v-for="(bonus, index) in bonuses" :key="index">
                                <td class="td-left">{{ bonus.day }}</td>
                                <td class="td-right">{{ bonus.amount }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- 活动说明 -->
            <div class="dailyCheckIn-content intro">
                <div style="font-weight: 700;">Instruções Do Evento:</div>
                <div v-html="instructions"></div>
            </div>


        </div>
        <DepositHistoryModal :show="showDepositHistory" @close="showDepositHistory = false" />
    </div>
</template>

<script>
import { dailyCheckinApi, depositApi } from '../../services/api'
export default {
    name: "DailyCheckIn",
    data() {
        return {
            minDepositRequirement: 10,
            consecutiveDays: 0,
            todayRecharge: 0,
            bonuses: [
                { day: 'DIA 1', amount: 'R$ 1.00' },
                { day: 'DIA 2', amount: 'R$ 2.00' },
                { day: 'DIA 3', amount: 'R$ 3.00' },
                { day: 'DIA 4', amount: 'R$ 4.00' },
                { day: 'DIA 5', amount: 'R$ 4.50' },
                { day: 'DIA 6', amount: 'R$ 5.00' },
                { day: 'DIA 7', amount: 'R$ 6.00' },
                { day: 'Mais', amount: 'R$ 6.00' }
            ],
            instructions: `
        1. Os depósitos diários que atendem às condições do evento podem ser contabilizados para o registro diário.<br>
        2. Cada aposta recorde é limitada à plataforma atual. As recompensas devem ser atualizadas em até 10 minutos. Aguarde pela distribuição das recompensas<br>
        3. Este evento é uma atividade de entrada contínua. Se for interrompido durante o período, seu progresso será reiniciado a partir do dia 1;<br>
        4. As recompensas só podem ser resgatadas manualmente no APP/iOS, APP/Android ou PC/Windows. Recompensas não resgatadas serão invalidadas<br>
        5. Para sacar os bônus (excluindo o depósito original) deste evento, é necessário apostar 1.5 vez o valor do bônus (também conhecido como rollover, validação ou aposta válida). Pode apostar em qualquer jogo de slot na plataforma atual<br>
        6. Este evento é limitado a operações normais realizadas pelo titular da conta. É proibido alugar, usar plug-ins externos, bots, apostar com contas diferentes, troca de apostas, arbitragem, uso de interfaces, protocolos, exploração de vulnerabilidades, controle de grupo ou outros meios técnicos para participar. Caso contrário, as recompensas serão canceladas ou deduzidas, a conta será congelada ou até incluída na lista negra;<br>
        7. Para evitar diferenças de interpretação, a plataforma reserva-se o direito de interpretação final deste evento.
      `,
            canEnter: false
        };
    },
    mounted() {
        this.initCheckinInfo()
    },
    methods: {
        async initCheckinInfo() {
            try {
                const resp = await dailyCheckinApi.info()
                if (resp.code === 1 && resp.data) {
                    const bonuses = resp.data.daily_bonuses || []
                    const mapped = bonuses.map(b => ({
                        day: `DIA ${b.day}`,
                        amount: `R$ ${(b.bonus).toFixed(2)}`
                    }))
                    const lastBonus = bonuses.length > 0 ? bonuses[bonuses.length - 1].bonus : 0
                    this.bonuses = [...mapped, { day: 'Mais', amount: `R$ ${(lastBonus).toFixed(2)}` }]
                    this.minDepositRequirement = resp.data.min_deposit_requirement ?? this.minDepositRequirement
                }
                const dep = await depositApi.getHistory()
                if (dep.code === 1 && dep.data && Array.isArray(dep.data.deposits)) {
                    const successDates = new Set(
                        dep.data.deposits
                          .filter(d => d.payment_status === 1)
                          .map(d => (d.created_at || '').split(' ')[0])
                          .filter(Boolean)
                    )
                    const toDateStr = (d) => {
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
                    this.consecutiveDays = count
                    const todayKey = toDateStr(today)
                    this.todayRecharge = dep.data.deposits
                      .filter(d => d.payment_status === 1 && (d.created_at || '').split(' ')[0] === todayKey)
                      .reduce((sum, d) => sum + Number(d.amount || 0), 0)
                }
            } catch (e) {
                this.$toast && this.$toast.error('Falha ao carregar informações')
            }
        }
    }
};
</script>

<style scoped>
.dailyCheckIn {
    padding: .625rem .625rem;
    box-sizing: border-box;
    font-size: .875rem;
    max-width: 60rem;
    margin: 0 auto;
    overflow-x: hidden;
}

.dailyCheckIn .dailyCheckIn-content {
    margin-top: .85rem;
    padding: .85rem;
    box-sizing: border-box;
    background-color: var(--color-bg-main);
    border-radius: 1rem;
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-top .dailyCheckIn-content-top-item {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-top .dailyCheckIn-content-top-item div {
    max-width: calc(50% - .625rem);
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-bottom {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: .625rem;
    background-color: var(--color-bg-primary);
    border-radius: .625rem;
    padding: .625rem .625rem 0;
    box-sizing: border-box;
    gap: 3.5%;
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-bottom .dailyCheckIn-content-card {
    border: .0625rem solid var(--color-bg-opacity);
    background-color: var(--color-bg-primary);
    border-radius: .625rem;
    width: 22%;
    margin-bottom: .625rem;
    padding: .625rem .3125rem;
    box-sizing: border-box;
    text-align: center;
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-bottom .dailyCheckIn-content-card .card-title {
    color: var(--color-text-tertiary);
    font-size: 1rem;
    margin-bottom: .3125rem;
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-bottom .dailyCheckIn-content-card .card-img {
    border-bottom: .0625rem solid var(--color-bg-opacity);
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-bottom .dailyCheckIn-content-card .card-img img {
    width: 3.75rem;
}

.dailyCheckIn .dailyCheckIn-content .dailyCheckIn-content-bottom .dailyCheckIn-content-card .card-num {
    font-size: .875rem;
    margin-top: .625rem;
    margin-bottom: 0;
}

.dailyCheckIn .key {
    color: var(--color-text-tertiary);
    font-size: .875rem;
}

.dailyCheckIn .value {    
    font-size: .875rem;
}

.dailyCheckIn .value-yellow {
    color: var(--color-active) !important;
}

.dailyCheckIn .intro {
    color: var(--color-inactive);
    line-height: 2rem;
    font-size: .85rem;

}

.btn-box {
    width: 100%;
    height: fit-content;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 5;
    padding: .625rem;
    box-sizing: border-box;
    background: var(--color-bg-primary);
}

.btn-box .btn {
    width: 100%;
    height: 2.25rem;
    line-height: 2.25rem;
    text-align: center;
    font-size: .875rem;
    border-radius: .375rem;
    color: var(--color-text-tertiary);
    cursor: pointer;
}

.table {
    color: var(--color-text-tertiary);
    width: 100%;
    overflow-x: auto;
}

tr {
    background-color: var(--color-bg-aside);
}

.zebra tr {
    border-radius: 0.375rem;
}

.zebra tr:nth-child(odd) {
    background-color: var(--color-bg-main) !important;
}

.zebra tr:nth-child(even) {
    background-color: var(--color-bg-aside) !important;
}




table {
    width: 100%;
    border-collapse: collapse;
    border-radius: .375rem;
    border: none
}

th {
    border-bottom: .0625rem solid var(--color-bg-opacity) !important;
    border-top: .0625rem solid var(--color-bg-opacity) !important;
    font-size: 1.2rem;
    word-wrap: break-word;
    transition: background .3s ease;
    padding: 0;
    height: 3.75rem;
    color: var(--activity-name-color);
}

th:last-child {
    border-right: .0625rem solid var(--color-bg-opacity) !important;
    border-radius: 0 0.375rem 0.375rem 0
}

th:first-child {
    border-left: .0625rem solid var(--color-bg-opacity) !important;
    border-radius: 0.375rem 0 0 0.375rem
}

td {
    text-align: center !important;
    height: 3rem;
    font-size: 1rem
}

.td-left {
    text-align: left;
    padding-left: 1rem;
}

.td-right {
    text-align: right;
    padding-right: 1rem;
}
</style>
