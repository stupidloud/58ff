<template>
  <div class="relative inline-block">
    <!-- 原始logo图片 -->
    <img
      ref="logoRef"
      :src="src"
      :class="className"
      :alt="alt"
      @load="onImageLoad"
      class="relative"
    />
    <!-- 发光效果canvas层 -->
    <canvas
      ref="canvasRef"
      class="absolute top-0 left-0 pointer-events-none"
      :style="{ mixBlendMode: 'screen' }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'

/**
 * LogoSpotlight 组件
 * 功能：在logo上叠加往返移动的发光刷子，实现舞台灯照射特效
 * 特点：
 * 1. 只照亮logo前景（非透明像素）
 * 2. 光从左到右，再从右到左往返移动
 * 3. 照亮原有颜色而不是变白
 * 4. 无缝循环动画
 */

interface Props {
  src: string                    // logo图片路径
  className?: string             // 图片样式类名
  alt?: string                   // 图片alt属性
  spotlightWidth?: number        // 聚光灯宽度（像素）
  spotlightIntensity?: number    // 光照强度（倍数）
  animationDuration?: number     // 单程动画时长（毫秒）
  pauseDuration?: number         // 循环间隔暂停时长（毫秒）
}

const props = withDefaults(defineProps<Props>(), {
  className: '',
  alt: '',
  spotlightWidth: 80,
  spotlightIntensity: 1.5,
  animationDuration: 3000,
  pauseDuration: 1000
})



// ==================== 状态管理 ====================
const logoRef = ref<HTMLImageElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationFrameId = ref<number | null>(null)
const startTime = ref<number | null>(null)
const imageLoaded = ref(false)

let ctx: CanvasRenderingContext2D | null = null
let originalImageData: ImageData | null = null

// ==================== 初始化 ====================

/**
 * 图片加载完成回调
 */
const onImageLoad = () => {
  imageLoaded.value = true
  setupCanvas()
}

/**
 * 设置Canvas并提取原始图像数据
 */
const setupCanvas = () => {
  if (!logoRef.value || !canvasRef.value || !imageLoaded.value) return

  const logo = logoRef.value
  const canvas = canvasRef.value

  // 设置canvas尺寸与图片一致
  canvas.width = logo.width
  canvas.height = logo.height

  // 获取2D渲染上下文
  ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) return

  // 绘制原始图像到canvas以获取像素数据
  ctx.drawImage(logo, 0, 0, canvas.width, canvas.height)
  originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

  // 启动动画
  startAnimation()
}

// ==================== 动画控制 ====================

/**
 * 启动往返移动动画
 * 动画分为三个阶段：
 * 1. 从左到右移动
 * 2. 从右到左返回
 * 3. 暂停（可选）
 */
const startAnimation = () => {
  if (!ctx || !originalImageData || !canvasRef.value) return

  startTime.value = null

  const animate = (timestamp: number) => {
    if (!startTime.value) startTime.value = timestamp
    if (!ctx || !canvasRef.value) return

    // 计算当前循环内的时间
    const elapsed = timestamp - startTime.value
    const totalCycle = props.animationDuration * 2 + props.pauseDuration
    const elapsedInCycle = elapsed % totalCycle

    // 清空canvas
    ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)

    let position = 0
    let shouldDraw = false

    if (elapsedInCycle < props.animationDuration) {
      // 阶段1：从左到右（0 -> 1）
      const progress = elapsedInCycle / props.animationDuration
      position = easeInOutCubic(progress)
      shouldDraw = true
    } else if (elapsedInCycle < props.animationDuration * 2) {
      // 阶段2：从右到左（1 -> 0）
      const progress = (elapsedInCycle - props.animationDuration) / props.animationDuration
      position = 1 - easeInOutCubic(progress)
      shouldDraw = true
    }
    // 阶段3：暂停期，不绘制光效

    if (shouldDraw) {
      drawSpotlight(position)
    }

    animationFrameId.value = requestAnimationFrame(animate)
  }

  animationFrameId.value = requestAnimationFrame(animate)
}

/**
 * 缓动函数：三次方缓入缓出
 * 让动画开始和结束时更平滑
 */
const easeInOutCubic = (t: number): number => {
  return t < 0.5
    ? 4 * t * t * t
    : 1 - Math.pow(-2 * t + 2, 3) / 2
}

// ==================== 绘制逻辑 ====================

/**
 * 绘制聚光灯效果
 * @param position 聚光灯位置 (0=最左侧, 1=最右侧)
 */
const drawSpotlight = (position: number) => {
  if (!ctx || !originalImageData || !canvasRef.value) return

  const canvas = canvasRef.value
  const width = canvas.width
  const height = canvas.height

  // 创建新的图像数据用于绘制发光效果
  const newImageData = ctx.createImageData(width, height)
  const data = newImageData.data
  const originalData = originalImageData.data

  // 计算聚光灯中心的X坐标
  const spotlightX = position * width
  const spotlightWidth = props.spotlightWidth

  // 遍历每个像素
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4

      // 获取原始像素的alpha值
      const alpha = originalData[index + 3]

      // 只处理非透明像素（跳过alpha通道为0的像素）
      if (alpha > 0) {
        // 计算当前像素到聚光灯中心的距离
        const distance = Math.abs(x - spotlightX)

        // 使用高斯分布计算光照强度
        // 距离越近，强度越大；距离越远，强度越小
        let intensity = 0
        if (distance < spotlightWidth) {
          const normalizedDistance = distance / spotlightWidth
          intensity = Math.exp(-normalizedDistance * normalizedDistance * 5) * props.spotlightIntensity
        }

        if (intensity > 0) {
          // 获取原始颜色
          const r = originalData[index]
          const g = originalData[index + 1]
          const b = originalData[index + 2]

          // 照亮效果：通过乘法增强原有颜色的亮度
          // 这样可以保持颜色的色调，只是让它变得更亮
          // 而不是像加法那样变成白色
          const brightnessMultiplier = 1 + intensity
          data[index] = Math.min(255, r * brightnessMultiplier)
          data[index + 1] = Math.min(255, g * brightnessMultiplier)
          data[index + 2] = Math.min(255, b * brightnessMultiplier)
          data[index + 3] = alpha * Math.min(1, intensity * 0.8)
        }
      }
    }
  }

  // 将处理后的图像数据绘制到canvas
  ctx.putImageData(newImageData, 0, 0)
}

// ==================== 生命周期 ====================

/**
 * 组件挂载时检查图片是否已加载
 */
onMounted(() => {
  if (logoRef.value?.complete && logoRef.value?.naturalWidth) {
    onImageLoad()
  }
})

/**
 * 组件卸载时清理动画
 */
onUnmounted(() => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})

/**
 * 监听图片源变化，重新初始化
 */
watch(() => props.src, () => {
  imageLoaded.value = false
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
  }
})
</script>

