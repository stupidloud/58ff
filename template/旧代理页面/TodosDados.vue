<template>
  <div class="searchBox flex items-center leading-[1.1] m-4">
    <div class="time mr-4">
      <DateRangePicker @dateChange="handleDateChange" />
    </div>
    <div class="ID mr-4">
      <SearchBox v-model="searchValue" placeholder="ID do Membro" class="w-40 h-10" />
    </div>
  </div>



  <!-- 列表容器 -->
  <div class="List overflow-auto pb-8 m-4 leading-[1.1] h-[calc(100%-4.5rem-4.5rem-3rem-2rem-8rem)] ">
    <!-- TODO 强制显示() -->
    <!-- <div v-if="true">
      <div class="bg-[var(--color-bg-primary)] p-[1rem] rounded-[.5rem] relative flex items-center">
        <div class="absolute top-0 left-0 h-[1.2rem] px-[0.3rem] bg-red-500 text-[0.8rem] flex items-center">v1</div>
        <div class="w-[50%]">
          <div class="flex items-center">
            <p class="text-white mr-[.5rem] text-[1rem]">18352764</p>
            <svg aria-hidden="true" focusable="false">
              <use xlink:href="#comm_icon_copy--svgSprite:all"></use>
            </svg>
          </div>
        </div>
      </div>
    </div> -->


    <!-- 加载状态 -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-[var(--color-inactive)]">Carregando dados...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="text-center py-8">
      <p class="text-red-500">{{ error }}</p>
      <button @click="fetchData" class="mt-2 px-4 py-2 bg-[var(--color-active)] text-white rounded">
        Tentar novamente
      </button>
    </div>

    <!-- 空数据状态 -->
    <EmptyState v-else-if="filteredData.length === 0" />

    <!-- 数据列表 -->
    <div v-else v-for="(item, index) in filteredData" :key="item.id" class="box p-4 rounded-lg relative"
      :class="{ 'bg-[var(--color-bg-primary)]': index % 2 === 0 }">
      <div class="leftVip absolute top-0 left-0 h-[1.2rem] px-[0.3rem] bg-red-500 text-[0.8rem]">
        V{{ item.vipLevel }}
      </div>
      <div class="content flex mt-2">
        <div class="w-1/2">
          <div class="flex items-center mb-[0.7rem]">
            <span class="ID mr-2">{{ item.memberId }}</span>
            <div class="copy flex justify-center items-center text-[1.2rem]" @click="goCopy(item.memberId)">
              <svg aria-hidden="true" focusable="false" class="w-[1em] h-[1em] fill-[var(--color-active)]">
                <use xlink:href="#comm_icon_copy--svgSprite:all"></use>
              </svg>
            </div>
          </div>
          <div class="flex items-center mb-[0.7rem]">
            <span class="time">{{ formatDate(item.date) }}</span>
          </div>
        </div>
        <div class="w-1/2">
          <div class="flex items-center mb-[0.7rem]">
            <span class="text-[var(--color-inactive)] mr-2">Apostas válidas</span>
            <span>{{ formatCurrency(item.validBets) }}</span>
          </div>
          <div class="flex items-center mb-[0.7rem]">
            <span class="text-[var(--color-inactive)] mr-2">Depósito</span>
            <span>{{ formatCurrency(item.deposit) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Total容器 -->
  <div
    class="Total flex flex-wrap text-[1rem] absolute bottom-0 w-full bg-[var(--color-bg-primary)] px-4 pt-4 pb-30 border-t border-[var(--color-inactive)] min-h-[11rem] gap-y-[1rem]">
    <!-- Total内容将在这里添加 -->
    <div class="flex w-1/2 text-left"><span class="w-[10.5rem] mr-2 text-[var(--color-inactive)]">Valor de recarga
        direta</span><span>{{ formatCurrency(totalStats.directRechargeValue) }}</span></div>
    <div class="flex w-1/2 text-left"><span class="w-[10.5rem] mr-2 text-[var(--color-inactive)]">Número de usuários de
        recarga direta</span><span>{{ totalStats.directRechargeUsers }}</span></div>
    <div class="flex w-1/2 text-left"><span class="w-[10.5rem] mr-2 text-[var(--color-inactive)]">Valor de outras
        recargas</span><span>{{ formatCurrency(totalStats.otherRechargeValue) }}</span></div>
    <div class="flex w-1/2 text-left"><span class="w-[10.5rem] mr-2 text-[var(--color-inactive)]">Número de usuários de
        outras recargas</span><span>{{ totalStats.otherRechargeUsers }}</span></div>
    <div class="flex w-1/2 text-left"><span class="w-[10.5rem] mr-2 text-[var(--color-inactive)]">Valor total de
        recarga</span><span>{{ formatCurrency(totalStats.totalRechargeValue) }}</span></div>
    <div class="flex w-1/2 text-left"><span class="w-[10.5rem] mr-2 text-[var(--color-inactive)]">Número total de
        usuários de recarga</span><span>{{ totalStats.totalRechargeUsers }}</span></div>
    <div class="flex w-1/2 text-left"><span class="w-[10.5rem] mr-2 text-[var(--color-inactive)]">Recarga
        média</span><span>{{ formatCurrency(totalStats.averageRecharge) }}</span></div>
  </div>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import DateRangePicker from '../ui/DateRangePicker.vue'
import SearchBox from '../ui/SearchBox.vue'
import EmptyState from '../common/EmptyState.vue'
import { goCopy } from '../../utils/clipboard'
import { playerApi, type ReferralData } from '../../services/api'
import { eventBus } from '../../utils/eventBus'
import { formatDate, formatCurrency, convertDateFormat } from '../../utils/dateUtils'

const router = useRouter()


// 组件使用的数据接口
interface MemberData {
  id: string
  memberId: string
  vipLevel: number
  date: string
  validBets: number
  deposit: number
}

// 响应式数据
const searchValue = ref('')
const loading = ref(false)
const error = ref('')
const data = ref<MemberData[]>([])
const rawData = ref<ReferralData[]>([])

// 日期过滤范围
const dateRange = ref<{
  startDate: string
  endDate: string
} | null>(null)

// 计算属性：过滤后的数据
const filteredData = computed(() => {
  let filtered = data.value

  // 过滤掉存款金额为0的会员
  filtered = filtered.filter(item => item.deposit > 0)

  // 会员ID搜索过滤
  if (searchValue.value) {
    filtered = filtered.filter(item =>
      item.memberId.toLowerCase().includes(searchValue.value.toLowerCase())
    )
  }

  // 日期范围过滤
  if (dateRange.value) {
    const { startDate, endDate } = dateRange.value
    filtered = filtered.filter(item => {
      // 将 DD/MM/YYYY 格式转换为 YYYY-MM-DD 进行比较
      const itemDate = convertDateFormat(item.date)
      return itemDate >= startDate && itemDate <= endDate
    })
  }

  return filtered
})

// 计算总计数据 - 基于过滤后的数据
const totalStats = computed(() => {
  // 获取过滤后数据对应的原始API数据
  const filteredIds = filteredData.value.map(item => item.id)
  const filteredRawData = rawData.value.filter(item =>
    filteredIds.includes(item.id.toString())
  )

  // 分离层级1和其他层级的数据（基于过滤后的数据）
  const level1Users = filteredRawData.filter(item => item.level === 1)
  const otherLevelUsers = filteredRawData.filter(item => item.level !== 1)

  // 层级1（直接下线）统计
  const directRechargeUsers = level1Users.filter(item => item.total_deposit > 0).length
  const directRechargeValue = level1Users.reduce((sum, item) => sum + item.total_deposit, 0)

  // 其他层级统计
  const otherRechargeUsers = otherLevelUsers.filter(item => item.total_deposit > 0).length
  const otherRechargeValue = otherLevelUsers.reduce((sum, item) => sum + item.total_deposit, 0)

  // 总计统计
  const totalRechargeValue = directRechargeValue + otherRechargeValue
  const totalRechargeUsers = directRechargeUsers + otherRechargeUsers
  const averageRecharge = totalRechargeUsers > 0 ? totalRechargeValue / totalRechargeUsers : 0

  return {
    directRechargeValue,
    directRechargeUsers,
    otherRechargeValue,
    otherRechargeUsers,
    totalRechargeValue,
    totalRechargeUsers,
    averageRecharge
  }
})

// 数据映射函数：将API数据转换为组件需要的格式
const mapApiDataToMemberData = (apiData: ReferralData[]): MemberData[] => {
  return apiData.map(item => ({
    id: item.id.toString(),
    memberId: item.id.toString(),
    vipLevel: item.vip_level,
    date: item.register_time,
    validBets: item.total_bet,
    deposit: item.total_deposit
  }))
}

// 获取真实API数据
const fetchData = async () => {
  loading.value = true
  error.value = ''

  try {
    // 调用真实API
    const response = await playerApi.getReferrals()

    if (response.code === 1 && response.data?.referrals) {
      // 保存原始数据用于统计计算
      rawData.value = response.data.referrals

      // 将API数据映射为组件需要的格式
      const mappedData = mapApiDataToMemberData(response.data.referrals)
      data.value = mappedData
    } else {
      // 检查是否是认证相关错误
      if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
        // 认证错误：跳转到首页并显示登录模态框
        router.push('/')
        eventBus.emit('open-login-modal', 'login')
        return // 不设置error，避免显示错误UI
      }

      error.value = response.msg || 'Erro ao carregar dados'
      console.error('Erro ao buscar dados:', response.msg, 'code:', response.code)
    }
  } catch (err: any) {
    // catch块现在主要处理网络错误等异常
    error.value = err.message || 'Erro ao carregar dados. Tente novamente.'
    console.error('Erro ao buscar dados:', err)
  } finally {
    loading.value = false
  }
}



// 处理日期范围变化
const handleDateChange = (range: { startDate: string; endDate: string }) => {
  dateRange.value = range
  console.log('日期范围变化:', range)
}

// 注意：formatDate, formatCurrency, convertDateFormat 函数现在从 dateUtils 导入

// 组件挂载时获取数据
onMounted(() => {
  fetchData()
})
</script>

<style scoped></style>
