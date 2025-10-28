<template>
    <div class="p-[.75rem]">
        <div class="flex justify-between items-center">
            <div class="relative">
                <!-- 下拉选择器 -->
                <div @click="toggleDropdown"
                    class="flex items-center justify-between bg-[var(--color-bg-aside-2)] rounded-[.1rem] px-[.625rem] h-[2rem] cursor-pointer text-white/40 text-[.75rem] font-[600]">
                    Ver a data:
                    <span class="!text-white ml-[.2rem]">{{ selectedOption.label }}</span>
                    <svg :class="{ 'rotate-180': isDropdownOpen }"
                        class="w-[1rem] h-[1rem] transition-transform duration-200 text-white/60" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                <!-- 下拉菜单 -->
                <div v-show="isDropdownOpen"
                    class="absolute top-full left-0 mt-[.25rem] bg-[var(--color-bg-aside-2)] rounded-[.1rem] shadow-lg z-10 w-[7.5rem] overflow-hidden">
                    <div v-for="option in options" :key="option.value" @click="selectOption(option)"
                        :class="{ 'bg-[var(--color-bg-aside)] !text-white': option.value === selectedOption.value }"
                        class="h-[2.2rem] text-[.75rem] text-white/40 flex items-center justify-center cursor-pointer transition-colors duration-150">
                        {{ option.label }}
                    </div>
                </div>
            </div>
            <div class="text-[1rem] font-[400] text-white">
                Bonus:<span class="text-[var(--color-warning)] !font-[600]">0,00</span>
            </div>            
        </div>
        <div class="pt-[1.8125rem]">
            <div class="w-full h-[2.75rem] bg-[var(--color-bg-aside)] flex items-center rounded-[.315rem]">
                <p class="text-white/40 font-[700] text-[.75rem] flex-1">Tempo</p>
                <p class="text-white/40 font-[700] text-[.75rem] flex-1 text-left">Nome do Evento</p>
                <p class="text-white/40 font-[700] text-[.75rem] flex-1">Evento de Recompensa</p>
                <p class="text-white/40 font-[700] text-[.75rem] flex-1">Fonte</p>
            </div>
        </div>

        <div class="w-full flex justify-center items-center h-[25rem]">
            <Empty
                title="Sem Registros"            
                iconColor="#9CA3AF"
                textColor="#6B7280"
            />
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'

// 下拉选择器状态
const isDropdownOpen = ref(false)

// 选项数据类型定义
interface OptionType {
    value: string
    label: string
}

// 选项数据
const options = ref<OptionType[]>([
    { value: 'hoje', label: 'Hoje' },
    { value: 'ontem', label: 'Ontem' },
    { value: 'ultimos7', label: 'Últimos 7 Dias' },
    { value: 'ultimos30', label: 'Últimos 30 Dias' }
])

// 当前选中的选项
const selectedOption = ref<OptionType>({
    value: 'hoje',
    label: 'Hoje'
})

// 切换下拉菜单显示状态
const toggleDropdown = () => {
    isDropdownOpen.value = !isDropdownOpen.value
}

// 选择选项
const selectOption = (option: OptionType) => {
    selectedOption.value = option
    isDropdownOpen.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
    const target = event.target as HTMLElement
    if (!target.closest('.relative')) {
        isDropdownOpen.value = false
    }
}

// 监听点击外部事件
document.addEventListener('click', handleClickOutside)
</script>
<style scoped></style>
