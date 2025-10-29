<template>
    <div class="w-full">        
        <div class="w-full h-[16.625rem] bg-[url('/static/convidar/share-url-bg.png')] bg-cover bg-center bg-[var(--color-bg-aside-2)] rounded-[.625rem] px-[.625rem] pt-[1.25rem]">
            <p class="text-left text-white text-[1.5rem] font-[700]">​​Compartilhar Informação​​</p>
            <p class="text-left text-white/40 text-[.875rem]">​​ID de Indicação​​: 0</p>
            <div class="rounded-[.375rem] w-full mt-[.625rem] h-[6.25rem] border border-[var(--color-border-1)] flex items-center p-[.25rem]">
                <div class="w-[5rem] px-[.5625rem]">
                    <div class="h-auto w-full bg-white rounded-[.25rem] flex items-center justify-center" v-html="qrCodeSvg"></div>
                    <p class="bg-[#5C82F5] flex items-center justify-center text-white text-[.65rem] h-[1.1875rem] rounded-b-[.375rem] cursor-pointer hover:brightness-[1.1]" @click="saveQRCode">Salvar</p>
                </div>
                <div class="w-[1px] h-full bg-white/20"></div>
                <div class="flex-1 px-[.75rem] h-full relative">
                    <p class="text-[var(--color-active)] text-[.75rem] text-left">{{ inviteUrl }}</p>
                    <div class="flex items-center justify-center absolute right-[.25rem] bottom-[.25rem] text-white text-[.65rem] rounded-[.375rem] bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] w-[4.875rem] h-[1.75rem] cursor-pointer hover:brightness-[1.1]" @click="copyInviteUrl">
                        <ion-icon class="text-[1rem] cursor-pointer mr-[.25rem]" name="copy-outline"></ion-icon>
                        Copiar​​
                    </div>
                </div>                
            </div>
            <div class="flex items-center mt-[.75em]">
                <div class=" gap-[.75rem] flex flex-nowrap items-center justify-start overflow-x-auto no-scrollbar py-[.5rem]">
                    <img 
                    v-for="item in plats"
                    class="w-[2.5rem] h-[2.5rem] flex-shrink-0 hover:opacity-80"
                    :src="'/static/invite/' + item" alt="">
                </div>
                <div class="w-[1px] h-[2.5rem] mx-[.75rem] bg-white/20"></div>
                <div class="w-[2.5rem] h-[2.5rem] flex-shrink-0 bg-[var(--color-active)] rounded-[100px] flex items-center justify-center text-white cursor-pointer" @click="shareInviteUrl">
                    <ion-icon class="w-[100%] text-[1.5rem]" name="share-social-sharp"></ion-icon>
                </div>                
            </div>

        </div>

        <div class="w-full bg-cover bg-center bg-[var(--color-bg-aside-2)] rounded-[.625rem] p-[.75rem] mt-[.9375rem]">
            <div class="flex items-center justify-between">
                <p class="text-white font-[600] text-[1rem] text-left flex items-center">
                    Comissão
                    <ion-icon class="ml-[.5rem] text-white/40 text-[1.15rem] cursor-pointer" name="information-circle-sharp" @click="openInfoMask"></ion-icon>
                </p>                
                <div class="flex items-center justify-center text-white text-[.65rem] rounded-[.375rem] bg-[var(--color-bg-aside)] border border-[var(--color-border-1)] w-[4.5625rem] h-[1.75rem] cursor-pointer hover:brightness-[1.1]">
                    <ion-icon class="text-[1rem] cursor-pointer mr-[.25rem]" name="reader"></ion-icon>                    
                    Detalhes
                </div>
            </div>
            <div class="bg-[url('/static/convidar/commission-amount-bg.png')] no-repeat bg-cover bg-center bg-[var(--color-bg-aside)] w-full h-[5rem] mt-[.8125rem] pl-[1.0625rem] flex items-center rounded-[.375rem]">
                <div>
                    <p class="text-white font-[400] text-[.75rem] text-left">Comissão Recebida</p>
                    <p class="font-[700] text-[1.5rem] text-[var(--color-warning)] text-left">R$ 0,00</p>
                </div>
            </div>
            <div class="flex items-center justify-between mt-[.6875rem] h-[2.7rem]">
                <p class="text-white/40 text-[.75rem] text-left">
                    ​​Comissão de Hoje​​: <span class="text-[var(--color-warning)] font-[600]">R$0,00</span>
                </p>
                <div class="h-[1.875rem] text-[.875rem] text-white font-[700] flex items-center justify-center px-[.75rem] rounded-[.1rem] bg-[var(--color-active)] cursor-pointer hover:brightness-[1.1] opacity-40">
                    Receber
                </div>
            </div>
        </div>


        <div class="w-full bg-cover bg-center bg-[var(--color-bg-aside-2)] rounded-[.625rem] p-[.75rem] mt-[.9375rem]">
            <div class="flex items-center rounded-[.375rem] p-[.25rem] relative bg-[var(--color-main-bg)]">
                <!-- 滑动背景 -->
                <div class="absolute top-[.25rem] bottom-[.25rem] bg-[var(--color-bg-aside)] rounded-[.25rem] transition-all duration-300 ease-in-out"
                     :style="{ left: sliderPosition + 'px', width: sliderWidth + 'px' }"></div>                
                <!-- 导航选项 -->
                <div 
                    v-for="(tab, index) in navTabs" 
                    :key="tab.id"
                    class="flex-1 relative z-10 cursor-pointer">
                    <div 
                        @click="switchTab(index)"
                        :class="['w-full py-[.5rem] text-[.875rem] font-[500] transition-colors duration-300', 
                                activeTab === index ? 'text-white' : 'text-white/60']"
                        ref="tabRefs">
                        {{ tab.label }}
                    </div>
                </div>
            </div>
            <div class="w-full mt-[1.5rem]">
                <div class="flex w-full flex items-center">
                    <div class="w-[1.5rem] h-[1.5rem] bg-white/40" style="-webkit-mask:url('/static/convidar/icon-team.svg') no-repeat center/contain;mask:url('/static/convidar/icon-team.svg') no-repeat center/contain;"></div>
                    <P class="text-white mx-[.375rem] text-[.875rem] font-[600] text-left">
                        Total de Membros da Equipe
                        <span class="text-[var(--color-active)]">0</span>
                    </P>
                </div>
                <div class="flex items-center rounded-[.375rem] bg-[var(--color-main-bg)] gap-[.1rem] mt-[.5rem]">
                    <div class="flex-1 p-[.625rem] h-[3.875rem] bg-[var(--color-bg-aside)] rounded-[.2rem]">
                        <p class="text-white/20 text-[.625rem]">Subordinados Diretos</p>
                        <p class="text-white/40 text-[1.125rem]">0</p>
                    </div>
                    <div class="flex-1 p-[.625rem] h-[3.875rem] bg-[var(--color-bg-aside)] rounded-[.2rem]">
                        <p class="text-white/20 text-[.625rem]">Subordinados Diretos</p>
                        <p class="text-white/40 text-[1.125rem]">0</p>
                    </div>
                </div>
            </div>

            <div class="w-full mt-[1.5rem]">
                <div class="flex w-full flex items-center">
                    <div class="w-[1.5rem] h-[1.5rem] bg-white/40" style="-webkit-mask:url('/static/convidar/icon-trophy-CL.svg') no-repeat center/contain;mask:url('/static/convidar/icon-trophy-CL.svg') no-repeat center/contain;"></div>
                    <P class="text-white mx-[.375rem] text-[.875rem] font-[600] text-left">
                        Rendimento Total
                        <span class="text-[var(--color-active)]">0,00</span>
                    </P>
                </div>
                <div class="flex items-center rounded-[.375rem] bg-[var(--color-main-bg)] gap-[.1rem] mt-[.5rem]">
                    <div class="flex-1 p-[.625rem] h-[3.875rem] bg-[var(--color-bg-aside)] rounded-[.2rem]">
                        <p class="text-white/20 text-[.625rem]">Subordinados Diretos</p>
                        <p class="text-white/40 text-[1.125rem]">0</p>
                    </div>
                    <div class="flex-1 p-[.625rem] h-[3.875rem] bg-[var(--color-bg-aside)] rounded-[.2rem]">
                        <p class="text-white/20 text-[.625rem]">Subordinados Diretos</p>
                        <p class="text-white/40 text-[1.125rem]">0</p>
                    </div>
                </div>
            </div>

            <div class="w-full mt-[1.5rem]">
                <div class="flex w-full flex items-center">
                    <div class="w-[1.5rem] h-[1.5rem] bg-white/40" style="-webkit-mask:url('/static/convidar/icon-coins.svg') no-repeat center/contain;mask:url('/static/convidar/icon-coins.svg') no-repeat center/contain;"></div>
                    <P class="text-white mx-[.375rem] text-[.875rem] font-[600] text-left">
                        Comissão Total
                        <span class="text-[var(--color-active)]">0,00</span>
                    </P>
                </div>
                <div class="flex items-center rounded-[.375rem] bg-[var(--color-main-bg)] gap-[.1rem] mt-[.5rem]">
                    <div class="flex-1 p-[.625rem] h-[3.875rem] bg-[var(--color-bg-aside)] rounded-[.2rem]">
                        <p class="text-white/20 text-[.625rem]">Comissão Direta</p>
                        <p class="text-white/40 text-[1.125rem]">0</p>
                    </div>
                    <div class="flex-1 p-[.625rem] h-[3.875rem] bg-[var(--color-bg-aside)] rounded-[.2rem]">
                        <p class="text-white/20 text-[.625rem]">Comissão Indireta​</p>
                        <p class="text-white/40 text-[1.125rem]">0</p>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Info Mask -->
        <div v-if="infoMaskVisible" class="fixed inset-0 z-[100] bg-black/40" @click.self="closeInfoMask">
            <div class="absolute bg-[var(--color-bg-aside-2)] text-white/40 rounded-[.5rem] shadow-[0_6px_20px_rgba(0,0,0,0.35)] px-[.875rem] py-[.75rem] max-w-[22rem]" 
                 :style="{ top: tooltipPosition.top + 'px', left: tooltipPosition.left + 'px' }">
                <p class="text-[.75rem] text-left leading-[1.25rem]">O tempo de resolução da comissão é de 4:00-8:00 todos os dias.</p>                
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import QRCode from 'qrcode'

