<template>
    <div class="flex justify-between items-center p-[1rem]">
            <DropdownSelect
              v-model="nowSelect"
              :options="optionLabels"
              placeholder="Selecione"
              @change="selectOption"
            />
            <div class="flex items-center">
              <span class="text-[.9rem] text-[var(--color-inactive)]">Saque Total</span>
              <span class="text-[.9rem] ml-[.3rem] text-white">{{ formatCurrencyBRL(totalWithdrawAmount) }}</span>
            </div>
        </div>

        <!-- 提现记录列表 -->
        <div class="flex-1 overflow-auto p-[1rem]">
            <div v-if="filteredRecords.length === 0" class="flex-1">
                <EmptyState :centered="true" :show-em-breve="false" />
            </div>
            <div v-else>
                <div v-for="(record, index) in filteredRecords" :key="record.merchant_order_no"
                     class="p-[1rem] rounded-[0.5rem] mb-[0.5rem] cursor-pointer"
                     :class="index % 2 === 0 ? 'bg-[var(--color-bg-primary)]' : 'bg-transparent'"
                     @click="showDetail(record)">
                    <div class="flex justify-between items-start mb-[0.5rem]">
                        <div class="flex-1">
                            <p class="text-white text-[0.9rem] font-medium">{{ getChannelName(record.channel_code) }}</p>
                            <div class="flex items-center">
                                <p class="text-[var(--color-inactive)] text-[0.8rem] mr-[0.5rem]">{{ getOrderNumber(record.merchant_order_no) }}</p>
                                <div class="flex justify-center items-center cursor-pointer" @click.stop="goCopy(getOrderNumber(record.merchant_order_no))">
                                    <svg class="w-[0.8rem] h-[0.8rem] fill-[var(--color-active)]">
                                        <use xlink:href="#comm_icon_copy--svgSprite:all"></use>
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div class="text-right">
                            <p class="text-white text-[0.9rem] font-medium">{{ formatCurrencyBRL(record.amount) }}</p>
                            <p class="text-[0.8rem]" :class="getStatusColor(record.audit_status)">
                                {{ getStatusText(record.audit_status) }}
                            </p>
                        </div>
                    </div>
                    <div class="flex justify-between items-center text-[0.8rem] text-[var(--color-inactive)]">
                        <span>{{ formatDateTime(record.created_at) }}</span>
                        <span class="text-[var(--color-active)]">Ver Detalhes →</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 提现详情弹窗 -->
        <WithdrawDetailModal
            :show="showDetailModal"
            :record="selectedRecord"
            :channel-map="channelMap"
            @close="closeDetail"
        />
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { withdrawApi, type WithdrawRecord, depositApi } from '../../../services/api'
import { goCopy } from '../../../utils/clipboard'
import EmptyState from '../../../components/common/EmptyState.vue'
import DropdownSelect from '../../../components/ui/DropdownSelect.vue'
import { formatDateTime, formatCurrencyBRL } from '../../../utils/dateUtils'
import WithdrawDetailModal from '../../../components/modals/WithdrawDetailModal.vue'

const optionsList = [
  'Hoje',
  'Ontem',
  'Últimos 7 Dias',
  'Últimos 15 Dias',
  'Últimos 30 Dias',
  'Tudo'
]

const optionLabels = computed(() => optionsList)

const nowSelect = ref('Hoje')
const allWithdrawRecords = ref<WithdrawRecord[]>([])
const channelMap = ref<Record<string, string>>({})
const showDetailModal = ref(false)
const selectedRecord = ref<WithdrawRecord | null>(null)

const selectOption = (key: string) => {
  nowSelect.value = key
}

// 显示详情
const showDetail = (record: WithdrawRecord) => {
  selectedRecord.value = record
  showDetailModal.value = true
}

// 关闭详情
const closeDetail = () => {
  showDetailModal.value = false
  selectedRecord.value = null
}

// 根据选择的时间范围过滤记录
const filteredRecords = computed(() => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return allWithdrawRecords.value.filter(record => {
    const recordDate = new Date(record.created_at)

    switch (nowSelect.value) {
      case 'Hoje':
        return recordDate >= today
      case 'Ontem':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return recordDate >= yesterday && recordDate < today
      case 'Últimos 7 Dias':
        const week = new Date(today)
        week.setDate(week.getDate() - 7)
        return recordDate >= week
      case 'Últimos 15 Dias':
        const twoWeeks = new Date(today)
        twoWeeks.setDate(twoWeeks.getDate() - 15)
        return recordDate >= twoWeeks
      case 'Últimos 30 Dias':
        const month = new Date(today)
        month.setDate(month.getDate() - 30)
        return recordDate >= month
      case 'Tudo':
      default:
        return true
    }
  })
})

// 计算总提现金额
const totalWithdrawAmount = computed(() => {
  return filteredRecords.value
    .filter(record => record.audit_status === 4 || record.audit_status === 8) // 只计算成功的
    .reduce((sum, record) => sum + record.amount, 0)
})

// 注意：formatDateTime, formatCurrencyBRL 函数现在从 dateUtils 导入

// 获取审核状态文本
const getStatusText = (status: number) => {
  if (status >= 0 && status <= 3) {
    return 'Pendente'
  } else if (status === 4 || status === 8) {
    return 'Sucesso'
  } else {
    return 'Falhou'
  }
}

// 获取审核状态颜色
const getStatusColor = (status: number) => {
  if (status >= 0 && status <= 3) {
    return 'text-yellow-500'
  } else if (status === 4 || status === 8) {
    return 'text-green-500'
  } else {
    return 'text-red-500'
  }
}

// 获取通道名称
const getChannelName = (channelCode: string) => {
  return channelMap.value[channelCode] || `Canal ${channelCode}`
}

// 获取订单号，如果为空则用0代替
const getOrderNumber = (orderNo: string) => {
  if (!orderNo || orderNo.trim() === '') {
    return '000000000'
  }
  return orderNo
}

// 获取通道数据
const fetchChannels = async () => {
  try {
    const response = await depositApi.getChannels()
    if (response.code === 1 && response.data?.channels) {
      // 构建通道代码到名称的映射
      const map: Record<string, string> = {}
      response.data.channels.forEach((channel: any) => {
        map[channel.code] = channel.name
      })
      channelMap.value = map
      console.log('通道数据加载成功:', response.data.channels)
    } else {
      console.error('获取通道数据失败:', response.msg, 'code:', response.code)
    }
  } catch (error) {
    console.error('获取通道数据错误:', error)
  }
}

// 获取提现历史记录
const fetchWithdrawHistory = async () => {
  try {
    const response = await withdrawApi.getHistory()
    if (response.code === 1) {
      allWithdrawRecords.value = response.data.withdrawals
    }
  } catch (err) {
    console.error('获取提现历史记录错误:', err)
  }
}

// 组件挂载时获取数据
onMounted(async () => {
  // 并行加载通道数据和提现历史
  await Promise.all([
    fetchChannels(),
    fetchWithdrawHistory()
  ])
})
</script>