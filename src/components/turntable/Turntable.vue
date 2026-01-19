<template>
  <div>
    <div class="lottery-box w-full pt-[0.75rem]">
      <div class="lottery m-auto w-[21rem] h-[21rem] relative" :style="{ '--spin-duration': spinDuration, '--ease': 'ease-out' }">
        <div class="lottery-bg w-[21rem] h-[21rem]" :style="{ backgroundImage: `url(${currentTheme.dp})` }"></div>
        <div
          class="w-[7.125rem] h-[7.8rem] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] absolute z-2 startBtn flex items-center justify-center"
          :style="{ backgroundImage: `url(${currentTheme.start})` }"
          :class="{ 'cursor-not-allowed pointer-events-none': isWaiting }"
          @click="onStartClick"
        >
          <span :class="[isWaiting ? 'text-gray-300' : 'text-white']" class="text-[1.125rem] translate-y-[0.3rem]">{{ isWaiting ? 'loading' : 'RODAR' }}</span>
        </div>
        <div class="select absolute top-[-0.75rem] left-[50%] translate-x-[-50%] w-[7.125rem] h-auto">
          <img :src="currentTheme.point" alt="">
        </div>
        <div
          v-for="(p, i) in prizes"
          :key="i"
          class="item absolute inset-0 z-1"
          :style="getItemStyle(i)"
        >
          <p class="item-index py-[0.75rem] !text-[1.875rem]">{{ p.label ?? i + 1 }}</p>
          <img class="item-img !w-[2.55rem] !h-[2.55rem]" :src="p.icon ?? '/constant/turntable/coin.png'" alt="">
        </div>
      </div>
    </div>
  </div>
  </template>
  <script setup lang="ts">
  import { ref, computed, watch } from 'vue';
  const ThemeKeys = ['blue', 'yellow', 'purple'] as const;
  type ThemeKey = typeof ThemeKeys[number];
  type Prize = { id: string | number; label?: string; icon?: string };
  const themes: Record<ThemeKey, { dp: string; point: string; start: string }> = {
      blue: {
          dp: '/constant/turntable/blue-dp.png',
          point: '/constant/turntable/blue-point.png',
          start: '/constant/turntable/start1.png',
      },
      yellow: {
          dp: '/constant/turntable/yellow-dp.png',
          point: '/constant/turntable/yellow-point.png',
          start: '/constant/turntable/start2.png',
      },
      purple: {
          dp: '/constant/turntable/purple-dp.png',
          point: '/constant/turntable/purple-point.png',
          start: '/constant/turntable/start3.png',
      },
      
  };
  const props = withDefaults(defineProps<{ themeKey?: ThemeKey; prizes: Prize[]; selectedId?: string | number }>(), {
      themeKey: 'blue',
  });
  const emit = defineEmits<{ (e: 'start'): void; (e: 'spun', payload: { index: number; label?: string }): void; (e: 'spin-error'): void }>();
  const currentTheme = computed(() => themes[props.themeKey] ?? themes.blue);
  const prizes = computed(() => props.prizes ?? []);
  const count = computed(() => prizes.value.length);
  const radiusRem = 8.25;
  const baseAngle = ref(0);
  const spinDurationMs = ref(3000);
  const spinDuration = computed(() => `${spinDurationMs.value}ms`);
  const isSpinning = ref(false);
  const isWaiting = ref(false);
  const onStartClick = () => {
      if (isSpinning.value || isWaiting.value || count.value === 0) return;
      isWaiting.value = true;
      emit('start');
  };
  const getItemStyle = (i: number) => {
      const angle = (360 / count.value) * i + baseAngle.value;
      return {
          transform: `rotate(${angle}deg)`,
          '--angle': `${angle}deg`,
          '--rev-angle': `${-angle}deg`,
          '--text-rotate': `${angle}deg`,
          '--radius-rem': `${radiusRem - 2.625}rem`,
          '--label-radius-rem': `${radiusRem}rem`
      };
  };
  const spinToIndex = (idx: number) => {
      if (count.value === 0 || idx < 0 || idx >= count.value) return;
      const rounds = 3;
      const seg = 360 / count.value;
      const target = - (idx * seg);
      const currentMod = ((baseAngle.value % 360) + 360) % 360;
      const targetMod = ((target % 360) + 360) % 360;
      const diffForward = ((targetMod - currentMod) % 360 + 360) % 360;
      spinDurationMs.value = 3000;
      isSpinning.value = true;
      baseAngle.value = baseAngle.value + rounds * 360 + diffForward;
      setTimeout(() => {
          isSpinning.value = false;
          isWaiting.value = false;
          const prize = prizes.value[idx];
          emit('spun', { index: idx, label: prize?.label })
      }, spinDurationMs.value + 100);
  };
  watch(
      () => props.selectedId,
      (id) => {
          if (id == null || isSpinning.value) return;
          const idx = prizes.value.findIndex(p => p.id === id);
          if (idx !== -1) {
              spinToIndex(idx);
          } else {
              isWaiting.value = false;
              emit('spin-error')
          }
      }
  );
  watch(
      () => prizes.value.length,
      () => {
          baseAngle.value = ((baseAngle.value % 360) + 360) % 360;
      }
  );
  
  defineExpose({
      resetWaiting: () => {
          isWaiting.value = false
      }
  })
  
  </script>
  <style scoped>
  .lottery-bg {
      background-size: 100% 100%;
      background-repeat: no-repeat;
  }
  .startBtn{
      background-size: 100% 100%;
      background-repeat: no-repeat;
      cursor: pointer;
      z-index: 2;
  }
  .item { width: 100%; height: 100%; transform-origin: center; position: absolute; transition: transform var(--spin-duration, 2400ms) var(--ease, cubic-bezier(0.42, 0, 0.58, 1)); pointer-events: none; }
  .item-img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%) translateY(calc(-1 * var(--radius-rem))) rotate(var(--rev-angle));
      object-fit: contain;
      pointer-events: none;
  }
  .select {
      pointer-events: none;
  }
  .item-index {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%,-50%) translateY(calc(-1 * var(--label-radius-rem))) rotate(calc(var(--rev-angle) + var(--text-rotate)));
      color: #fff;
      font-size: 0.675rem;
      user-select: none;
  }
  </style>
