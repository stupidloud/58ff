<template>
  <div class="event">
    <div class="event-r">
      <div class="event-r-list">

        <!-- 每日充值签到 -->
        <div class="DailyRechargeCheckIn box-bg-border">
          <div class="DailyRechargeCheckIn_top">
            <div class="DailyRechargeCheckIn_top_text">
              <div class="DailyRechargeCheckIn_top_title">Depósito + 60%</div>
              <div>Recarregue todos os dias e receba bônus todos os dias!</div>
            </div>
            <img
              :src="getConstantAssetUrl('/recharge/calendar.png')"
              alt=""
            />
          </div>

          <div class="DailyRechargeCheckIn_box">
            <div class="DailyRechargeCheckIn_box_title">
              Já foi contactado para o check-in por
              <span>{{ consecutiveDays }}</span>
              dias consecutivos
            </div>

            <div class="DailyRechargeCheckIn_box_list">
              <div
                v-for="(item, index) in rewardList"
                :key="index"
                class="DailyRechargeCheckIn_box_item"
                :class="{ DailyRechargeCheckIn_box_item_border_color1: index < activeCount }"
              >
                <div
                  class="DailyRechargeCheckIn_box_item_num"
                  :class="{ DailyRechargeCheckIn_box_item_num_active: index < activeCount }"
                >
                  {{ item.day }}
                </div>
                <img
                  :src="getConstantAssetUrl('/recharge/jinbi.png')"
                  class="img_default"
                />
                <div
                  class="amount_text"
                  :class="{ amount_text_active: index < activeCount }"
                >
                  +{{ item.amount }}
                </div>
              </div>
            </div>

            <div
              class="DailyRechargeCheckIn_btn1"
              :class="{ DailyRechargeCheckIn_btn_allowed: !canSign }"
              @click="handleSign"
            >
              {{ isAuthenticated ? 'Receber recompensa' : 'Entrar' }}
            </div>

            <div class="DailyRechargeCheckIn_btn2" @click="showDetail">
              Detalhes
            </div>
          </div>
        </div>

        <!-- 活动卡片 -->
        <div
          v-for="(img, index) in cardList"
          :key="index"
          class="event-r-card pc-box-style"
        >
          <img :src="img" alt="" />
        </div>

      </div>
    </div>
  </div>