// 邀请链接
const inviteUrl = ref('https://58ff2.com/?pid=1867190766')
const qrCodeSvg = ref('')
const plats = ref([
    'email.svg',
    'youtube.svg',
    'kwai.svg',
    'twitter.svg',
    'whatsapp.svg',
    'tiktok.svg',
    'instagram.svg',
    'telegram.svg',
    'facebook.svg'
])

// 导航相关状态
const activeTab = ref(0)
const sliderPosition = ref(4)
const sliderWidth = ref(0)
const tabRefs = ref<HTMLElement[]>([])

// 导航选项数据
const navTabs = ref([
    { id: 0, label: 'Dados De Hoje' },
    { id: 1, label: 'Total Geral' }
])
// 生成二维码SVG
const generateQRCode = async () => {
    try {
        const svgString = await QRCode.toString(inviteUrl.value, {
            type: 'svg',
            width: 200,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })
        qrCodeSvg.value = svgString
    } catch (error) {
        console.error('生成二维码失败:', error)
    }
}

// 复制邀请链接
const copyInviteUrl = async () => {
    const text = inviteUrl.value
    try {
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(text)
        } else {
            const textarea = document.createElement('textarea')
            textarea.value = text
            textarea.style.position = 'fixed'
            textarea.style.top = '0'
            textarea.style.left = '0'
            textarea.style.opacity = '0'
            document.body.appendChild(textarea)
            textarea.focus()
            textarea.select()
            document.execCommand('copy')
            document.body.removeChild(textarea)
        }
        window.showToast?.('Cópia Bem-sucedida')
        console.log('Copied to clipboard:', text)
    } catch (err) {
        window.showToast?.('Cópia Falhou')
        console.error('Copy failed:', err)
    }
}

