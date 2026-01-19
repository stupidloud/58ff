<template>
  <div class="fullPage bg-[var(--color-main-bg)] pb-[20px]">
    <!-- 头部 -->
    <div class="w-full h-auto sticky top-0 z-10">
      <!-- 下载模块 -->
      <div v-if="showInstallCTA" class="bg-[var(--color-main-bg)] flex items-center w-full overflow-hidden relative h-[3.125rem] px-[.75rem]">
        <div
          class="absolute top-[-.2rem] left-[.1rem] w-[3.6rem] h-[3.6rem] bg-[rgba(255,255,255,0.1)] transform -translate-x-1/2 -translate-y-1/2 rounded-[100px]">
        </div>
        <div class="absolute top-[.25rem] left-[.25rem] text-[.875rem] text-white cursor-pointer" @click="showInstallCTA = false" role="button" aria-label="Fechar">
          <svg fill="currentColor" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <path
              d="M289.94 256l95-95A24 24 0 00351 127l-95 95-95-95a24 24 0 00-34 34l95 95-95 95a24 24 0 1034 34l95-95 95 95a24 24 0 0034-34z">
            </path>
          </svg>
        </div>
        <div class="ml-[2rem] flex items-center">
          <img src="/icon-512.png" alt="" class="w-[2rem] h-[2rem]" />
          <div class="text-left mx-[.438rem]">
            <p class="text-white text-[.75rem]">Baixe Nosso APP,</p>
            <p class="text-white text-[.75rem]">Ganhe Super Prêmios!</p>
          </div>
          <img src="/static/pwa-money.png" alt="" class="w-[1.75rem] h-[1.75rem]" />
        </div>
        <div          
          class="w-[6.75rem] h-[2.125rem] flex items-center justify-between ml-auto rounded-[.467rem] py-[.5rem] px-[.625rem] bg-[linear-gradient(90deg,rgb(195,60,80)_-27.5%,rgb(196,228,94)_127.5%)] cursor-pointer"
          @click="onInstallClick"
          role="button"
          aria-label="Instalar PWA">
          <div class="text-white">
            <svg width="1.65rem" height="1.65rem" viewBox="0 0 25 24" fill="currentColor"
              xmlns="http://www.w3.org/2000/svg" class="s-ion-icon">
              <g clip-path="url(#clip0_502_13255)">
                <path
                  d="M23.6118 10.3906C23.3312 9.72736 22.9302 9.13214 22.4197 8.62168C21.9092 8.11114 21.314 7.70996 20.6508 7.4295C20.4843 7.35915 20.3146 7.29687 20.1422 7.24287C19.6181 6.03582 18.8112 4.956 17.7849 4.10944C17.0519 3.5048 16.2292 3.03312 15.3398 2.70757C14.4189 2.37057 13.4515 2.19971 12.4645 2.19971C11.4856 2.19971 10.5258 2.36787 9.61162 2.69951C8.72859 3.01988 7.91048 3.48436 7.18012 4.08C6.12426 4.94131 5.29602 6.0503 4.76643 7.29157C3.94401 7.59082 3.19473 8.06051 2.5762 8.67425C1.50684 9.73526 0.917969 11.1286 0.917969 12.5975C0.917969 13.392 1.08817 14.1616 1.42396 14.8852C1.74037 15.5669 2.18896 16.1751 2.75704 16.6928C3.59348 17.4551 4.62728 17.9616 5.74532 18.1717C5.85317 18.2058 5.96539 18.2241 6.07848 18.2261C6.07973 18.2263 6.08085 18.2265 6.08228 18.2267V18.2262C6.08859 18.2263 6.09491 18.2267 6.10122 18.2267C6.74978 18.2267 7.27553 17.7009 7.27553 17.0522C7.27553 16.4036 6.74973 15.8779 6.10122 15.8779C6.09491 15.8779 6.08856 15.8783 6.08228 15.8784V15.8363C4.47236 15.4889 3.27454 14.1707 3.27454 12.5975C3.27454 10.8618 4.73259 9.43664 6.59334 9.28299C7.18066 6.58046 9.58602 4.55625 12.4646 4.55625C15.3672 4.55625 17.7891 6.61439 18.3506 9.35096C18.3948 9.34885 18.439 9.3477 18.4832 9.34751C20.2564 9.34751 21.6938 10.785 21.6938 12.5582C21.6938 14.1948 20.4689 15.5444 18.8861 15.7427V15.7605C18.2462 15.7707 17.7306 16.2921 17.7306 16.9343C17.7306 17.5767 18.2462 18.0981 18.8861 18.1084V18.1108C18.8951 18.1103 18.9043 18.1094 18.9135 18.1086C18.9808 18.1081 19.048 18.1018 19.1143 18.0898C19.6432 18.0302 20.1607 17.8945 20.6508 17.6869C21.3141 17.4063 21.9092 17.0052 22.4197 16.4948C22.9302 15.9842 23.3313 15.3891 23.6119 14.7258C23.9027 14.038 24.0503 13.3087 24.0503 12.5582C24.0503 11.8077 23.9027 11.0783 23.6118 10.3906V10.3906Z"
                  fill="currentColor"></path>
                <path
                  d="M8.36257 18.3137L11.5115 21.4626C11.741 21.6921 12.048 21.8 12.3503 21.7861C12.6527 21.8 12.9596 21.6923 13.1892 21.4626L16.3381 18.3137C16.7711 17.8807 16.7711 17.1722 16.3381 16.7391C15.9052 16.3063 15.1967 16.3063 14.7636 16.7391L13.5166 17.9862V12.7223C13.5166 12.11 13.0157 11.6089 12.4033 11.6089C11.7909 11.6089 11.29 12.11 11.29 12.7223V18.0661C11.29 18.0752 11.2905 18.0841 11.2906 18.0928L9.93698 16.7391C9.50405 16.3063 8.79555 16.3063 8.36254 16.7391C7.92961 17.1722 7.92961 17.8807 8.36254 18.3137L8.36257 18.3137Z"
                  fill="currentColor"></path>
              </g>
              <defs>
                <clipPath id="clip0_502_13255">
                  <rect width="24" height="24" fill="currentColor" transform="translate(0.5)"></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
          <p class="text-white text-[.75rem] font-[700]">Instalar</p>
        </div>
      </div>
      <!-- header -->
      <div class="flex h-[3.125rem] items-center px-[.75rem] bg-[var(--color-tabbar)]">
        <div class="text-white text-[1rem] cursor-pointer" @click="isSidebarOpen = true">
          <svg width="1rem" height="1rem" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"
            class="transform scale-x-[-1]">
            <g>
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M1 0.212128C0.447715 0.212128 0 0.659843 0 1.21213C0 1.76441 0.447715 2.21213 1 2.21213H15C15.5523 2.21213 16 1.76441 16 1.21213C16 0.659843 15.5523 0.212128 15 0.212128H1ZM1 13.7879C0.447715 13.7879 0 14.2356 0 14.7879C0 15.3402 0.447715 15.7879 1 15.7879H15C15.5523 15.7879 16 15.3402 16 14.7879C16 14.2356 15.5523 13.7879 15 13.7879H1ZM5.53685 6.15337C5.53685 5.40141 4.73809 4.91849 4.07223 5.26786L0.552756 7.1145C-0.161084 7.48904 -0.161086 8.51097 0.552755 8.88552L4.07223 10.7322C4.73809 11.0815 5.53685 10.5986 5.53685 9.84665V6.15337ZM8.495 7.00003C7.94271 7.00003 7.495 7.44775 7.495 8.00003C7.495 8.55232 7.94271 9.00003 8.495 9.00003H15C15.5523 9.00003 16 8.55232 16 8.00003C16 7.44775 15.5523 7.00003 15 7.00003H8.495Z"
                fill="currentColor"></path>
            </g>
          </svg>
        </div>
        <img class="w-[7.5rem] h-auto ml-[1rem]" src="/variable/logo.png" alt="" />
        <div v-if="!auth.isLoggedIn" class="ml-auto flex items-center justify-between gap-[.5rem]">
          <div
            class="hover:brightness-120 transition-all duration-50 w-[4.69rem] h-[2.15rem] rounded-[.375rem] font-[700] text-[.875rem] cursor-pointer bg-[linear-gradient(90deg,rgb(55,35,128)_-27.5%,rgb(110,95,162)_127.5%)] text-[var(--color-highlight)] flex items-center justify-center"
            @click="loginDefaultMode = 'login'; isLoginOpen = true">
            Entrar
          </div>
          <div
            class="hover:brightness-120 transition-all duration-50 w-[4.69rem] h-[2.15rem] rounded-[.375rem] font-[700] text-[.875rem] cursor-pointer bg-[linear-gradient(90deg,rgb(214,66,88)_-27.5%,rgb(214,66,88)_127.5%)] text-white flex items-center justify-center"
            @click="loginDefaultMode = 'register'; isLoginOpen = true">
            Registro
          </div>
        </div>
        <div 
        class="flex items-center flex-1 justify-end"
        v-else>
          <img class="w-[1.25rem] h-auto mr-[.3215rem]" src="/static/withdraw.png" alt="">
          <p class="text-shadow-[var(--currency-shadow,0_0_.625rem_var(--color-active))] text-white mr-[.25rem] text-[.75rem] font-[700]">R$ {{ balanceDisplay }}</p>
          <div class="ml-[0.375rem] rounded-[0.375rem] border-[0.0625rem] border-[var(--color-highlight)] px-[0.5rem] py-[0.375rem] shadow-[inset_0_0_0.5563rem_0_var(--color-highlight)] cursor-pointer">
            <div class="w-[1rem] h-[1rem] bg-[var(--color-highlight)] bg-no-repeat bg-contain mask-[url('/static/pig.svg')] mask-center animate-pig-elastic-bounce will-change-transform"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- banner区域 -->
    <div class="w-full mt-[.75rem] px-[.75rem]">
      <div class="rounded-[.467rem] overflow-hidden">
        <Swiper :modules="[Autoplay]" :slides-per-view="1" :loop="true"
          :autoplay="{ delay: 3000, disableOnInteraction: false }" class="w-full">
          <SwiperSlide v-for="(src, i) in images" :key="i">
            <img :src="src" alt="" class="w-full h-auto" loading="lazy" />
          </SwiperSlide>
        </Swiper>
      </div>
    </div>

    <!-- 礼物区域 -->
    <div class="flex justify-between px-[.75rem] mt-[.75rem]">
      <div class="rounded-[.875rem] w-[11rem] overflow-hidden animate-float-1 cursor-pointer" @click="router.push('/invite')">
        <img class="w-full h-auto" src="/static/gift1.gif" alt="" />
      </div>
      <div class="flex flex-col items-center justify-between">
        <div class="rounded-[.875rem] w-[11rem] overflow-hidden animate-float-2 cursor-pointer" @click="router.push('/promo/event/missao')">
          <img class="w-full h-auto" src="/static/gift2.gif" alt="" />
        </div>
        <div class="rounded-[.875rem] w-[11rem] overflow-hidden animate-float-3 cursor-pointer" @click="router.push('/promo/event/turntable')">
          <img class="w-full h-auto" src="/static/gift3.gif" alt="" />
        </div>
      </div>
    </div>

    <!-- 通知 -->
    <div class="flex mt-[1.56rem] px-[.75rem] items-center">
      <div
        class="relative flex items-center px-[.5rem] flex-1 rounded-[.875rem] h-[2.5rem] bg-[linear-gradient(270deg,rgb(152,47,62)_0%,rgb(90,28,37)_100%)] overflow-hidden">
        <img class="w-1.5rem h-auto" src="/static/broadcast.png" alt="" />
        <div class="marquee w-full ml-[.5rem]">
          <div class="marquee-track">
            <span
              v-for="(text, i) in marqueeTexts"
              :key="i"
              class="whitespace-nowrap font-[600] text-[.875rem] text-[var(--color-highlight)]"
            >
              {{ text }}
            </span>
          </div>
        </div>
        <!-- <p class="bg-[var(--color-active)] px-[.5rem] py-[.25rem] rounded-[.5rem] font-[600] text-[.75rem] text-white">
          7
        </p> -->
      </div>
      <div
        class="ml-[.625rem] w-[2.5rem] h-[2.5rem] rounded-[.875rem] flex items-center text-white justify-center border border-[#4a3695] bg-[#372380]">
        <ion-icon name="search-outline" class="text-white text-[2rem]"></ion-icon>
      </div>
    </div>

    <!-- 游戏tape -->
    <div class="px-[.75rem] mt-[1rem] mb-[.5rem]">
      <div class="w-full overflow-x-auto hide-scrollbar rounded-[.875rem]">
        <div class="flex flex-nowrap gap-[.625rem] w-max">
          <div
            class="w-[4.25rem] h-[5.375rem] px-[.25rem] pt-[.4375rem] bg-cover bg-center border-[.0625rem] rounded-[.875rem] cursor-pointer"
            :class="selectedTape === 'popular' ? 'bg-[url(/static/tab-act-bg.png)] border-[#D64258]' : 'bg-[var(--color-tabbar)] border-[#D64258]'"
            @click="selectedTape = 'popular'"
            role="button"
            :aria-pressed="selectedTape === 'popular'">
            <div
              class="w-[2.25rem] h-[2.25rem] rounded-[9999px] bg-[var(--color-main-bg)] m-auto flex justify-center items-center">
              <img class="w-[1.2rem] h-[1.2rem]" src="/static/game_type_1.svg" alt="">
            </div>
            <p class="text-center text-white text-[.875rem] font-[600]">
              Popular
            </p>
            <p class="text-center text-[#FFFFFF66] text-[.625rem] font-[400]">
              {{ popularCount }} games
            </p>
          </div>
          <div v-for="provider in providers" :key="provider.id"
            class="w-[4.25rem] h-[5.375rem] px-[.25rem] pt-[.4375rem] border-[.0625rem] rounded-[.875rem] hover:opacity-80 transition-opacity duration-200 flex-shrink-0 cursor-pointer"
            :class="selectedTape === provider.id ? 'bg-[url(/static/tab-act-bg.png)] border-[#D64258]' : 'bg-[var(--color-tabbar)] border-[#D64258]'"
            @click="selectedTape = provider.id"
            role="button"
            :aria-pressed="selectedTape === provider.id">
            <div
              class="w-[2.25rem] h-[2.25rem] rounded-[9999px] bg-[var(--color-main-bg)] m-auto flex justify-center items-center">
              <img class="w-[1.2rem] h-[1.2rem]" :src="provider.image" :alt="provider.name">
            </div>
            <p class="text-center text-white text-[.875rem] font-[600] truncate">
              {{ provider.name }}
            </p>
            <p class="text-center text-[#FFFFFF66] text-[.625rem] font-[400]">
              {{ providerCounts.get(provider.id) || 0 }} games
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="px-[.75rem]">
      <div v-if="gamesLoading" class="p-[1rem] text-center">
        <div class="text-white/60 text-[1rem]">Carregando jogos...</div>
      </div>
      <div v-else-if="gamesError" class="p-[1rem] text-center">
        <div class="text-[#E84F46] text-[1rem]">{{ gamesError }}</div>
      </div>
      <div v-else>
        <div class="flex justify-between items-center px-[.75rem] mt-[1.75rem] mb-[.9375rem]">
          <div class="flex items-center">
            <p class="text-white text-[1.125rem] font-[700] ml-[.3125rem]">
              {{ displayedTitle }}
            </p>
          </div>
          <div class="flex items-center">
            <p class="text-white text-[.75rem] font-[600]">Todos</p>
            <p class="text-[.75rem] font-[700] py-[.125rem] px-[.625rem] rounded-[.625rem] ml-[.375rem] text-[#D64258] bg-[linear-gradient(90deg,#372380_0%,#982F3E_100%)] shadow-[-0.0625rem_0_0_0_#D64258]">
              {{ displayedTotal }}
            </p>
          </div>
        </div>
        <div class="flex gap-[.75rem] flex-wrap px-[.75rem]">
          <div class="relative w-[calc(25%-0.5625rem)] rounded-[12.5%_/_9.25%] overflow-hidden cursor-pointer" v-for="game in displayedGames" :key="game.id" @click="launchGame(game.id)">
            <img :src="game.image" :alt="game.name" />
            <div class="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-[.75rem] px-[.375rem] py-[.25rem] truncate">
              {{ game.name }}
            </div>
          </div>
        </div>
        <div @click="loadMore">
          <p class="text-white text-[.75rem] text-center w-full mt-[1rem]">
          A exibir {{ displayedCount }} jogos entre {{ displayedTotal }} {{ displayedTitle }} jogos
        </p>
        <p
          v-if="displayedCount < displayedTotal"
          class="text-white text-[.75rem] w-full text-center flex items-center justify-center cursor-pointer"          
        >
          Carregar mais ⬇️          
        </p>
        </div>
      </div>
    </div>

    <!-- footer部分 -->
    <div class="text-[var(--color-active)] flex justify-center relative w-full mt-[4.5rem]">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 155 66"
        class="w-[9.625rem] h-[4.125rem]">
        <path fill="currentColor" fill-rule="evenodd"
          d="M17.545 0a5.588 5.588 0 0 1 1.232 4.605 5.806 5.806 0 0 1-2.75 3.973 5.587 5.587 0 0 1-1.233-4.604A5.81 5.81 0 0 1 17.544 0Zm-5.53 10.224a5.585 5.585 0 0 1-1.224 4.607 5.81 5.81 0 0 1-2.759-3.968 5.588 5.588 0 0 1 1.222-4.608 5.819 5.819 0 0 1 2.76 3.969ZM7.369 22.408c.725-1.408.83-3.132.133-4.748a6.01 6.01 0 0 0-3.608-3.304c-.725 1.408-.83 3.132-.132 4.747a6.004 6.004 0 0 0 3.607 3.305Zm11.71 28.01c4.017 2.97 8.875 5.141 14.273 6.161l-.155.731c-5.908-1.118-11.187-3.58-15.455-6.957.227.237.436.487.615.754-1.292.98-3.047 1.455-4.867 1.167-1.82-.288-3.316-1.278-4.2-2.602 1.292-.98 3.047-1.455 4.867-1.166a6.469 6.469 0 0 1 2.486.937 31.105 31.105 0 0 1-4.372-4.633c.16.28.3.569.406.87-1.502.658-3.325.724-5.02.035-1.694-.692-2.898-1.99-3.424-3.476 1.501-.658 3.326-.726 5.02-.035a6.26 6.26 0 0 1 2.257 1.561 27.701 27.701 0 0 1-3.12-5.858c.043.176.081.351.106.528a6.441 6.441 0 0 1-4.938-.857C2.03 36.6 1.106 35.11.884 33.558a6.437 6.437 0 0 1 4.938.857 5.975 5.975 0 0 1 2.2 2.477 25.303 25.303 0 0 1-1.298-6.566l-.001.073a3.804 3.804 0 0 1-.011.258 6.324 6.324 0 0 1-4.613-1.876C.84 27.506.29 25.86.439 24.3a6.324 6.324 0 0 1 4.612 1.876c.941.953 1.485 2.113 1.639 3.29l-.005-.147a14.75 14.75 0 0 1-.011-.516c0-9.694 5.672-18.547 14.481-23.9.494-1.311 1.54-2.462 3.075-3.115a6.895 6.895 0 0 1 5.134-.085c-.421 1.464-1.548 2.761-3.225 3.475-1.435.611-3 .656-4.417.284-1.668 1.002-3.243 2.11-4.665 3.35 1.235-.767 2.8-1.115 4.417-.86 1.818.288 3.315 1.278 4.2 2.602-1.293.98-3.049 1.455-4.868 1.167-1.794-.285-3.27-1.254-4.16-2.55a29.574 29.574 0 0 0-5.035 5.902c.889-1.277 2.35-2.232 4.124-2.516 1.818-.291 3.575.18 4.87 1.155-.882 1.326-2.377 2.32-4.195 2.612-1.815.29-3.569-.177-4.862-1.15a26.287 26.287 0 0 0-3.122 6.869c.628-1.253 1.76-2.31 3.262-2.89 1.707-.66 3.531-.561 5.019.124-.555 1.475-1.784 2.754-3.493 3.412-1.68.65-3.47.561-4.944-.095-.53 2.009-.81 4.09-.81 6.209 0 .527.037 1.048.074 1.57l.008.103c-.022-1.552.644-3.14 1.98-4.32a6.365 6.365 0 0 1 4.737-1.571c.036 1.565-.633 3.173-1.981 4.364a6.358 6.358 0 0 1-4.735 1.571 24.759 24.759 0 0 0 1.681 7.377c-.32-1.46-.03-3.068.952-4.442a6.202 6.202 0 0 1 4.25-2.53c.402 1.52.128 3.228-.906 4.674a6.205 6.205 0 0 1-4.21 2.522 27.44 27.44 0 0 0 3.835 6.57 5.562 5.562 0 0 1 .194-4.202 6.032 6.032 0 0 1 3.673-3.24c.697 1.42.766 3.147.038 4.75a6.022 6.022 0 0 1-3.507 3.178 30.82 30.82 0 0 0 5.013 4.856 5.59 5.59 0 0 1-.864-4.116 5.809 5.809 0 0 1 2.75-3.974 5.586 5.586 0 0 1 1.233 4.605 5.799 5.799 0 0 1-2.596 3.871ZM139.97 3.974a5.596 5.596 0 0 1-1.233 4.604 5.807 5.807 0 0 1-2.752-3.973A5.587 5.587 0 0 1 137.217 0a5.813 5.813 0 0 1 2.752 3.974Zm5.458 2.28a5.586 5.586 0 0 1 1.223 4.609 5.815 5.815 0 0 1-2.76 3.968 5.213 5.213 0 0 1-.241-.307c2.795 4.26 4.381 9.15 4.381 14.274 0 .149-.005.297-.01.445l-.007.218c.154-1.178.698-2.337 1.639-3.29a6.324 6.324 0 0 1 4.613-1.876c.148 1.56-.402 3.206-1.661 4.482a6.326 6.326 0 0 1-4.613 1.876c-.008-.076-.009-.152-.011-.229l-.003-.102a25.176 25.176 0 0 1-1.298 6.566 5.98 5.98 0 0 1 2.201-2.477 6.438 6.438 0 0 1 4.939-.857c-.222 1.552-1.146 3.042-2.674 4.02a6.44 6.44 0 0 1-4.938.857c.025-.177.062-.352.106-.528a27.759 27.759 0 0 1-3.121 5.858 6.268 6.268 0 0 1 2.257-1.561c1.695-.69 3.519-.624 5.02.035-.525 1.486-1.729 2.784-3.424 3.476-1.693.689-3.517.623-5.02-.036.105-.3.247-.589.407-.869a31.15 31.15 0 0 1-4.372 4.633 6.471 6.471 0 0 1 2.487-.938c1.818-.288 3.574.188 4.866 1.166-.886 1.325-2.382 2.315-4.2 2.603-1.82.287-3.575-.188-4.868-1.167.18-.267.388-.517.614-.754-4.267 3.377-9.546 5.84-15.454 6.957l-.153-.73c5.395-1.021 10.255-3.191 14.272-6.162a5.797 5.797 0 0 1-2.597-3.871 5.582 5.582 0 0 1 1.234-4.605 5.812 5.812 0 0 1 2.749 3.974 5.592 5.592 0 0 1-.864 4.116 30.845 30.845 0 0 0 5.014-4.856 6.024 6.024 0 0 1-3.507-3.178c-.729-1.603-.661-3.33.037-4.75a6.024 6.024 0 0 1 3.672 3.24 5.55 5.55 0 0 1 .195 4.203 27.408 27.408 0 0 0 3.836-6.571 6.203 6.203 0 0 1-4.21-2.523c-1.035-1.445-1.31-3.153-.907-4.673a6.2 6.2 0 0 1 4.251 2.53c.982 1.374 1.271 2.982.952 4.442a24.73 24.73 0 0 0 1.68-7.377 6.356 6.356 0 0 1-4.734-1.572c-1.349-1.19-2.017-2.798-1.983-4.363 1.65-.14 3.391.38 4.739 1.571 1.336 1.18 2.002 2.768 1.981 4.32l.013-.188c.034-.493.069-.986.069-1.485 0-2.119-.283-4.2-.811-6.21-1.475.657-3.265.745-4.944.096-1.709-.658-2.938-1.937-3.494-3.412 1.489-.685 3.311-.784 5.019-.124 1.502.579 2.634 1.637 3.262 2.89a26.254 26.254 0 0 0-3.121-6.87c-1.295.974-3.047 1.442-4.861 1.15-1.82-.291-3.313-1.285-4.195-2.61 1.293-.976 3.051-1.447 4.869-1.157 1.773.285 3.234 1.24 4.124 2.516a29.593 29.593 0 0 0-5.036-5.9c-.888 1.295-2.366 2.264-4.16 2.549-1.82.288-3.575-.187-4.867-1.167.885-1.324 2.381-2.314 4.199-2.602 1.617-.256 3.182.093 4.417.86-1.421-1.24-2.996-2.349-4.664-3.35-1.419.372-2.984.327-4.418-.284-1.677-.714-2.804-2.012-3.225-3.476a6.895 6.895 0 0 1 5.134.086c1.534.653 2.581 1.804 3.074 3.115 4.012 2.438 7.374 5.602 9.846 9.24a5.594 5.594 0 0 1-.724-3.914 5.816 5.816 0 0 1 2.759-3.97Zm1.896 16.154a6.008 6.008 0 0 0 3.608-3.305c.696-1.615.592-3.34-.132-4.747a6.005 6.005 0 0 0-3.608 3.304c-.697 1.616-.592 3.34.132 4.748Z"
          clip-rule="evenodd"></path>
        <path fill="currentColor" fill-rule="evenodd"
          d="M37 44c-6.075 0-11 4.925-11 11s4.925 11 11 11h82c6.075 0 11-4.925 11-11s-4.925-11-11-11H37Zm8.14 15v-8.232h4.128c.608 0 1.108.108 1.5.324.4.216.7.52.9.912.2.392.3.86.3 1.404 0 .536-.104 1.004-.312 1.404-.208.4-.52.712-.936.936-.408.216-.92.324-1.536.324H46.7V59h-1.56Zm1.56-4.26h2.436c.4 0 .708-.116.924-.348.224-.24.336-.568.336-.984 0-.28-.048-.516-.144-.708a1.024 1.024 0 0 0-.42-.444c-.184-.104-.416-.156-.696-.156H46.7v2.64ZM55.1 59v-8.232h4.331c.608 0 1.112.104 1.512.312.4.208.7.504.9.888.2.384.3.836.3 1.356 0 .536-.12 1.012-.36 1.428-.24.408-.592.716-1.056.924L62.431 59h-1.704l-1.512-3.06H56.66V59H55.1Zm1.56-4.368h2.651c.4 0 .708-.116.924-.348.216-.232.324-.552.324-.96 0-.264-.048-.484-.144-.66a.968.968 0 0 0-.42-.42 1.467 1.467 0 0 0-.684-.144H56.66v2.532Zm8.96-3.864V59h6.493v-1.332H67.18V55.46h4.332v-1.332H67.18V52.1h4.86v-1.332h-6.42ZM75.604 59v-8.232h2.46l1.296 4.584c.048.16.096.34.144.54.048.2.092.392.132.576.048.184.084.344.108.48h.096c.016-.12.04-.268.072-.444.032-.176.068-.364.108-.564.048-.208.1-.408.156-.6l1.296-4.572h2.436V59h-1.56v-4.164c0-.368.004-.736.012-1.104.008-.368.016-.684.024-.948.016-.264.024-.42.024-.468h-.096c-.016.072-.056.228-.12.468-.064.24-.132.5-.204.78-.072.28-.136.52-.192.72L80.44 59H79l-1.356-4.704a69.552 69.552 0 0 1-.168-.6 32.33 32.33 0 0 0-.18-.732 20.456 20.456 0 0 0-.156-.648h-.096a659.034 659.034 0 0 1 .048 1.692c.008.304.012.58.012.828V59h-1.5Zm12.045-8.232V59h1.56v-8.232h-1.56Zm8.727 8.376c-.72 0-1.34-.116-1.86-.348a2.578 2.578 0 0 1-1.2-1.056c-.272-.48-.408-1.076-.408-1.788v-5.184h1.56v5.136c0 .632.164 1.112.492 1.44.336.32.808.48 1.416.48.608 0 1.08-.16 1.416-.48.344-.328.516-.808.516-1.44v-5.136h1.56v5.184c0 .712-.14 1.308-.42 1.788-.28.472-.68.824-1.2 1.056-.52.232-1.144.348-1.872.348Zm7.184-8.376V59h1.5v-4.164c0-.248-.004-.524-.012-.828a659.034 659.034 0 0 0-.048-1.692h.096c.048.184.1.4.156.648.064.248.124.492.18.732l.168.6L106.955 59h1.44l1.356-4.716c.056-.2.12-.44.192-.72.072-.28.14-.54.204-.78.064-.24.104-.396.12-.468h.096c0 .048-.008.204-.024.468-.008.264-.016.58-.024.948s-.012.736-.012 1.104V59h1.56v-8.232h-2.436l-1.296 4.572c-.056.192-.108.392-.156.6-.04.2-.076.388-.108.564a9.784 9.784 0 0 0-.072.444h-.096a6.228 6.228 0 0 0-.108-.48c-.04-.184-.084-.376-.132-.576-.048-.2-.096-.38-.144-.54l-1.296-4.584h-2.46Z"
          clip-rule="evenodd"></path>
        <path fill="currentColor"
          d="M62.345 9.256c0-.308.014-.588.042-.84l-.028-.042a10.6 10.6 0 0 1-.854.084c-.308.01-.593.01-.854 0v-1.82l3.654-.014v4.76c-.43.196-.92.35-1.47.462-.542.103-1.232.154-2.072.154-1.12 0-1.998-.15-2.632-.448a2.635 2.635 0 0 1-1.344-1.47c-.262-.681-.392-1.587-.392-2.716 0-.915.102-1.666.308-2.254.214-.588.522-1.04.924-1.358.41-.327.91-.55 1.498-.672a9.344 9.344 0 0 1 2.016-.196c.448 0 .896.019 1.344.056.457.037.91.107 1.358.21V5l-.042.028a8.587 8.587 0 0 0-1.176-.196c-.383-.037-.77-.056-1.162-.056-.57 0-1.07.06-1.498.182a1.62 1.62 0 0 0-.98.714c-.234.364-.35.929-.35 1.694 0 .756.06 1.335.182 1.736.13.392.368.663.714.812.354.14.858.21 1.512.21h.392l.532-.028c.177-.01.303-.023.378-.042v-.798Zm13.023 2.576v.042h-2.38a28.87 28.87 0 0 0-.238-.77 44.03 44.03 0 0 0-.28-.924h-3.024a40.104 40.104 0 0 1-.518 1.694h-2.38v-.028l2.87-8.834h3.08l2.87 8.82ZM70.93 4.608a29.992 29.992 0 0 1-.406 1.736c-.177.681-.364 1.377-.56 2.086h2.002a79.73 79.73 0 0 1-.574-2.086 29.992 29.992 0 0 1-.406-1.736h-.056Zm10.87 6.818a93.25 93.25 0 0 1-.49-1.61c-.159-.57-.317-1.134-.476-1.694-.159-.56-.303-1.083-.434-1.568a227.995 227.995 0 0 1-.532-2.016l-.056.014c.028.168.051.392.07.672a26.692 26.692 0 0 1 .056 1.694v4.956h-2.142V3.012h3.752c.13.495.266 1.017.406 1.568.15.541.294 1.083.434 1.624.15.532.28 1.04.392 1.526.112.476.191.891.238 1.246h.028c.046-.355.121-.77.224-1.246.112-.476.238-.985.378-1.526s.285-1.083.434-1.624c.15-.55.285-1.073.406-1.568h3.696v8.862H86.07V6.918a26.382 26.382 0 0 1 .056-1.694c.028-.28.051-.504.07-.672l-.056-.014a75.56 75.56 0 0 1-.546 2.03 163.462 163.462 0 0 1-.924 3.262c-.159.56-.313 1.092-.462 1.596H81.8Zm9.508.448V3.012h6.58v1.82h-4.34v1.68h3.766v1.82h-3.766v1.722h4.34v1.82h-6.58ZM26.548 31.82h-3.2V19.16h5.64c1.267 0 2.28.153 3.04.46.76.307 1.307.807 1.64 1.5.334.693.5 1.633.5 2.82 0 1.12-.166 2.033-.5 2.74-.333.693-.88 1.207-1.64 1.54-.76.333-1.773.5-3.04.5h-2.44v3.1Zm1.92-10.04h-1.92v4.32h1.92c.947 0 1.58-.16 1.9-.48.32-.32.48-.88.48-1.68 0-.76-.16-1.307-.48-1.64-.32-.347-.953-.52-1.9-.52Zm12.6 10.04h-3.2V19.16h6.04c1.587 0 2.74.36 3.46 1.08.733.707 1.1 1.753 1.1 3.14 0 1.04-.26 1.933-.78 2.68-.52.733-1.207 1.193-2.06 1.38l-.02.06c.333.213.7.567 1.1 1.06.4.493.793 1.033 1.18 1.62.4.573.753 1.113 1.06 1.62v.02h-3.72l-2.16-3.2a4.18 4.18 0 0 0-.46-.6.667.667 0 0 0-.4-.22 4.518 4.518 0 0 0-.72-.04h-.42v4.06Zm2.32-10.06h-2.32v3.4h2.32c.667 0 1.127-.133 1.38-.4.267-.267.4-.7.4-1.3 0-.6-.133-1.033-.4-1.3-.253-.267-.713-.4-1.38-.4Zm8.97 3.72c0-1.613.18-2.893.54-3.84.374-.947 1.007-1.627 1.9-2.04.907-.413 2.167-.62 3.78-.62 1.214 0 2.22.113 3.02.34.8.227 1.434.593 1.9 1.1.467.507.794 1.18.98 2.02.2.827.3 1.84.3 3.04 0 1.213-.1 2.24-.3 3.08-.186.827-.513 1.493-.98 2-.466.507-1.1.873-1.9 1.1-.8.227-1.806.34-3.02.34-1.213 0-2.22-.113-3.02-.34-.8-.227-1.433-.593-1.9-1.1-.466-.507-.8-1.173-1-2-.2-.84-.3-1.867-.3-3.08Zm6.22 3.72c.854 0 1.494-.107 1.92-.32.427-.213.714-.587.86-1.12.147-.547.22-1.307.22-2.28 0-.96-.073-1.707-.22-2.24-.146-.533-.433-.907-.86-1.12-.426-.227-1.066-.34-1.92-.34-.84 0-1.48.113-1.92.34-.426.213-.72.587-.88 1.12-.146.533-.22 1.28-.22 2.24 0 .973.074 1.733.22 2.28.16.533.454.907.88 1.12.44.213 1.08.32 1.92.32Zm21.744-10.02-3.94 12.64h-4.4l-3.74-12.64h3.58c.213.667.44 1.427.68 2.28.24.853.473 1.727.7 2.62.24.88.447 1.707.62 2.48.187.76.327 1.393.42 1.9h.08c.093-.507.227-1.14.4-1.9.187-.773.393-1.6.62-2.48.24-.88.48-1.747.72-2.6s.467-1.62.68-2.3h3.58Zm7.039 12.64h-3.2V19.16h3.2v12.66Zm4.405 0V19.16h5.54c1.107 0 2.034.093 2.78.28.747.173 1.347.487 1.8.94.454.453.78 1.087.98 1.9.2.8.3 1.833.3 3.1 0 1.32-.1 2.4-.3 3.24-.2.84-.526 1.493-.98 1.96-.453.467-1.053.793-1.8.98-.746.173-1.673.26-2.78.26h-5.54Zm5.08-9.96h-1.88v7.26h1.88c.774 0 1.38-.087 1.82-.26.454-.173.774-.527.96-1.06.2-.533.3-1.34.3-2.42 0-1.027-.1-1.787-.3-2.28-.186-.507-.506-.84-.96-1-.44-.16-1.046-.24-1.82-.24Zm10.319 9.96V19.16h9.4v2.6h-6.2v2.4h5.38v2.6h-5.38v2.46h6.2v2.6h-9.4Zm16.196 0h-3.2V19.16h6.04c1.587 0 2.74.36 3.46 1.08.733.707 1.1 1.753 1.1 3.14 0 1.04-.26 1.933-.78 2.68-.52.733-1.207 1.193-2.06 1.38l-.02.06c.333.213.7.567 1.1 1.06.4.493.793 1.033 1.18 1.62.4.573.753 1.113 1.06 1.62v.02h-3.72l-2.16-3.2c-.187-.28-.34-.48-.46-.6a.668.668 0 0 0-.4-.22 4.523 4.523 0 0 0-.72-.04h-.42v4.06Zm2.32-10.06h-2.32v3.4h2.32c.667 0 1.127-.133 1.38-.4.267-.267.4-.7.4-1.3 0-.6-.133-1.033-.4-1.3-.253-.267-.713-.4-1.38-.4Z">
        </path>
      </svg>
      <div class="flex justify-between w-[9.625rem] absolute bottom-[.4rem] px-[1.6rem]">
        <ion-icon name="star" class="text-[#f8ff7a] text-[.6rem] mx-[.25rem]"></ion-icon>
        <ion-icon name="star" class="text-[#f8ff7a] text-[.6rem] mx-[.25rem]"></ion-icon>
      </div>
    </div>
    <div class="px-[.75rem] mt-[1.9375rem]">
      <img class="w-full h-auto" src="/static/home_footer_plantform.png" alt="">
    </div>

    <div
      class="bg-[#322071] bg-[url('/static/home_footer_bg.png')] bg-cover bg-center mt-[1rem] pt-[1.375rem] pb-[2.25rem] px-[.75rem]">
      <img src="/variable/logo.png" class="h-[2.25rem] w-auto" alt="">
      <div class="relative w-[7.75rem] h-[0.125rem] rounded opacity-20 mt-[1rem]" style="background: linear-gradient(
            to right, 
            white 0%, white 55%, 
            transparent 55%, transparent 60%, 
            white 60%, white 80%, 
            transparent 80%, transparent 85%, 
            white 85%, white 100%
          );">
      </div>
      <div class="flex items-center mt-[.4rem] gap-[.75rem]">
        <div class="w-[2.5rem] h-[2.5rem] rounded-[100px] flex items-center justify-center p-[.5rem] bg-[#2AABEE33]">
          <img class="w-full" src="/static/te.png" alt="">
        </div>
        <div class="w-[2.5rem] h-[2.5rem] rounded-[100px] flex items-center justify-center p-[.5rem] bg-[#2AABEE33]">
          <img class="w-full" src="/static/face.png" alt="">
        </div>
        <div class="w-[2.5rem] h-[2.5rem] rounded-[100px] flex items-center justify-center p-[.5rem] bg-[#2AABEE33]">
          <img class="w-full" src="/static/ws.png" alt="">
        </div>
      </div>
      <p class="text-[.75rem] font-[400] text-white opacity-40 text-left mt-[2.25rem]">
        58ff.COM é operada pela 58ff N.V., registrada sob o número 18958, com sede em Zuikertuintjeweg Z/N (Zuikertuin
        Tower), Curaçao. Licenciada e autorizada pelo Governo de Curaçao sob a Master License of Gaming Services
        Provider N.V., Licença Nº GLH-OCCHKTW07878965325.
        1.Este produto é destinado exclusivamente a maiores de 18 anos e serve apenas para fins de entretenimento.
        2.O jogo pode conter compras dentro do aplicativo.
        3.Ganhos ou perdas em jogos sociais não garantem resultados semelhantes em jogos com apostas em dinheiro real no
        futuro.
      </p>
    </div>


    <!-- 两侧广告 -->
    <div @click="showOpenTime();" class="fixed right-[calc(50%-11rem)] bottom-[11.25rem] animate-wobble-loop">
      <img class="w-auto h-[6.25rem]" src="/static/sidegift.gif" alt="">
      <p class="text-white font-[700] text-[.75rem] -mt-[2rem]">00:05:33</p>
    </div>

    <div
      @click="goToNotification"
      class="text-white flex items-center justify-center w-[3.375rem] h-[3.375rem] left-[calc(50%-11rem)] bottom-[6.3rem] fixed rounded-[100px] bg-[var(--color-active)] animate-support-float cursor-pointer">
      <svg class="w-[80%] animate-icon-bounce" viewBox="0 0 30 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd"
          d="M26.4105 13.2427C26.3865 13.2427 26.367 13.2232 26.367 13.1991C26.367 6.96471 21.313 1.91072 15.0786 1.91072C8.84419 1.91072 3.7902 6.96471 3.7902 13.1991C3.7902 13.2232 3.77075 13.2427 3.7467 13.2427H2.53578C2.51169 13.2427 2.49213 13.2232 2.49213 13.1991C2.49213 6.2478 8.12729 0.61264 15.0786 0.61264C22.0299 0.61264 27.6651 6.2478 27.6651 13.1991C27.6651 13.2232 27.6455 13.2427 27.6214 13.2427H26.4105Z"
          fill="currentColor"></path>
        <path d="M27.6649 12.8943C27.6649 20.3266 21.6398 26.3518 14.2074 26.3518" stroke="currentColor"
          stroke-width="0.519231"></path>
        <rect x="12.1604" y="10.0198" width="2.87442" height="5.74884" rx="1.43721" fill="currentColor"></rect>
        <rect x="18.1706" y="10.0198" width="2.87442" height="5.74884" rx="1.43721" fill="currentColor"></rect>
        <path
          d="M25.8358 11.5006C27.5955 11.5006 29.3199 13.6454 29.3199 16.2913C29.3199 18.9371 27.5955 21.082 25.8358 21.082C24.076 21.082 24.3184 18.9371 24.3184 16.2913C24.3184 13.6454 24.076 11.5006 25.8358 11.5006Z"
          fill="currentColor"></path>
        <path
          d="M4.23425 11.5006C2.47451 11.5006 0.750102 13.6454 0.750102 16.2913C0.750102 18.9371 2.47451 21.082 4.23425 21.082C5.99399 21.082 5.75157 18.9371 5.75157 16.2913C5.75157 13.6454 5.99399 11.5006 4.23425 11.5006Z"
          fill="currentColor"></path>
        <ellipse cx="14.9478" cy="25.9163" rx="3.22284" ry="2.04694" fill="currentColor"></ellipse>
      </svg>
    </div>

    
    <!-- Tabbar 组件 -->
    <SideBar v-model:open="isSidebarOpen" />
    <Login v-model:open="isLoginOpen" :initialMode="loginDefaultMode" />
    <Tabbar />
  </div>
