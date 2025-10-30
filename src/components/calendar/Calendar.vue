<template>
  <div v-if="isVisible" class="fixed inset-0 z-50" @click="handleBackdropClick">
    <div ref="calendarRef"
      class="absolute bg-[var(--color-bg-aside-2)] rounded-[.25rem] p-[.25rem] px-[.75rem] w-[12.5rem] shadow-lg"
      :style="calendarPosition" @click.stop>

      <!-- 月份导航 -->
      <div class="flex items-center justify-between mb-[.5rem]">

        <div class="flex items-center justify-center flex-1">
          <div class="text-[var(--color-active)] w-[4.5rem] text-[.875rem] font-[600] text-left">
            {{ monthNames[currentMonth] }}<br>
            <span class="text-sm">de {{ currentYear }}</span>
          </div>
        </div>
        <div class="flex flex-1">
          <div @click="previousMonth"
            class="text-[var(--color-active)] text-[1.6rem] w-[3rem] h-[3rem] rounded-[100px] hover:bg-[var(--color-active)]/5 flex items-center justify-center cursor-pointer">
            <ion-icon name="chevron-back-outline"></ion-icon>
          </div>
          <div @click="nextMonth"
            class="text-[var(--color-active)] text-[1.6rem] w-[3rem] h-[3rem] rounded-[100px] hover:bg-[var(--color-active)]/10 flex items-center justify-center cursor-pointer">
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </div>
        </div>
      </div>

      <!-- 星期标题 -->
      <div class="grid grid-cols-7 gap-1 mb-[.5rem]">
        <div v-for="day in weekDays" :key="day" class="text-center text-white/60 text-[.75rem] font-[600]">
          {{ day }}
        </div>
      </div>

      <!-- 日期网格 -->
      <div class="grid grid-cols-7 gap-1">
        <!-- 上个月的日期 -->
        <div
          v-for="date in previousMonthDates"
          :key="`prev-${date}`"
          class="h-6 w-6 flex items-center justify-center text-white/30 text-xs"
        >
          {{ date }}
        </div>
        
        <!-- 当前月的日期 -->
        <div
          v-for="date in currentMonthDates"
          :key="`current-${date}`"
          @click="selectDate(date)"
          :class="[
            'h-6 w-6 flex items-center justify-center text-xs rounded-full transition-colors cursor-pointer',
            selectedDate === date 
              ? 'bg-[#FF6B6B] text-white' 
              : isToday(date) 
                ? 'text-[var(--color-active)] opacity-40 hover:bg-white/10'
                : 'text-white hover:bg-white/10'
          ]"
        >
          {{ date }}
        </div>
        
        <!-- 下个月的日期 -->
        <div
          v-for="date in nextMonthDates"
          :key="`next-${date}`"
          class="h-6 w-6 flex items-center justify-center text-white/30 text-xs"
        >
          {{ date }}
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="flex justify-between h-[1.6rem] items-center">
        <div @click="cancel" class="text-[var(--color-active)] text-[.875rem] font-[500] cursor-pointer">
          CANCELAR
        </div>
        <div @click="confirm" class="text-[var(--color-active)] text-[.875rem] font-[500] cursor-pointer">
          FEITO
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick } from 'vue'

interface Props {
  modelValue?: boolean
  initialDate?: string
  triggerElement?: HTMLElement | null
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'dateSelected', date: string): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: false,
  initialDate: '',
  triggerElement: null
})

const emit = defineEmits<Emits>()

const isVisible = ref(props.modelValue)
const currentYear = ref(new Date().getFullYear())
const currentMonth = ref(new Date().getMonth())
const selectedDate = ref(new Date().getDate())
const calendarRef = ref<HTMLElement>()
const calendarPosition = ref({})

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  isVisible.value = newValue
  if (newValue) {
    if (props.initialDate) {
      const date = new Date(props.initialDate)
      currentYear.value = date.getFullYear()
      currentMonth.value = date.getMonth()
      selectedDate.value = date.getDate()
    }
    nextTick(() => {
      calculatePosition()
    })
  }
})

const calculatePosition = () => {
  if (!props.triggerElement) {
    // 如果没有触发元素，居中显示
    calendarPosition.value = {
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)'
    }
    return
  }

  const triggerRect = props.triggerElement.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  const viewportWidth = window.innerWidth
  const calendarWidth = 320 // w-80 = 20rem = 320px
  const calendarHeight = 400 // 估算高度

  let top = triggerRect.bottom + 8 // 在触发元素下方8px
  let right = viewportWidth - triggerRect.right // 日历右侧紧贴触发元素右边
  let useLeftAlign = false

  // 检查是否超出左边界（使用right定位时）
  if (right + calendarWidth > viewportWidth) {
    useLeftAlign = true
  }

  // 检查是否超出底部边界
  if (top + calendarHeight > viewportHeight) {
    top = triggerRect.top - calendarHeight - 8 // 显示在触发元素上方
  }

  // 检查是否超出顶部边界
  if (top < 16) {
    top = 16
  }

  if (useLeftAlign) {
    // 使用left对齐
    let left = 16 // 左边界留16px间距
    calendarPosition.value = {
      top: `${top}px`,
      left: `${left}px`
    }
  } else {
    // 使用right对齐
    calendarPosition.value = {
      top: `${top}px`,
      right: `${right}px`
    }
  }
}

const monthNames = [
  'janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho',
  'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'
]

const weekDays = ['DO', 'SEG.', 'TER.', 'QUA', 'QUI.', 'SEX.', 'SÁB.']

// 计算当前月份的日期
const currentMonthDates = computed(() => {
  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => i + 1)
})

// 计算上个月需要显示的日期
const previousMonthDates = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value, 1).getDay()
  const prevMonthDays = new Date(currentYear.value, currentMonth.value, 0).getDate()
  const dates = []

  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    dates.push(prevMonthDays - i)
  }

  return dates
})

// 计算下个月需要显示的日期
const nextMonthDates = computed(() => {
  const totalCells = 42 // 6 rows × 7 days
  const usedCells = previousMonthDates.value.length + currentMonthDates.value.length
  const remainingCells = totalCells - usedCells

  return Array.from({ length: Math.min(remainingCells, 14) }, (_, i) => i + 1)
})

// 格式化选中的日期
const selectedDateFormatted = computed(() => {
  const year = currentYear.value
  const month = String(currentMonth.value + 1).padStart(2, '0')
  const day = String(selectedDate.value).padStart(2, '0')
  return `${year}-${month}-${day}`
})

const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const selectDate = (date: number) => {
  selectedDate.value = date
}

const isToday = (date: number) => {
  const today = new Date()
  return today.getFullYear() === currentYear.value &&
         today.getMonth() === currentMonth.value &&
         today.getDate() === date
}

const handleBackdropClick = () => {
  cancel()
}

const cancel = () => {
  isVisible.value = false
  emit('update:modelValue', false)
}

const confirm = () => {
  const formattedDate = selectedDateFormatted.value
  emit('dateSelected', formattedDate)
  isVisible.value = false
  emit('update:modelValue', false)
}
</script>