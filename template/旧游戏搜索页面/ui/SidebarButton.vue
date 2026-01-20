<template>
  <button
    @click="$emit('click')"
    class="flex flex-col items-center justify-center py-2 px-4 mb-2 rounded-xl transition-all duration-200 ease-in-out sidebar-button w-[48%]"
    :class="{
      'sidebar-button-active': isActive,
      'sidebar-button-inactive': !isActive
    }"
  >
    <!-- 图标容器 -->
    <div class="h-[2.2rem] mb-1 flex items-center justify-center">
      <!-- 激活状态使用PNG图标 -->
      <img
        v-if="isActive && icon?.png"
        :src="icon.png"
        :alt="label"
        class="w-[2.6rem] transition-all duration-200"
      />
      <!-- 非激活状态使用SVG图标 -->
      <svg
        v-else-if="!isActive && icon?.svg"
        class="w-[2.6rem] h-full transition-all duration-200"
        fill="currentColor"
      >
        <use :xlink:href="icon.svg"></use>
      </svg>
    </div>
    
    <!-- 文字标签 -->
    <span class="text-[0.8rem] font-medium transition-all duration-200 mb-[0.15rem]">
      {{ label }}
    </span>
  </button>
</template>

<script setup lang="ts">
// 定义图标类型
interface ButtonIcon {
  png?: string  // 激活时的PNG图标路径
  svg?: string  // 非激活时的SVG sprite引用
}

interface Props {
  label: string
  icon?: ButtonIcon
  isActive?: boolean
}

defineProps<Props>()

defineEmits<{
  click: []
}>()
</script>

<style scoped>
/* 侧边栏按钮基础样式 */
.sidebar-button {
  border: none;
  background: transparent;
  cursor: pointer;
  outline: none;
}

/* 激活状态样式 */
.sidebar-button-active {
  background-color: var(--color-active);
  color: var(--color-bg-primary);
}

/* 非激活状态样式 */
.sidebar-button-inactive {
  background-color: var(--color-bg-opacity);
  color: var(--color-highlight-text);
}
</style>