</template>
<script>
import { dailyCheckinApi, depositApi } from '../../services/api'
import { eventBus } from '../../utils/eventBus'
import { getConstantAssetUrl } from '../../utils/assets'
export default {
  name: 'Event',
  data() {
    return {
      consecutiveDays: 0,
      canSign: false,
      rewardList: [],
      minDepositRequirement: 10,
      cardList: [
        '/variant/banner1.jpg',
        '/variant/banner2.jpg',
        '/variant/banner3.jpg',
        '/variant/banner4.jpg',
        '/variant/banner5.jpg',
      ]
    }
  },
  computed: {
    isAuthenticated() {
      return this.$store.getters['auth/isAuthenticated']
    },
    activeIndex() {
      const total = this.rewardList.length
      if (total === 0) return -1
      const hasMore = this.rewardList[total - 1]?.day === 'Mais'
      const actualLen = hasMore ? total - 1 : total
      const idx = this.consecutiveDays - 1
      if (idx < 0) return -1
      return Math.min(idx, Math.max(actualLen - 1, 0))
    },
    activeCount() {
      const total = this.rewardList.length
      if (total === 0) return 0
      const hasMore = this.rewardList[total - 1]?.day === 'Mais'
      const actualLen = hasMore ? total - 1 : total
      if (this.consecutiveDays <= 0) return 0
      return Math.min(this.consecutiveDays, Math.max(actualLen, 0))
    }
  },
  mounted() {    
    this.initCheckinInfo()
    this.canSign = this.isAuthenticated
  },
  methods: {
    getConstantAssetUrl,
    async initCheckinInfo() {
      try {
        const resp = await dailyCheckinApi.info()
        
        if (resp.code === 1 && resp.data) {
          const bonuses = resp.data.daily_bonuses || []
          const mapped = bonuses.map(b => ({
            day: `Dia ${b.day}`,
            amount: (b.bonus).toFixed(2)
          }))
          const lastBonus = bonuses.length > 0 ? bonuses[bonuses.length - 1].bonus : 0
          this.rewardList = [...mapped, { day: 'Mais', amount: (lastBonus).toFixed(2) }]
          this.minDepositRequirement = resp.data.min_deposit_requirement ?? this.minDepositRequirement
        }
        
        const dep = await depositApi.getHistory()
        
        if (dep.code === 1 && dep.data && Array.isArray(dep.data.deposits)) {
          // 构建按日期分组的充值金额记录
          const depositByDate = new Map()
          dep.data.deposits
            .filter(d => d.payment_status === 1)
            .forEach(d => {
              const dateStr = (d.created_at || '').split(' ')[0]
              if (dateStr) {
                const prevAmount = depositByDate.get(dateStr) || 0
                depositByDate.set(dateStr, prevAmount + (d.amount || 0))
              }
            })
          
          const toDateStr = (d) => {
            const y = d.getFullYear()
            const m = String(d.getMonth() + 1).padStart(2, '0')
            const day = String(d.getDate()).padStart(2, '0')
            return `${y}-${m}-${day}`
          }
          const today = new Date()
          
          let count = 0
          // 最多检查8天（与后端保持一致）
          for (let i = 0; i < 8; i++) {
            const dt = new Date(today)
            dt.setDate(today.getDate() - i)
            const key = toDateStr(dt)
            const dayAmount = depositByDate.get(key) || 0
            
            // 检查该天充值金额是否达标
            if (dayAmount >= this.minDepositRequirement) {
              count++
            } else {
              break
            }
          }
          this.consecutiveDays = count
          
          // 登录状态且连续充值天数 > 0 时可以签到
          this.canSign = this.isAuthenticated && this.consecutiveDays > 0
        }
      } catch (e) {
        this.$toast && this.$toast.error('Falha ao carregar informações de check-in')     
        this.canSign = false
      }
    },
    async handleSign() {
      if (!this.isAuthenticated) {
        eventBus.emit('open-login-modal', 'login')
        return
      }
      if (!this.canSign) return
      this.consecutiveDays = Math.min(this.consecutiveDays, 7)
      try {
        const resp = await dailyCheckinApi.claim()
        if (resp.code === 1) {
          const { reward_amount, balance_after } = resp.data
          this.$toast && this.$toast.success(`Resgate bem-sucedido +${reward_amount.toFixed(2)}`)
          this.$store.dispatch('auth/updateBalance', balance_after)
          this.canSign = false
        } else {
          let msg = resp.msg
          if (resp.code === 4002) {
            msg = 'Depósito de hoje insuficiente'
            eventBus.emit('open-deposit-modal')
          } else if (resp.code === 4003) {
            msg = 'Você já recebeu a recompensa de hoje'
          } else {
            msg = msg || 'Falha ao receber recompensa'
          }
          this.$toast && this.$toast.error(msg)
        }
      } catch (error) {
        this.$toast && this.$toast.error('Erro de rede, falha ao resgate')
      }
    },
    showDetail() {
      if (!this.isAuthenticated) {
        eventBus.emit('open-login-modal', 'login')
        return
      }
      this.$router.push({ name: 'MissaoDetail' })
    }
  }
}
</script>
<style scoped>
.event {
  margin: 0 auto;
  padding-top: .625rem;
  display: flex;
  min-height: 70vh;  
}

.event-r {
  flex: 1;
  padding: 0 .625rem 6.25rem;
  display: flex;
  flex-wrap: wrap;
}

.event-r-list {
  display: flex;
  flex-direction: column;
  gap: .9375rem;
  width: 100%;
}

.event-r-card img {
  width: 100%;
  display: block;
}


.event .event-r {
    flex: 1;
    padding: 0 .625rem 6.25rem;
    box-sizing: border-box;
    display: flex;
    flex-wrap: wrap;
    align-self: flex-start;
}

