<template>
  <div
    v-show="state.visible"
    class="fixed inset-0 z-[10000] pointer-events-auto"
  >
    <!-- 全屏半透明遮罩 -->
    <div class="absolute inset-0 bg-black/50"></div>

    <!-- 钱币雨背景层（不拦截点击） -->
    <div class="coin-layer absolute inset-0 pointer-events-none">
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
      <i class="coin"></i>
    </div>

    <!-- 居中内容盒子 -->
    <div class="relative h-full flex flex-col items-center justify-center px-4">
      <div v-if="!opened" class="flex flex-col items-center">
        <p class="text-[#ddcd69] text-[2.37rem] font-[900] leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,.45)] tracking-wide">BÔNUS</p>
        <p class="text-white text-[.875rem] font-[700] mt-2 drop-shadow-[0_2px_3px_rgba(0,0,0,.35)]">BÔNUS DE LOGIN</p>
      </div>

      <!-- 序列帧礼物盒 -->
      <div class="relative mt-5 flex items-center justify-center">
        
        <div v-if="opened">
          <div class="gift-open-sprite relative" @animationend="onOpenAnimationEnd" @webkitAnimationEnd="onOpenAnimationEnd" :class="{ paused: openPaused }">            
          </div>
          <div class="gift-light"></div>
          <div class="absolute w-full top-[40%] z-10">
            <p
              class="text-[#f8ff7a] text-center uppercase text-[1.125rem] font-black w-full top-[40%]"
              style="text-shadow:2px 0 0 #d72f2f,0 2px 0 #d72f2f,-2px 0 0 #d72f2f,0 -2px 0 #d72f2f,2px 2px 0 #d72f2f,-2px 2px 0 #d72f2f,2px -2px 0 #d72f2f,-2px -2px 0 #d72f2f;"
            >
              Receber um bônus
            </p>
            <p
              class="text-[#f8ff7a] text-center uppercase text-[2.375rem] font-black w-full top-[40%]"
              style="text-shadow:2px 0 0 #d72f2f,0 2px 0 #d72f2f,-2px 0 0 #d72f2f,0 -2px 0 #d72f2f,2px 2px 0 #d72f2f,-2px 2px 0 #d72f2f,2px -2px 0 #d72f2f,-2px -2px 0 #d72f2f;"
            >
              +R$ 0,10
            </p>
            <div        
              class="mx-auto mt-[3rem] w-[10.25rem] h-[2.75rem] bg-[url('/static/gift_btn.svg')] bg-no-repeat bg-center bg-contain flex items-center justify-center text-[#854a08] text-[1rem] font-[900] tracking-[.02em] cursor-pointer select-none"
              @click="state.visible = false"
            >
              RECEBER
            </div>
          </div>
        </div>
        <div v-else class="gift-sprite"></div>

      </div>
      
      <!-- 按钮模块 -->
      <div
        v-if="!opened"
        class="mt-7 w-[10.25rem] h-[2.75rem] bg-[url('/static/gift_btn.svg')] bg-no-repeat bg-center bg-contain flex items-center justify-center text-[#854a08] text-[1rem] font-[900] tracking-[.02em] cursor-pointer select-none"
        @click="startOpen()"
      >
        ABRIR
      </div>
      
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
export default defineComponent({
  name: "GiftAlert",
  setup() {
    const state = inject<{ visible: boolean }>("giftAlertState")!;
    const opened = ref(false);
    const openPaused = ref(false);

    const startOpen = () => {
      openPaused.value = false;
      opened.value = true;
      // 兜底：若 animationend 未触发，按纵向动画时长停住
      window.setTimeout(() => {
        if (!openPaused.value) openPaused.value = true;
      }, 900);
    };

    const onOpenAnimationEnd = (e: AnimationEvent) => {
      const name = (e as any).animationName || "";
      if (name.includes("gift-open-y")) {
        openPaused.value = true;
      }
    };

    return { state, opened, openPaused, onOpenAnimationEnd, startOpen };
  },
});
</script>

