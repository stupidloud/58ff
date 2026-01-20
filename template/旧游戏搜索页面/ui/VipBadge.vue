<template>
  <div
    :class="['relative inline-block', containerClass]"
    :style="{ width: `${props.w * 0.25}rem`, height: `${props.h * 0.25}rem` }"
  >
    <!-- 底图 vip_bg.png -->
    <img
      :src="getConstantAssetUrl('/vip_bg.png')"
      alt="VIP Background"
      class="absolute inset-0 w-full h-full object-contain"
    />
    
    <!-- 叠加图 根据VIP等级动态选择 -->
    <img
      :src="vipFlImage"
      alt="VIP Overlay"
      class="absolute inset-0 w-full h-full object-contain"
    />
    
    <!-- VIP数值文字 -->
    <div
      class="absolute inset-0 pt-1 flex items-center justify-center font-medium text-[#f7ea94]"
      :style="{ fontSize: `${props.w * 0.09}rem` }"
    >
      {{ vipLevel }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getConstantAssetUrl } from '../../utils/assets'

// 组件属性
interface Props {
  vipLevel?: number | string  // VIP等级数值
  containerClass?: string  // 外层容器的额外CSS类名
  w?: number  // 自定义宽度数值 (对应Tailwind的w-{value})
  h?: number  // 自定义高度数值 (对应Tailwind的h-{value})
}

const props = withDefaults(defineProps<Props>(), {
  vipLevel: 0,
  containerClass: '',
  w: 20,  // 默认宽度 w-20
  h: 20   // 默认高度 h-20
})

// 根据VIP等级计算对应的fl图片路径
const vipFlImage = computed(() => {
  const level = Number(props.vipLevel)
  return getConstantAssetUrl(`/vip_fl${level}.png`)
})



</script>

<style scoped>
/* VIP徽章组件样式 */
</style>
