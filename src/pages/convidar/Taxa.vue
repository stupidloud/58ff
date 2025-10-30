<template>
    <div class="w-full">
        <div class="w-full h-[3.25rem] bg-[var(--color-bg-aside)] flex items-center rounded-[.315rem]">
            <p class="text-white font-[700] text-[.75rem] flex-1">nível</p>
            <p class="text-white font-[700] text-[.75rem] flex-1">desempenho</p>
            <p class="text-white font-[700] text-[.75rem] flex-1">Taxa de Bônus do Agente</p>
        </div>
        <div v-for="item in bonusLevels" :class="{ 'bg-black/5': item.nivel % 2 === 0 }" class="w-full h-[2.6rem] flex items-center">
            <div class="flex items-center relative  flex-1 justify-center">
                <p class="text-white text-[.75rem] flex-1">
                    {{ item.nivel }}
                </p>
            </div>

            <p class="text-white text-[.75rem] flex-1">
                {{item.desempenho}}
            </p>
            <p class="text-[var(--color-warning)] font-[600] text-[.75rem] flex-1">
                {{ item.taxa }}
            </p>
        </div>
    </div>
</template>
<script setup lang="ts">
const bonusLevels = [
  { nivel: 1, desempenho: '1,00+', taxa: '0,50%' },
  { nivel: 2, desempenho: '1.000.000,00+', taxa: '1,00%' },
  { nivel: 3, desempenho: '2.000.000,00+', taxa: '2,00%' },
  { nivel: 4, desempenho: '3.000.000,00+', taxa: '3,00%' },
  { nivel: 5, desempenho: '10.000.000,00+', taxa: '4,00%' },
  { nivel: 6, desempenho: '30.000.000,00+', taxa: '5,00%' },
];
</script>
<style lang="css" scoped></style>