</template>

<script setup lang="ts">
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";

import { Autoplay } from "swiper/modules";
import { ref, onMounted, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { showGiftAlert } from "../components/giftAlert/service";
import { showPop, hidePop } from "../components/pop/service";
import { showInstall } from "../components/install/service";
import { showOpenTime } from "../components/openTime/service";
import SideBar from "../components/SideBar.vue";
import Login from "./login/Login.vue";
import { useAuthStore } from "../stores/auth";
import { gameApi, type Game, type GameProvider } from "../services/api";
import { preloadService } from "../services/preloadService";
import { GameUrlEncoder } from "../utils/gameUrlEncoder";
import { gameStorage } from "../services/gameStorage";
import { showToast } from "../components/toast/service";
import { useUiStore } from "../stores/ui";
import { useAnnouncementStore } from "../stores/announcement";


const router = useRouter();
const auth = useAuthStore();
const ui = useUiStore();
const announcement = useAnnouncementStore();
const currencyFormatter = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const balanceDisplay = computed(() => currencyFormatter.format(auth.balance))
const marqueeTexts = computed(() => {
  const arr = announcement.announcementContents
  if (arr.length > 0) return [...arr, ...arr] // 重复两次保证滚动连续
  return ['Bem-vindo!']
})

const isSidebarOpen = ref(false);
const isLoginOpen = ref(false);
const loginDefaultMode = ref<'login' | 'register'>('login');

const images = [
  "/variable/banner1.png",
  "/variable/banner2.png",
  "/variable/banner3.png",
  "/variable/banner4.png",
];

const gameTypes = [
  {
    label: "PG",
    count: "134",
    posX: "-300%",
    posY: 0,
  },
  {
    label: "PP",
    count: "402",
    posX: "-200%",
    posY: 0,
  },
  {
    label: "G759",
    count: "49",
    posX: "-200%",
    posY: "-200%",
  },
  {
    label: "JDB",
    count: "72",
    posX: "-600%",
    posY: 0,
  },
  {
    label: "Tada",
    count: "115",
    posX: "-100%",
    posY: 0,
  },
  {
    label: "POPOK",
    count: "57",
    posX: "-300%",
    posY: "-300%",
  },
  {
    label: "CP",
    count: "43",
    posX: "-700%",
    posY: "-100%",
  },
  {
    label: "FaChai",
    count: "36",
    posX: "-500%",
    posY: "-100%",
  },
  {
    label: "PLAYSON",
    count: "78",
    posX: "-400%",
    posY: "-300%",
  },
  {
    label: "RUBYPLAY",
    count: "9",
    posX: "-500%",
    posY: "-300%",
  },
];

const favorites = ref<Record<number, boolean>>({});
const isFav = (idx: number) => !!favorites.value[idx];
const toggleFav = (idx: number) => {
  favorites.value[idx] = !isFav(idx);
};

const showInstallCTA = ref(true)

// GiftAlert 相关：在首页创建并加载提示

const loadAlert = () => {
  showGiftAlert();
};

// 已移除串行弹窗逻辑，按需触发安装弹窗或其他 UI

// 跳转到通知页面
const goToNotification = () => {
  router.push('/notification');
};

onMounted(() => {
  // 按顺序展示弹窗：Install → Pop → GiftAlert
  // runSequence();


  // 不再在挂载时直接调用 Pop 或 GiftAlert，避免同时展示
});

function onInstallClick() {
  showInstall({
    onConfirm: async () => {
      const prompt = (window as any).deferredPrompt
      if (prompt && typeof prompt.prompt === 'function') {
        try {
          await prompt.prompt()
        } catch {}
      }
    },
  })
}

function computeInstallVisibility() {
  try {
    const isStandalone = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches
    const isiOSStandalone = (navigator as any).standalone === true
    const hasPrompt = !!(window as any).deferredPrompt
    showInstallCTA.value = !isStandalone && !isiOSStandalone && hasPrompt
  } catch {
    showInstallCTA.value = true
  }
}

computeInstallVisibility()
window.addEventListener('appinstalled', () => {
  showInstallCTA.value = false
})
window.addEventListener('beforeinstallprompt', () => {
  computeInstallVisibility()
})

const gamesLoading = ref(true)
const gamesError = ref('')
const games = ref<Game[]>([])
const providers = ref<GameProvider[]>([])
const providerOrderMap = computed(() => {
  const map = new Map<number, number>()
  providers.value.forEach(p => map.set(p.id, p.sort_order ?? Number.POSITIVE_INFINITY))
  return map
})
const popularCount = computed(() => games.value.length)
const providerCounts = computed(() => {
  const m = new Map<number, number>()
  for (const g of games.value) {
    m.set(g.provider_id, (m.get(g.provider_id) || 0) + 1)
  }
  return m
})
const selectedTape = ref<'popular' | number>('popular')
const displayedTitle = computed(() => {
  if (selectedTape.value === 'popular') return 'Populares'
  const p = providers.value.find(x => x.id === selectedTape.value)
  return p?.name || 'Jogos'
})
const displayedTotal = computed(() => {
  if (selectedTape.value === 'popular') return popularCount.value
  return providerCounts.value.get(selectedTape.value as number) || 0
})
const GAMES_PER_SECTION = 12
const displayedCount = ref(GAMES_PER_SECTION)
const displayedGames = computed(() => {
  if (selectedTape.value === 'popular') {
    const list = [...games.value].sort((a, b) => {
      if (b.clicks !== a.clicks) return b.clicks - a.clicks
      const ao = providerOrderMap.value.get(a.provider_id) ?? Number.POSITIVE_INFINITY
      const bo = providerOrderMap.value.get(b.provider_id) ?? Number.POSITIVE_INFINITY
      if (ao !== bo) return ao - bo
      return b.id - a.id
    })
    return list.slice(0, displayedCount.value)
  } else {
    const pid = selectedTape.value as number
    const list = games.value
      .filter(g => g.provider_id === pid)
      .sort((a, b) => {
        if (b.clicks !== a.clicks) return b.clicks - a.clicks
        return b.id - a.id
      })
    return list.slice(0, displayedCount.value)
  }
})
watch(selectedTape, () => {
  displayedCount.value = GAMES_PER_SECTION
})
function loadMore() {
  displayedCount.value = Math.min(displayedCount.value + GAMES_PER_SECTION, displayedTotal.value)
}
async function fetchGames() {
  try {
    await preloadService.startPreload()
    const [provList, gameList] = await Promise.all([
      preloadService.getCachedProviders(),
      preloadService.getCachedGames()
    ])
    providers.value = provList || []
    games.value = gameList || []
  } catch (e: any) {
    gamesError.value = e?.message || 'Falha ao carregar jogos'
  } finally {
    gamesLoading.value = false
  }
}
onMounted(fetchGames)
onMounted(async () => {
  try {
    await announcement.fetchAnnouncements()
  } catch {}
})

async function launchGame(gameId: number) {
  if (!auth.isLoggedIn) {
    ui.openLogin('login')
    return
  }
  try {
    const res = await gameApi.launchGame(gameId)
    if (res.code === 1) {
      const url = res.data.game_url
      try {
        await gameStorage.updateLastPlayedAt(gameId)
      } catch {}
      const token = GameUrlEncoder.encode(url)
      router.push({ path: `/game/${gameId}`, query: { token } })
    } else {
      showToast(res.msg || 'Falha ao iniciar o jogo')
    }
  } catch (e: any) {
    showToast(e?.message || 'Falha ao iniciar o jogo')
  }
}
</script>

<style scoped>
/* 上下浮动动画 */
@keyframes float-up-down {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-8px);
  }
}

