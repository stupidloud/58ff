<template>
    <div class="p-[.75rem]">
        <div class="flex justify-end items-center">
          
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

</script>
<style scoped></style>