<style scoped>
/* 钱币雨：多个 coin 元素以不同的速度/延迟下落 */
.coin-layer {
  overflow: hidden;
  --fall-speed: 0.6; /* 速度缩放：数值越小，下落越快；可调 */
}
.coin {
  position: absolute;
  top: -12vh;
  width: 5rem;
  height: 5rem;
  /* 帧动画：假设 coin.png 为横向 5 帧 */
  --frames-coin: 5;
  background: url("/static/coin.png") left center/
    calc(var(--frames-coin) * 100%) 100% no-repeat;
  /* 同时进行下落与帧切换 */
  animation: coin-fall calc(var(--dur, 4s) * var(--fall-speed, 0.6)) linear
      infinite,
    coin-frames var(--framesDur, 600ms) steps(var(--frames-coin)) infinite;
  animation-delay: var(--delay, 0s);
  left: var(--x, 50%);
  transform: translateX(-50%);
}
@keyframes coin-fall {
  0% {
    transform: translate(-50%, -15vh) rotate(0deg) scale(0.9);
  }

  100% {
    transform: translate(-50%, 115vh) rotate(360deg) scale(1);
  }
}
@keyframes coin-frames {
  from {
    background-position: left center;
    background-position: 0px 0px;
  }
  to {
    background-position: right center;
    background-position: -25rem 0px;
  }
}
/* 分布不同位置与时序 */
.coin-layer .coin:nth-child(1) {
  --x: 8%;
  --dur: 3.8s;
  --delay: 0.2s;
}
.coin-layer .coin:nth-child(2) {
  --x: 18%;
  --dur: 4.6s;
  --delay: 0.9s;
}
.coin-layer .coin:nth-child(3) {
  --x: 28%;
  --dur: 4.1s;
  --delay: 0.4s;
}
.coin-layer .coin:nth-child(4) {
  --x: 38%;
  --dur: 3.7s;
  --delay: 1.3s;
}
.coin-layer .coin:nth-child(5) {
  --x: 48%;
  --dur: 4.3s;
  --delay: 0.6s;
}
.coin-layer .coin:nth-child(6) {
  --x: 58%;
  --dur: 3.9s;
  --delay: 1s;
}
.coin-layer .coin:nth-child(7) {
  --x: 68%;
  --dur: 4.5s;
  --delay: 0.3s;
}
.coin-layer .coin:nth-child(8) {
  --x: 78%;
  --dur: 3.6s;
  --delay: 1.1s;
}
.coin-layer .coin:nth-child(9) {
  --x: 88%;
  --dur: 4.2s;
  --delay: 0.5s;
}
.coin-layer .coin:nth-child(10) {
  --x: 14%;
  --dur: 4.8s;
  --delay: 1.4s;
}
.coin-layer .coin:nth-child(11) {
  --x: 44%;
  --dur: 3.5s;
  --delay: 0.7s;
}
.coin-layer .coin:nth-child(12) {
  --x: 74%;
  --dur: 4s;
  --delay: 1.2s;
}

/* 礼物盒序列帧动画：仅原地播放，不产生平移 */
.gift-sprite {
  --frames: 14; /* 帧数 */
  width: 9.5rem;
  height: 11.0313rem;

  background-image: url("/static/gift_box.png");
  background-repeat: no-repeat;
  background-size: calc(var(--frames) * 100%) 100%; /* 整张图宽度 = 帧数 × 单帧宽度 */
  animation: gift-frames 900ms steps(var(--frames)) infinite;
}

@keyframes gift-frames {
  0% {
    background-position: 0px 0px;
  }

  100% {
    background-position: -133rem 0px;
  }
}
/* 打开动画：4x6 序列帧（横向 4，纵向 6） */
.gift-open-sprite {
  position: relative;
  z-index: 2;
  width: 28rem;
  height: 28rem;
  background: url('/static/gift_open.png') 0% 0% / 400% 600% no-repeat;
  /* 加快速度：总时长 0.9s（横向 0.15s × 6 行） */
  animation: gift-open-x 0.15s steps(4) 0s 6 both, gift-open-y 0.9s steps(6) 0s 1 both;      
}
@keyframes gift-open-x {
  from { background-position-x: 0px; }
  to   { background-position-x: -112rem; }
}
@keyframes gift-open-y {
  from { background-position-y: 0px; }
  to   { background-position-y: -168rem; }
}

/* 打开后光芒：持续旋转 */
.gift-light {
  position: absolute;
  z-index: 10;
  left: 50%;
  top: 50%;
  width: 23.6875rem;
  height: 23.6875rem;
  background: url('/static/gift_light.png') center / contain no-repeat;
  transform-origin: center center;
  pointer-events: none;
  animation: aperture 10s linear infinite;
}
@keyframes aperture {
  0%   { transform: translate(-50%, -50%) rotate(0deg); }
  100% { transform: translate(-50%, -50%) rotate(360deg); }
}

/* 播放完成后暂停在最后一帧 */
.gift-open-sprite.paused {
  animation: none;
  /* 强制停在最后一帧（最右下角） */
  background-position-x: -84rem;
  background-position-y: -140rem;
}


</style>