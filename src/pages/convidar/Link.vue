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
    </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
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

onMounted(() => {
    generateQRCode()
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