/* 向上跳动并带回弹，末尾留空隙作为暂停 */
@keyframes bounce-up-loop {
  0% { transform: translateY(0); }
  25% { transform: translateY(-12px); }  /* 向上跳 */
  40% { transform: translateY(0); }      /* 落地 */
  55% { transform: translateY(-4px); }   /* 轻微回弹 */
  65% { transform: translateY(0); }      /* 回到基线 */
  100% { transform: translateY(0); }     /* 暂停等待下一轮 */
}

.animate-bounce-up-loop {
  animation: bounce-up-loop 2.2s ease-in-out infinite;
}

.animate-float-1 {
  animation: float-up-down 3s ease-in-out infinite;
}

.animate-float-2 {
  animation: float-up-down 3.5s ease-in-out infinite 0.3s;
}

.animate-float-3 {
  animation: float-up-down 2.8s ease-in-out infinite 0.6s;
}

/* 跑马灯横向滚动（页面 scoped） */
@keyframes marquee-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(-50%);
  }
}

.marquee {
  overflow: hidden;
}

.marquee-track {
  display: inline-flex;
  white-space: nowrap;
  min-width: 200%;
  animation: marquee-scroll 38s linear infinite;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  /* IE and Edge */
  scrollbar-width: none;
  /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

/* 侧边礼物摇摆旋转缩放动画 */
@keyframes wobble-rotate-scale {
  0% {
    transform: rotate(0deg) scale(1);
  }

  30% {
    transform: rotate(0deg) scale(1.1);
  }

  40% {
    transform: rotate(-15deg) scale(1);
  }

  50% {
    transform: rotate(0deg) scale(1);
  }

  60% {
    transform: rotate(-15deg) scale(1);
  }

  70% {
    transform: rotate(0deg) scale(1.1);
  }

  100% {
    transform: rotate(0deg) scale(1);
  }
}

.animate-wobble-loop {
  animation: wobble-rotate-scale 1s ease-in-out infinite;
  transform-origin: center;
  will-change: transform;
}

/* 支持按钮浮动动画 */
@keyframes supportFloat-ad181b16 {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-8px) scale(1.02);
  }
}

