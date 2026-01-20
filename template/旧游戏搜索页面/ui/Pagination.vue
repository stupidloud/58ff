<template>
  <div class="pagination flex items-center justify-center space-x-3">
    <!-- 上一页按钮 -->
    <button
      @click="goToPrevious"
      :disabled="currentPage === 1"
      class="pagination-btn flex items-center justify-center w-[2.7rem] h-[2.5rem] rounded-[4px] transition-all duration-200"
      :class="{        
        'bg-[var(--color-bg-primary)] text-white hover:bg-[var(--color-active)] cursor-pointer': true
      }"
    >
      <svg class="w-[1.4rem] h-[1.4rem]" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- 页码按钮 -->
    <div class="flex items-center space-x-3">
      <template v-for="page in visiblePages" :key="page">
        <button
          v-if="page !== '...'"
          @click="goToPage(page as number)"
          class="border-[1px] border-[var(--color-inactive66)] pagination-btn flex items-center justify-center w-[2.7rem] h-[2.5rem] rounded-[4px] transition-all duration-200 text-sm font-medium"
          :class="{
            'bg-[var(--color-active)] text-[var(--color-bg-primary)]': page === currentPage,
            'bg-[var(--color-bg-primary)] text-white hover:bg-[var(--color-active)] hover:text-[var(--color-bg-primary)]': page !== currentPage
          }"
        >
          {{ page }}
        </button>
        <span v-else class="text-[var(--color-inactive)] px-1">...</span>
      </template>
    </div>

    <!-- 下一页按钮 -->
    <button
      @click="goToNext"
      :disabled="currentPage === totalPages"
      class="pagination-btn flex items-center justify-center w-[2.7rem] h-[2.5rem] rounded-[4px] transition-all duration-200"
      :class="{        
        'bg-[var(--color-bg-primary)] text-white hover:bg-[var(--color-active)] cursor-pointer': true
      }"
    >
      <svg class="w-[1.4rem] h-[1.4rem]" fill="currentColor" viewBox="0 0 20 20">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 定义props
interface Props {
  currentPage: number
  totalPages: number
  maxVisiblePages?: number
}

const props = withDefaults(defineProps<Props>(), {
  maxVisiblePages: 3
})

// 定义事件
const emit = defineEmits<{
  'page-change': [page: number]
}>()

// 计算可见页码
const visiblePages = computed(() => {
  const { currentPage, totalPages, maxVisiblePages } = props
  const pages: (number | string)[] = []

  if (totalPages <= maxVisiblePages) {
    // 如果总页数小于等于最大可见页数，显示所有页码
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // 复杂分页逻辑
    const halfVisible = Math.floor(maxVisiblePages / 2)
    let startPage = Math.max(1, currentPage - halfVisible)
    let endPage = Math.min(totalPages, currentPage + halfVisible)

    // 调整起始和结束页码
    if (endPage - startPage + 1 < maxVisiblePages) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
      } else {
        startPage = Math.max(1, endPage - maxVisiblePages + 1)
      }
    }

    // 添加第一页和省略号
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }

    // 添加中间页码
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // 添加省略号和最后一页
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
  }

  return pages
})

// 页面跳转方法
const goToPage = (page: number) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const goToPrevious = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const goToNext = () => {
  if (props.currentPage < props.totalPages) {
    emit('page-change', props.currentPage + 1)
  }
}
</script>

<style scoped>
.pagination-btn {
  min-width: 2rem;
  min-height: 2rem;
}
</style>
