<template>
    <div class="p-[.75rem]">
        <div class="flex items-center py-[.65rem] gap-[.65rem]">
            <div>
                <p class="text-[.75rem] text-white text-left">
                    Pode ser coletado hoje：
                </p>
                <p class="text-[.75rem] text-[var(--color-warning)] text-left">0,00</p>
            </div>
            <div>
                <p class="text-[.75rem] text-white text-left">
                    Disponível para coleta amanhã：
                </p>
                <p class="text-[.75rem] text-[var(--color-warning)] text-left">0,00</p>
            </div>
        </div>
        <div class="flex gap-[.75rem]">
            <div class="w-[4.1rem]">
                <div class="mb-[.625rem] w-full py-[.125rem] bg-[var(--color-bg-aside)] rounded-[.315rem]">
                    <div class="w-[2.25rem] h-[2.25rem] bg-[var(--color-active)] mx-auto" style="-webkit-mask:url('/static/promo/seven.svg') no-repeat center/contain;mask:url('/static/promo/seven.svg') no-repeat center/contain;"></div>
                    <p class="text-white text-[600] text-[.75rem]">Slot</p>
                </div>
                <div class="bg-[var(--color-active)] mt-[.75rem] flex items-center justify-center h-[1.625rem] w-full rounded-[.315rem]">
                    <p class="cursor-pointer text-[.875rem] text-white font-[700] opacity-[.4]">Receber</p>
                </div>
                <div class="hover:brightness-110 transition-all bg-[var(--color-active)] mt-[.75rem] flex items-center justify-center h-[1.625rem] w-full rounded-[.315rem]">
                    <p class="cursor-pointer text-[.875rem] text-white font-[700]">Histórico</p>
                </div>
            </div>    
            <div class="flex-1">
                <div 
                v-for="item in 10"
                class="h-[3.75rem] rounded-[.315rem] bg-[var(--color-bg-aside-2)] flex hover:brightness-110 cursor-pointer justify-between p-[.25rem] mb-[.75rem]">
                    <div class="w-[1.5rem] h-[1.5rem] bg-white/40 mx-auto" style="-webkit-mask:url('/static/promo/pg.svg') no-repeat center/contain;mask:url('/static/promo/pg.svg') no-repeat center/contain;"></div>
                    <div class="flex-1 px-[.25rem]">
                        <div class="flex items-center justify-between h-[1.3rem]">
                            <p class="text-white/40 text-[.625rem] text-left">
                                Aposta
                                <span class="font-[600] text-white">0,00</span>
                            </p>
                            <p class="text-white/40 text-[.625rem] text-left">
                                Taxa de reembolso
                                <span class="font-[600] text-white">0%</span>
                            </p>                            
                        </div>
                        <div class="flex items-center justify-between h-[1.3rem]">
                            <p class="text-white/40 text-[.625rem] text-left">
                                Aposte 1,00 para receber 0.4%                                
                            </p>
                            <p class="text-white/40 text-[.625rem] text-left">
                                Coletável
                                <span class="font-[600] text-[var(--color-warning)]">0,00</span>
                            </p>                            
                        </div>
                        <div class="releative w-[50%] h-[.25rem] bg-black/20 rounded-[100px] mt-[.25rem]">
                            <div class="w-[20%] h-full bg-[var(--color-active)] rounded-[100px]"></div>
                        </div>
                    </div>
                    <div class="h-full flex items-center justify-center">
                        <ion-icon class="w-[1rem] h-[1rem] text-white/40" name="chevron-forward-outline"></ion-icon>
                    </div>
                </div>
            </div>        
        </div>
    </div>
</template>
<script setup lang="ts">

</script>
<style scoped>

</style>