.event .event-r .event-r-list {
    display: flex;
    flex-direction: column;
    gap: .9375rem;
    width: 100%;
}

.event .event-r .box-bg-border {
    border-radius: 1.25rem;
    background: var(--activity-bg-color);
    border: .0625rem solid var(--activity-border-color);
    box-sizing: border-box;
    width: 100%;
}

/* 仅在任务卡片上允许内容溢出显示（用于顶部图片上移效果） */
.event .event-r .DailyRechargeCheckIn {
    overflow: visible;
}

.event .event-r .event-r-card {
    cursor: pointer;
    width: 100%;
    margin-right: 0;
    box-sizing: border-box;
    align-self: flex-start;
    font-size: 0;
}

.event .event-r .event-r-card img {
    width: 100%;
    display: block;
}



.box-bg-border {
  border-radius: .625rem;
  background: var(--activity-bg-color);
  border: .0625rem solid var(--activity-border-color);
}

.DailyRechargeCheckIn {
    font-size: 1rem;
    color: var(--activity-name-color);
    max-width: 100%;    
    background: linear-gradient(135deg, var(--color-bg-bottomnav), var(--color-inactive));
    border-radius: 1.625rem;
    padding: 0 .625rem .9375rem;
    box-sizing: border-box;
    margin-top: 1.25rem;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_top {
    display: flex;
    align-items: center;
    margin-bottom: .9375rem;
    overflow: visible;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_top .DailyRechargeCheckIn_top_text {
    flex: 1;
    font-weight: 400;
    font-size: 1.4rem;
    color: var(--color-inactive);
    margin-left: .625rem;
    padding-top: .625rem;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_top .DailyRechargeCheckIn_top_text .DailyRechargeCheckIn_top_title {
    font-weight: 700;
    font-size: 1.8rem;
    color: var(--color-inactive);
    line-height: 2.125rem;
    margin-bottom: .3125rem;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_top img {
    width: 6.875rem;
    height: auto;
    margin-top: 0;
    object-fit: contain;
    flex-shrink: 0;
    transform: translateY(-1.45rem);
    will-change: transform;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box {
    background: var(--activity-name-color);
    border-radius: 1.25rem;
    padding: .9375rem .625rem;
    box-sizing: border-box;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_title {
    font-weight: 600;
    font-size: 1.3rem;
    color: var(--color-text-inverse);
    margin-bottom: .625rem;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_title span {
    color: var(--color-active);
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: .625rem;
    margin-bottom: .9375rem;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item {
    box-sizing: border-box;
    background: var(--color-bg-primary70);
    border-radius: .75rem;
    border: .0625rem solid transparent;
    padding: .625rem 0;
    text-align: center;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item .DailyRechargeCheckIn_box_item_num {
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-text-inverse);
    margin-bottom: .8125rem;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item .DailyRechargeCheckIn_box_item_num_active {
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-active);
    margin-bottom: 1.4375rem;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item .img_default {
    width: 3.25rem;
    margin: 0 auto;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item .amount_text {
    font-weight: 600;
    font-size: 1rem;
    color: var(--color-neutral-500);
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item .amount_text_active {
    color: var(--color-active);
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item_border_color1 {
    border-color: var(--color-active);
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_box .DailyRechargeCheckIn_box_list .DailyRechargeCheckIn_box_item_border_color2 {
    border-color: var(--color-inactive);
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_btn1 {
    height: 3.625rem;
    background: var(--color-active);
    border-radius: 2.5rem;
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--activity-name-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border: .0625rem solid transparent;
    margin-bottom: .625rem;
    cursor: pointer;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_btn2 {
    height: 3.625rem;
    background: var(--activity-name-color);
    border-radius: 2.5rem;
    border: .0625rem solid var(--color-active);
    font-weight: 600;
    font-size: 1.25rem;
    color: var(--color-active);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_btn_allowed {
    cursor: not-allowed;
    position: relative;
    opacity: .8;
}

.DailyRechargeCheckIn .DailyRechargeCheckIn_btn_allowed::after {
    content: "";
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-color: rgba(255,255,255,.6);
    position: absolute;
}



</style>
