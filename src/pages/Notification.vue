<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">    
    <NavBar :canReturn="true" :title="'Centro de Mensagens'" />
    
    <!-- 页面内容 -->
    <div class="pt-[3.5rem] px-4">
      <div class="text-white">
        <h2 class="text-xl font-bold mb-6">通知中心</h2>
        
        <!-- 通知内容区域 -->
        <div class="space-y-4">
          <p class="text-white/80">暂无新通知</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
/* 页面特定样式 */
</style>