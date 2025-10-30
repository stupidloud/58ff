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
            <div class="flex-1 flex justify-between items-center px-[.45rem] rounded-[.375rem] bg-[var(--color-main-bg)] h-[2rem]">               
               <input class="!text-white !text-[.75rem] bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:border-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" placeholder="ID" type="number">
                <ion-icon class="text-[1rem] text-white/40" name="search-outline"></ion-icon>
           </div>
        </div>

        <div class="pt-[.85rem]">
            <div class="w-full h-[2.75rem] bg-[var(--color-bg-aside)] flex items-center rounded-[.315rem]">
                <p class="text-white/60 font-[700] text-[.75rem] flex-1">ID</p>
                <p class="text-white/60 font-[700] text-[.75rem] flex-1 text-left">Número de Subordinados</p>
                <p class="text-white/60 font-[700] text-[.75rem] flex-1">Aposta</p>
                <p class="text-white/60 font-[700] text-[.75rem] flex-1">Desempenho</p>
                <p class="text-white/60 font-[700] text-[.75rem] flex-1">Depósito</p>
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
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Calendar from '../../components/calendar/Calendar.vue'
import Empty from '../../components/empty/Empty.vue'

const selectedDate = ref('2025-10-29')
const showCalendar = ref(false)
const datePickerRef = ref<HTMLElement>()

const openCalendar = () => {
  showCalendar.value = true
}

const onDateSelected = (date: string) => {
  selectedDate.value = date
}
</script>
<style lang="css" scoped></style>