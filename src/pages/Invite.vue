<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <NavBar :canReturn="true" :title="'Indique amigos para receber um bônus'">
          <template #right>
            <div class="p-[.6rem] flex items-center justify-center">
                <ion-icon name="receipt-outline" class="text-white text-[1rem]"></ion-icon>
            </div>
          </template>
        </NavBar>
        <div class="p-[.75rem] w-full">
            <div class="w-full rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] py-[0]">
                <div class="flex items-center justify-between h-[2.35rem] border-b border-[var(--color-border-2)]">
                    <p class="text-white text-[.75rem]">
                        Meu link:
                        <span class="text-[var(--color-text-link)]">{{ appUrl }}</span>
                    </p>
                    <div class="flex items-center justify-center w-[3.25rem] h-[1.75rem] hover:bg-white/5 rounded-[.375rem] cursor-pointer" @click="copyAppUrl">
                        <ion-icon class="text-white text-[1rem]" name="copy-outline"></ion-icon>
                    </div>
                </div>
                <p class="text-left text-white text-[.75rem] mt-[.5rem]">Compartilhamento Rápido</p>
                <div class="mt-[.2rem] gap-[.39rem] flex flex-nowrap items-center justify-start overflow-x-auto no-scrollbar py-[.5rem] border-b border-[var(--color-border-2)]">
                    <img 
                    v-for="item in plats"
                    class="w-[2.25rem] h-[2.25rem] flex-shrink-0 hover:opacity-80"
                    :src="'/static/invite/' + item" alt="">
                </div>
                <div class="py-[1.25rem] flex items-center justify-between">
                    <p class="text-white text-[.75rem] text-left">
                        Meus subordinados diretos 
                        <span class="text-[#53C154]">0Pessoa</span>
                        <br />
                         (Válido 0Pessoa)
                    </p>
                    <p class="text-[var(--color-text-link)] text-[.75rem]">
                        Detalhes >
                    </p>

                </div>
            </div>

            <div class="mt-[1rem] w-full rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] flex-wrap flex">
                <div 
                v-for="(item, index) in 21"
                class="relative flex justify-between items-center mb-[.625rem]" :class="(index + 1) % 4 === 0 ? 'w-[calc(25%_-_1rem)] grow-0' : 'w-[25%] grow'">
                    <div class="relative w-[4.25rem]">
                        <img class="w-[4.25rem]" src="/static/invite/treasureBoxClose.png" alt=""></img>
                        <p class="text-[.6875rem] absolute top-[2.56rem] text-center left-0 right-0 font-[700] text-white" style="text-shadow: -1px -1px 1px red, 1px -1px 1px red, -1px 1px 1px red, 1px 1px 1px red;">51,50</p>
                        <p class="text-white mt-[.625rem] text-[.65rem] leading-[.9rem]">
                            Promoção <span>1</span>
                            <br />
                            Pessoa
                        </p>
                    </div>
                    <ion-icon v-if="(index + 1) % 4 !== 0" class="text-white translate-y-[-1rem]" name="chevron-forward-outline"></ion-icon>
                </div>
            </div>

            <div class="rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] mt-[1rem]">
                <p class="text-[.75rem] pb-[.25rem] font-[700] text-white/40 border-b border-[var(--color-border-2)] text-left">
                    O que é o número de promoção efetiva? (Preenchendo as seguintes condições)
                </p>
                <div class="py-[.25rem] flex items-center justify-between border-b border-[var(--color-border-2)]">
                    <p class="text-white text-[.75rem] text-left">
                        Depositos acumulados do                     
                        <br />
                            subordinado
                    </p>
                    <p class="text-[var(--color-text-link)] text-[.75rem]">
                        ≥10,00
                    </p>

                </div>
                <div class="py-[.25rem] flex items-center justify-between">
                    
                    <p class="text-white text-[.75rem] text-left">
                        Depositos acumulados do                     
                        <br />
                            subordinado
                    </p>
                    <p class="text-[var(--color-text-link)] text-[.75rem]">
                        ≥10,00
                    </p>

                </div>
            </div>

            <div class="rounded-[.375rem] bg-[var(--color-tabbar)] p-[.75rem] mt-[1rem]">
                <p class="text-white text-[1rem] font-[700] text-left">Regras do evento</p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    1. Convide amigos para reivindicar bônus. Quanto mais pessoas você convidar, mais bônus você receberá;
                </p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    2. Os bônus precisam ser reivindicados manualmente. Após a expiração, os bônus serão distribuídos automaticamente e podem ser aproveitados junto com bônus e comissões de outros agentes;
                </p>
                
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    3. Os bônus (excluindo o principal) exigem 0 vezes de apostas válidas para serem sacados;
                </p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    4. Somente o proprietário da conta pode realizar operações manuais normais, caso contrário, o bônus será cancelado ou deduzido, congelado ou até mesmo colocado na lista negra;
                </p>
                <p class="mt-[1rem] w-full text-white/40 text-[.75rem] text-left">
                    5. Para evitar diferenças na compreensão do texto, a plataforma se reserva o direito final de interpretação desta atividade.
                </p>
            </div>
        </div>
    </div>
    
</template>

<script setup lang="ts">
import {ref} from 'vue'
const appUrl = ref('https://' + import.meta.env.VITE_APP_NAME)
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
const copyAppUrl = async () => {
  const text = appUrl.value
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
+   window.showToast?.('Cópia Bem-sucedida')
    console.log('Copied to clipboard:', text)
  } catch (err) {
    console.error('Copy failed:', err)
  }
}
</script>
<style scoped>
/* 页面特定样式 */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
