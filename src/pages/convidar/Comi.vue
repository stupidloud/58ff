<template>
    <div class="w-full">        
        <div class="flex w-full justify-between items-center p-[.625rem] gap-[.625rem] rounded-[.375rem] bg-[var(--color-bg-aside-2)]">
           <div 
             ref="datePickerRef"
             @click="openCalendar" 
             class="flex-1 flex justify-between items-center px-[.45rem] rounded-[.375rem] bg-[var(--color-main-bg)] h-[2rem] cursor-pointer hover:bg-opacity-80 transition-all"
           >
               <p class="text-white text-[.75rem]">{{ selectedDate }}</p>
                <ion-icon class="text-[1rem] text-white/40" name="calendar-outline"></ion-icon>
           </div>
            <div 
              ref="idPickerRef"
              @click="openIdCalendar" 
              class="flex-1 flex justify-between items-center px-[.45rem] rounded-[.375rem] bg-[var(--color-main-bg)] h-[2rem] cursor-pointer hover:bg-opacity-80 transition-all"
            >               
               <p class="text-white text-[.75rem]">{{ selectedIdDate }}</p>
                <ion-icon class="text-[1rem] text-white/40" name="calendar-outline"></ion-icon>
           </div>
        </div>

        <div class="pt-[.85rem]">
            <div class="w-full h-[3.25rem] bg-[var(--color-bg-aside)] flex items-center rounded-[.315rem]">
                <p class="text-white/40 text-center px-[.2rem] leading-[.8rem] font-[700] text-[.75rem] flex-1">Tempos</p>
                <p class="text-white/40 text-center px-[.2rem] leading-[.8rem] font-[700] text-[.75rem] flex-1">Tipos</p>
                <p class="text-white/40 text-center px-[.2rem] leading-[.8rem] font-[700] text-[.75rem] flex-1">Desempenho</p>
                <p class="text-white/40 text-center px-[.2rem] leading-[.8rem] font-[700] text-[.75rem] flex-1">Número de Pessoas</p>
                <p class="text-white/40 text-center px-[.2rem] leading-[.8rem] font-[700] text-[.75rem] flex-1">Comissão</p>
            </div>
        </div>

       <div class="w-full flex justify-center items-center h-[25rem]">
            <Empty
                title="Sem Registros"            
                iconColor="#9CA3AF"
                textColor="#6B7280"
            />
        </div>
        
        <!-- 日历组件 -->
        <Calendar 
          v-model="showCalendar" 
          :initial-date="selectedDate"
          :trigger-element="datePickerRef"
          @date-selected="onDateSelected"
        />
        
        <!-- ID日历组件 -->
        <Calendar 
          v-model="showIdCalendar" 
          :initial-date="selectedIdDate"
          :trigger-element="idPickerRef"
          @date-selected="onIdDateSelected"
        />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Calendar from '../../components/calendar/Calendar.vue'
import Empty from '../../components/empty/Empty.vue'

const selectedDate = ref(new Date().toISOString().split('T')[0])
const selectedIdDate = ref(new Date().toISOString().split('T')[0])
const showCalendar = ref(false)
const showIdCalendar = ref(false)
const datePickerRef = ref<HTMLElement>()
const idPickerRef = ref<HTMLElement>()

const openCalendar = () => {
  showCalendar.value = true
}

const openIdCalendar = () => {
  showIdCalendar.value = true
}

const onDateSelected = (date: string) => {
  selectedDate.value = date
  // 如果截至日期已选择且小于等于开始日期，清空截至日期
  if (selectedIdDate.value && new Date(selectedIdDate.value) <= new Date(date)) {
    selectedIdDate.value = new Date().toISOString().split('T')[0]
  }
}

const onIdDateSelected = (date: string) => {
  // 验证截至日期必须大于开始日期
  if (!selectedDate.value || new Date(date) <= new Date(selectedDate.value)) {
    window.showToast?.('A data final deve ser posterior à data inicial')
    return
  }
  selectedIdDate.value = date
}
</script>
<style lang="css" scoped></style>