// 保存二维码
const saveQRCode = async () => {
    try {
        // 生成canvas用于保存
        const canvas = document.createElement('canvas')
        await QRCode.toCanvas(canvas, inviteUrl.value, {
            width: 400,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        })
        
        const link = document.createElement('a')
        link.download = 'invite-qrcode.png'
        link.href = canvas.toDataURL()
        link.click()
        window.showToast?.('二维码保存成功')
    } catch (error) {
        window.showToast?.('二维码保存失败')
        console.error('保存二维码失败:', error)
    }
}

// 分享邀请链接
const shareInviteUrl = async () => {
    try {
        if (navigator.share) {
            // 使用原生分享API
            await navigator.share({
                title: 'invite Link',
                text: 'invite Link',
                url: inviteUrl.value
            })            
        } else { 
            // 降级到复制链接
            await copyInviteUrl()
        }
    } catch (error) {       
    }
}

// Info mask state & actions
// Info mask
const infoMaskVisible = ref(false)
const tooltipPosition = ref({ top: 0, left: 0 })

const openInfoMask = (event: Event) => { 
    const target = event.target as HTMLElement
    const rect = target.getBoundingClientRect()
    
    // 计算提示框位置，让它出现在图标右侧
    tooltipPosition.value = {
        top: rect.top + window.scrollY - 10, // 稍微向上偏移
        left: rect.right + window.scrollX + 10 // 图标右侧10px
    }
    
    infoMaskVisible.value = true 
}
const closeInfoMask = () => {
    infoMaskVisible.value = false
}

// 导航切换函数
const switchTab = (index: number) => {
    activeTab.value = index
    updateSliderPosition()
}

// 更新滑块位置
const updateSliderPosition = () => {
    const currentTab = tabRefs.value[activeTab.value]
    if (currentTab) {
        const tabElement = currentTab as HTMLElement
        // 获取导航容器 (包含所有导航项的父容器)
        const containerElement = tabElement.parentElement?.parentElement
        if (containerElement) {
            const containerRect = containerElement.getBoundingClientRect()
            const tabRect = tabElement.getBoundingClientRect()
            
            // 计算相对于容器的位置
            sliderPosition.value = tabRect.left - containerRect.left
            sliderWidth.value = tabRect.width
        }
    }
}

// 初始化滑块位置
const initSlider = () => {
    nextTick(() => {
        updateSliderPosition()
    })
}

onMounted(() => {
    generateQRCode()
    initSlider()
})
</script>
<style lang="css" scoped>
/* SVG二维码自动适应容器大小 */
:deep(svg) {
    width: 100%;
    height: 100%;
}

/* 隐藏横向滚动条 */
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
</style>