<template>
  <div class="DateTimePicker relative">
    <div
      class="flex items-center border border-[var(--color-inactive)] rounded-3xl h-10 px-12 text-base bg-[var(--color-bg-primary)] text-[var(--color-inactive)] cursor-pointer"
      @click="togglePanel"
    >
      <span>{{ startDate }}</span>
      <span class="line m-2">-</span>
      <span>{{ endDate }}</span>
    </div>

    <!-- 日期选择面板 -->
    <div
      v-if="showPanel"
      class="absolute top-full mt-2 w-[35.5rem] border border-[var(--color-inactive)] rounded-lg z-[2] bg-[var(--color-bg-primary)] flex flex-col"
    >
      <!-- 上部分：两个日期选择器 -->
      <div class="flex flex-1 items-center">
        <!-- 左侧：开始日期选择器 -->
        <div class="flex-1 p-4">
          <h3 class="text-white text-center mb-4">Data de Início</h3>
          <div class="flex justify-center gap-8">
            <!-- 年份选择器 -->
            <div class="date-picker-column relative">
              <div class="picker-selection-lines"></div>
              <div class="picker-scroll-area" @scroll="(e) => handleScroll(e, 'startYear')">
                <!-- 年份选项 -->
                <div v-for="year in yearOptions" :key="year" 
                     class="picker-item text-white"                      
                     @click="selectedStartYear = year">
                  {{ year }}
                </div>
              </div>
            </div>
            <!-- 月份选择器 -->
            <div class="date-picker-column relative">
              <div class="picker-selection-lines"></div>
              <div class="picker-scroll-area" @scroll="(e) => handleScroll(e, 'startMonth')">
                <!-- 月份选项 -->
                <div v-for="month in monthOptions" :key="month" 
                     class="picker-item text-white"                      
                     @click="selectedStartMonth = month">
                  {{ month.toString().padStart(2, '0') }}
                </div>
              </div>
            </div>
            <!-- 日期选择器 -->
            <div class="date-picker-column relative">
              <div class="picker-selection-lines"></div>
              <div class="picker-scroll-area" @scroll="(e) => handleScroll(e, 'startDay')">
                <!-- 日期选项 -->
                <div v-for="day in dayOptions" :key="day" 
                     class="picker-item text-white"                      
                     @click="selectedStartDay = day">
                  {{ day.toString().padStart(2, '0') }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="h-[12rem] w-[1px] bg-[var(--color-inactive66)]"></div>
        <!-- 右侧：结束日期选择器 -->
        <div class="flex-1 p-4">
          <h3 class="text-white text-center mb-4">Data de Término</h3>
          <div class="flex justify-center gap-8">
            <!-- 年份选择器 -->
            <div class="date-picker-column relative">
              <div class="picker-selection-lines"></div>
              <div class="picker-scroll-area" @scroll="(e) => handleScroll(e, 'endYear')">
                <!-- 年份选项 -->
                <div v-for="year in yearOptions" :key="year" 
                     class="picker-item text-white"                      
                     @click="selectedEndYear = year">
                  {{ year }}
                </div>
              </div>
            </div>
            <!-- 月份选择器 -->
            <div class="date-picker-column relative">
              <div class="picker-selection-lines"></div>
              <div class="picker-scroll-area" @scroll="(e) => handleScroll(e, 'endMonth')">
                <!-- 月份选项 -->
                <div v-for="month in monthOptions" :key="month" 
                     class="picker-item text-white"                      
                     @click="selectedEndMonth = month">
                  {{ month.toString().padStart(2, '0') }}
                </div>
              </div>
            </div>
            <!-- 日期选择器 -->
            <div class="date-picker-column relative">
              <div class="picker-selection-lines"></div>
              <div class="picker-scroll-area" @scroll="(e) => handleScroll(e, 'endDay')">
                <!-- 日期选项 -->
                <div v-for="day in dayOptions" :key="day" 
                     class="picker-item text-white"                      
                     @click="selectedEndDay = day">
                  {{ day.toString().padStart(2, '0') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 下部分：按钮区域 -->
      <div class="flex justify-between p-4 border-t border-[var(--color-inactive)]">
        <div class="w-[50%]">
          <Button class="h-[2.5rem] flex items-center justify-center m-auto px-[1.5rem]" variant="outline" @click="handleCancel">Cancelar</Button>
        </div>
        <div class="w-[50%]">
          <Button class="h-[2.5rem] flex items-center justify-center m-auto px-[1.5rem] !bg-[var(--color-active)] !text-[var(--color-bg-primary)]" variant="outline" @click="handleConfirm">Confirmar</Button>
        </div>        
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, nextTick } from 'vue'
import Button from './Button.vue'
import { getCurrentInstance } from 'vue'

// 定义事件
const emit = defineEmits<{
  dateChange: [{ startDate: string; endDate: string }]
}>()

const { proxy } = getCurrentInstance() as any
const $toast = proxy.$toast;
// 格式化日期为 DD/MM/YYYY 格式
const formatDate = (date: Date): string => {
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// 解析 DD/MM/YYYY 格式的日期字符串
const parseDate = (dateString: string): Date => {
  const [day, month, year] = dateString.split('/').map(Number)
  return new Date(year, month - 1, day)
}

// 获取当前日期
const today = new Date()

// 起点日期和终点日期都设置为今天
const startDate = ref(formatDate(today))
const endDate = ref(formatDate(today))

// 面板显示状态
const showPanel = ref(false)

// 选中的开始日期
const selectedStartYear = ref(today.getFullYear())
const selectedStartMonth = ref(today.getMonth() + 1)
const selectedStartDay = ref(today.getDate())

// 选中的结束日期
const selectedEndYear = ref(today.getFullYear())
const selectedEndMonth = ref(today.getMonth() + 1)
const selectedEndDay = ref(today.getDate())

// 切换面板显示
const togglePanel = () => {
  if (!showPanel.value) {
    // 打开面板时，根据当前的 startDate 和 endDate 初始化选择器
    const startDateObj = parseDate(startDate.value)
    const endDateObj = parseDate(endDate.value)

    selectedStartYear.value = startDateObj.getFullYear()
    selectedStartMonth.value = startDateObj.getMonth() + 1
    selectedStartDay.value = startDateObj.getDate()

    selectedEndYear.value = endDateObj.getFullYear()
    selectedEndMonth.value = endDateObj.getMonth() + 1
    selectedEndDay.value = endDateObj.getDate()
  }

  showPanel.value = !showPanel.value

  if (showPanel.value) {
    // 面板打开后初始化滚动位置
    initScrollPosition()
  }
}

// 日期选择器选项数据
const currentYear = today.getFullYear()

// 年份选项（过去5年）
const yearOptions = computed(() => {
  const years = []
  for (let i = currentYear - 5; i <= currentYear; i++) {
    years.push(i)
  }
  return years
})

// 月份选项（1-12）
const monthOptions = computed(() => {
  const months = []
  for (let i = 1; i <= 12; i++) {
    months.push(i)
  }
  return months
})

// 日期选项（1-31）
const dayOptions = computed(() => {
  const days = []
  for (let i = 1; i <= 31; i++) {
    days.push(i)
  }
  return days
})

// 处理取消按钮
const handleCancel = () => {
  showPanel.value = false
}

// 处理确认按钮
const handleConfirm = () => {
  // 更新显示的日期范围
  const selectedStartDate = new Date(selectedStartYear.value, selectedStartMonth.value - 1, selectedStartDay.value)
  const selectedEndDate = new Date(selectedEndYear.value, selectedEndMonth.value - 1, selectedEndDay.value)

  // 验证日期范围：开始日期不能大于结束日期
  if (selectedStartDate > selectedEndDate) {
    $toast.error('A data de início não pode ser posterior à data de término')
    return
  }

  startDate.value = formatDate(selectedStartDate)
  endDate.value = formatDate(selectedEndDate)

  showPanel.value = false

  // 发送日期变化事件，使用 YYYY-MM-DD 格式
  const startDateISO = `${selectedStartYear.value}-${selectedStartMonth.value.toString().padStart(2, '0')}-${selectedStartDay.value.toString().padStart(2, '0')}`
  const endDateISO = `${selectedEndYear.value}-${selectedEndMonth.value.toString().padStart(2, '0')}-${selectedEndDay.value.toString().padStart(2, '0')}`

  emit('dateChange', {
    startDate: startDateISO,
    endDate: endDateISO
  })

  // 打印选中的日期范围
  console.log('选择的日期范围:', `${startDateISO} 至 ${endDateISO}`)
  console.log('更新后的显示日期:', `${startDate.value} - ${endDate.value}`)
}

// 滚动监听函数
const handleScroll = (event: Event, type: 'startYear' | 'startMonth' | 'startDay' | 'endYear' | 'endMonth' | 'endDay') => {
  const target = event.target as HTMLElement
  const scrollTop = target.scrollTop
  const itemHeight = 44 // picker-item 的高度

  // 计算当前选中的索引 - 修正计算逻辑
  const selectedIndex = Math.round(scrollTop / itemHeight)

  // 根据类型更新对应的选中值
  switch (type) {
    case 'startYear':
      if (yearOptions.value[selectedIndex]) {
        selectedStartYear.value = yearOptions.value[selectedIndex]
      }
      break
    case 'startMonth':
      if (monthOptions.value[selectedIndex]) {
        selectedStartMonth.value = monthOptions.value[selectedIndex]
      }
      break
    case 'startDay':
      if (dayOptions.value[selectedIndex]) {
        selectedStartDay.value = dayOptions.value[selectedIndex]
      }
      break
    case 'endYear':
      if (yearOptions.value[selectedIndex]) {
        selectedEndYear.value = yearOptions.value[selectedIndex]
      }
      break
    case 'endMonth':
      if (monthOptions.value[selectedIndex]) {
        selectedEndMonth.value = monthOptions.value[selectedIndex]
      }
      break
    case 'endDay':
      if (dayOptions.value[selectedIndex]) {
        selectedEndDay.value = dayOptions.value[selectedIndex]
      }
      break
  }
}

// 初始化滚动位置
const initScrollPosition = () => {
  nextTick(() => {
    // 为所有滚动区域设置初始位置
    const scrollAreas = document.querySelectorAll('.picker-scroll-area')
    scrollAreas.forEach((area, index) => {
      const itemHeight = 44
      const containerPadding = 55 // 与CSS中的padding保持一致
      let initialIndex = 0

      // 根据索引确定初始选中项
      switch (index) {
        case 0: // 开始年份
          initialIndex = yearOptions.value.indexOf(selectedStartYear.value)
          break
        case 1: // 开始月份
          initialIndex = monthOptions.value.indexOf(selectedStartMonth.value)
          break
        case 2: // 开始日期
          initialIndex = dayOptions.value.indexOf(selectedStartDay.value)
          break
        case 3: // 结束年份
          initialIndex = yearOptions.value.indexOf(selectedEndYear.value)
          break
        case 4: // 结束月份
          initialIndex = monthOptions.value.indexOf(selectedEndMonth.value)
          break
        case 5: // 结束日期
          initialIndex = dayOptions.value.indexOf(selectedEndDay.value)
          break
      }

      if (initialIndex >= 0) {
        initialIndex += 1;
        area.scrollTop = initialIndex * itemHeight - containerPadding
      }
    })
  })
}


</script>

<style scoped>
/* 时间范围选择器样式 */

/* 日期选择器列 */
.date-picker-column {
  width: 3.75rem;
  height: 154px; /* 44px * 3.5 = 154px，可以显示3.5个项目 */
  overflow: hidden;
}

/* 选择器滚动区域 */
.picker-scroll-area {
  height: 100%;
  overflow-y: auto;
  padding: 55px 0; /* (154px - 44px) / 2 = 55px，确保选中项居中 */
  scroll-snap-type: y mandatory; /* 在 Y 轴上启用强制滚动吸附 */
}

/* 选择器项目 */
.picker-item {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  scroll-snap-align: center; /* 设置吸附对齐方式为居中 */
  position: relative;
  z-index: 2; /* 确保项目在选择线之上 */
  font-weight: 500;
}



/* 选中状态的样式 */
.picker-item.bg-blue-600 {
  background-color: var(--color-active) !important;
  color: white !important;
  font-weight: 600;
  border-radius: 4px;
  margin: 0 4px; /* 添加左右边距 */
}

/* 选择器中间的横线 */
.picker-selection-lines {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 44px;
  transform: translateY(-50%);
  pointer-events: none;
  z-index: 1;  
  border-radius: 4px; /* 添加圆角 */
}

.picker-selection-lines::before,
.picker-selection-lines::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 1px; /* 增加线条厚度 */
  background-color: var(--color-active); /* 使用活跃颜色使线条更明显 */
  opacity: 0.8; /* 添加透明度 */
}

.picker-selection-lines::before {
  top: 0;
}

.picker-selection-lines::after {
  bottom: 0;
}

/* 隐藏滚动条 */
.picker-scroll-area::-webkit-scrollbar {
  display: none;
}

.picker-scroll-area {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
