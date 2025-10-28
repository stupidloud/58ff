<template>
    <div class="min-h-screen bg-[var(--color-main-bg)]">
        <NavBar :canReturn="true" :title="'Senha de Saque'"></NavBar>        
        <div class="p-[.75rem] pt-[3.9375rem]">
            <div class="mx-auto w-[3.4375rem] h-[3.4375rem] rounded-[1000px] bg-[#53C154] flex items-center justify-center">
                <img class="w-[60%] h-auto" src="/static/success.svg" alt=""></img>                        
            </div>
            <p class="py-[.9375rem] text-white text-[.875rem] font-[500]">
                Configurado com sucesso
            </p>
            <p class="text-left text-[var(--color-warning)] text-[.875rem]">
                Nueva contraseña establecida correctamente, recuerde su contraseña
            </p>
            <div class="flex items-center justify-between mt-[1rem] gap-[1rem]">
                <div       
                @click="router.push('/')"             
                class="text-white text-[.875rem] font-[700] bg-[var(--color-bg-aside)] flex-1 h-[2.86rem] flex items-center justify-center hover:brightness-[1.1] cursor-pointer rounded-[.375rem]">
                    Retornar à página <br/>inicial
                </div>
                <div                    
                class="text-white text-[.875rem] font-[700] bg-[var(--color-active)] flex-1 h-[2.86rem] flex items-center justify-center hover:brightness-[1.1] cursor-pointer  rounded-[.375rem]">
                    Confirmar
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
</script>
<style lang="css" scoped></style>