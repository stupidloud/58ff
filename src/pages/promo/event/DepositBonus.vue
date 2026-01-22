<template>
  <div class="min-h-screen bg-[var(--color-main-bg)]">
    <NavBar :canReturn="true" :title="'Bônus Extra De Depósito'"></NavBar>
    <div class="p-[.6rem] px-[.2rem]">
      <div class="rounded-[.5rem] bg-[var(--color-bg-primary)] p-[1rem] mb-[1rem]">
        <p class="p-[.8rem] text-[.9rem] text-[var(--color-active)] text-center">Bônus de depósito inicial</p>
        <div class="flex rounded-[.5rem] border border-[var(--color-border-1)] items-center text-center">
          <div class="flex-1 p-[.6rem] text-[.6rem] text-[var(--color-active)] leading-[1.2]">Primeiro depósito</div>
          <div class="flex-1 p-[.6rem] text-[.6rem] text-[var(--color-active)] leading-[1.2]">Proporção de recompensa</div>
          <div class="flex-1 p-[.6rem] text-[.6rem] text-[var(--color-active)] leading-[1.2]">Limite de recompensa</div>
        </div>
        <div class="flex text-center py-[.6rem]">
          <div class="flex-1 text-white text-[.6rem]">≥30</div>
          <div class="flex-1 text-white text-[.6rem]">≥20</div>
          <div class="flex-1 text-white text-[.6rem]">não limitado</div>
        </div>
      </div>
      <div class="rounded-[.5rem] bg-[var(--color-bg-primary)] p-[1rem] mb-[1rem]">
        <p class="p-[.8rem] text-[.9rem] text-[var(--color-active)] text-center">Bônus de depósito repetido</p>
        <div class="flex rounded-[.5rem] border border-[var(--color-border-1)] items-center text-center">
          <div class="flex-1 p-[.6rem] text-[.6rem] text-[var(--color-active)] leading-[1.2]">Depósito duplicado</div>
          <div class="flex-1 p-[.6rem] text-[.6rem] text-[var(--color-active)] leading-[1.2]">Proporção de recompensa</div>
          <div class="flex-1 p-[.6rem] text-[.6rem] text-[var(--color-active)] leading-[1.2]">Limite de recompensa</div>
        </div>
        <div class="flex text-center py-[.6rem]">
          <div class="flex-1 text-white text-[.6rem]">≥30</div>
          <div class="flex-1 text-white text-[.6rem]">≥0</div>
          <div class="flex-1 text-white text-[.6rem]">não limitado</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
