<template>
  <div class="searchBox flex items-center leading-[1.1] m-4">
    <div class="bonus-type mr-4">
      <DropdownSelect
        v-model="selectedBonusType"
        :options="bonusTypeOptions"
        placeholder="Selecione o tipo de bônus"
        @change="handleBonusTypeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DropdownSelect from '../ui/DropdownSelect.vue'

// 奖金类型选项
const bonusTypeOptions = [
  'Conquista do Convite',
  'Comissão de Apostas',
  'Transferência de Comissão',
  'Recompensa diária para usuários de recarga'
]

// 当前选中的奖金类型
const selectedBonusType = ref('')

// 处理奖金类型变化
const handleBonusTypeChange = (value: string) => {
  console.log('选中的奖金类型:', value)
  // 这里可以添加处理逻辑
}
</script>

<style scoped>
.bonus-container {
  width: 100%;
}
</style>