.animate-support-float {
  animation: supportFloat-ad181b16 4s ease-in-out infinite;
  will-change: transform;
}

/* 图标弹跳动画 */
@keyframes iconBounce-ad181b16 {
  0%, 100% {
    transform: scale(1) rotate(0);
  }
  25% {
    transform: scale(1.1) rotate(-5deg);
  }
  50% {
    transform: scale(1.05) rotate(0);
  }
  75% {
    transform: scale(1.1) rotate(5deg);
  }
}

.animate-icon-bounce {
  animation: iconBounce-ad181b16 2s ease-in-out infinite;
  will-change: transform;
}

/* 猪图标弹性跳跃动画（按用户提供的关键帧与时长） */
@keyframes pigElasticBounce-26a1dde3 {
  0%, 100% { 
    transform: translateY(0) scaleY(1); 
  }
  5% { 
    transform: translateY(-.5rem) scaleY(1.1); 
  }
  8% { 
    transform: translateY(-.1875rem) scaleY(.9); 
  }
  12% { 
    transform: translateY(-.375rem) scaleY(1.05); 
  }
  17% { 
    transform: translateY(0) scaleY(1); 
  }
}

.animate-pig-elastic-bounce {
  animation: pigElasticBounce-26a1dde3 6s infinite;
  will-change: transform;
}
</style>
