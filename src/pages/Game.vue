<template>
  <div class="w-full h-screen bg-[var(--color-main-bg)] flex items-center justify-center">
    <div v-if="error" class="text-[#E84F46] text-[.95rem]">{{ error }}</div>
    <iframe
      v-else
      :src="gameUrl"
      class="w-full h-full"
      frameborder="0"
      allowfullscreen
      referrerpolicy="no-referrer"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { GameUrlEncoder } from '../utils/gameUrlEncoder'

const route = useRoute()
const token = computed(() => (route.query.token as string) || '')
const decoded = computed(() => {
  try {
    return GameUrlEncoder.decode(token.value)
  } catch (e: any) {
    return null
  }
})
const gameUrl = computed(() => decoded.value || '')
const error = computed(() => (decoded.value ? '' : 'Token inválido ou expirado'))
</script>

<style scoped>
</style>
