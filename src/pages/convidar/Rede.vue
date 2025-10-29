<template>
    <div class="w-full">        
        <div class="border border-[var(--color-border-2)] p-[.75rem] rounded-[.625rem] m-[.625rem] flex items-center">
            <div class="ml-[1.5rem] w-[2.9rem] h-[2.9rem] bg-[url(/static/convidar/manA.png)] bg-cover bg-center border border-[var(--color-warning)] rounded-[100px] relative">
                <div class="absolute bottom-[-0.1rem] right-[-0.1rem] w-[1rem] h-[1rem] bg-[var(--color-warning)] text-white text-[.625rem] flex items-center justify-center rounded-[100px]">
                    A
                </div>                
            </div>
            <div class="text-[.65rem] text-white text-left flex-1 pl-[1rem] leading-[1.25rem]">
                <p>Desempenho total 28500</p>
                <p>Comissão total <span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">225</span></p>
                <p>Desempenho direto 5500</p>
                <p>Retorno de Comissão 3% Comissão Direta</p>
                <p><span class="text-[var(--color-warning)] inline-block [transform:skewX(-10deg)]">165</span></p>
                <p>Outro desempenho 3000</p>
                <p>Comissão escalonada 2% outra comissão <span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">60</span></p>
            </div>
        </div>
        <div class="relative w-full h-[21.5rem]">
            <img class="w-[23.3rem] h-auto mx-auto translate-x-[-.1rem]" src="/static/convidar/jt.png" alt="">
            <div class="flex justify-between items-center absolute left-0 right-0 top-[1.8rem] z-[20]">
                <div class="leading-[0.6rem] px-[.5rem] py-[.25rem] text-[.6rem] text-center c1-left w-[6.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                    <p>C1contribui paraA</p>
                     <p class="text-[var(--color-warning)] [transform:skewX(-10deg)]">20</p>
                    <p>De diferenciais2%</p>
                </div>
                 <div class="leading-[0.6rem] px-[.5rem] py-[.25rem] text-[.6rem] text-center c1-left w-[6.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                    C3contribui paraA <span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">0</span>
                    Sem diferença de nível                     
                </div>
            </div>

            <div class="flex justify-between items-center absolute left-0 right-0 top-[5.2rem] z-[20] px-[2rem]">
                <div class="leading-[1rem] text-[.6rem] text-center c1-left w-[5.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                   B1contribui comissão <span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">15</span>      
                </div>
                 <div class="leading-[1rem] text-[.6rem] text-center c1-left w-[5.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                    B2contribui comissão <span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">90</span>                        
                </div>
                <div class="leading-[1rem] text-[.6rem] text-center c1-left w-[5.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                    B3contribui comissão <span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">60</span>                        
                </div>
            </div>

            <div class="flex justify-between items-center absolute left-0 right-0 top-[7rem] z-[20] px-[.8rem]">
                <div>
                    <div class="w-[3rem] h-[3rem] bg-[url(/static/convidar/manB1.png)] bg-cover bg-center border border-[var(--color-text-link)] rounded-[100px] relative mx-auto relative z-[20]">
                        <div class="absolute bottom-[-0.1rem] right-[-0.1rem] w-[1rem] h-[1rem] bg-[var(--color-text-link)] text-white text-[.625rem] flex items-center justify-center rounded-[100px]">
                            B1
                        </div>                
                    </div>
                    <div class="border border-[var(--color-border-2)] rounded-[.375rem] translate-y-[-1.5rem] h-[3.9rem] flex items-center justify-center text-white text-[.6rem] px-[.25rem] bg-[var(--color-main-bg)]">
                        Apostas válidas 500
                    </div>
                </div>
                <div>
                    <div class="w-[3rem] h-[3rem] bg-[url(/static/convidar/manB2.png)] bg-cover bg-center border border-[var(--color-text-link)] rounded-[100px] relative mx-auto relative z-[20]">
                        <div class="absolute bottom-[-0.1rem] right-[-0.1rem] w-[1rem] h-[1rem] bg-[var(--color-text-link)] text-white text-[.625rem] flex items-center justify-center rounded-[100px]">
                            B2
                        </div>                
                    </div>
                    <div class="border border-[var(--color-border-2)] rounded-[.375rem] translate-y-[-1.5rem] h-[3.9rem] flex items-center justify-center text-white text-[.6rem] px-[.25rem] bg-[var(--color-main-bg)]">
                        Apostas válidas 3000
                    </div>
                </div>
                <div>
                    <div class="w-[3rem] h-[3rem] bg-[url(/static/convidar/manB1.png)] bg-cover bg-center border border-[var(--color-text-link)] rounded-[100px] relative mx-auto relative z-[20]">
                        <div class="absolute bottom-[-0.1rem] right-[-0.1rem] w-[1rem] h-[1rem] bg-[var(--color-text-link)] text-white text-[.625rem] flex items-center justify-center rounded-[100px]">
                            B3
                        </div>                
                    </div>
                    <div class="border border-[var(--color-border-2)] rounded-[.375rem] translate-y-[-1.5rem] h-[3.9rem] flex items-center justify-center text-white text-[.6rem] px-[.25rem] bg-[var(--color-main-bg)]">
                        Apostas válidas 2000
                    </div>
                </div>
            </div>



            <div class="flex justify-between items-center absolute left-0 right-0 top-[16.9rem] z-[22] px-[.8rem]">
                <div>
                    <div class="w-[3rem] h-[3rem] bg-[url(/static/convidar/womanC1.png)] bg-cover bg-center border border-[var(--color-success)] rounded-[100px] relative mx-auto relative z-[20]">
                        <div class="absolute bottom-[-0.1rem] right-[-0.1rem] w-[1rem] h-[1rem] bg-[var(--color-success)] text-white text-[.625rem] flex items-center justify-center rounded-[100px]">
                            C1
                        </div>                
                    </div>
                    <div class="border border-[var(--color-border-2)] rounded-[.375rem] translate-y-[-1.5rem] h-[3.9rem] flex items-center justify-center text-white text-[.6rem] px-[.25rem] bg-[var(--color-main-bg)]">
                        Apostas válidas 1000
                    </div>
                </div>
                <div>
                    <div class="w-[3rem] h-[3rem] bg-[url(/static/convidar/womanC2.png)] bg-cover bg-center border border-[var(--color-success)] rounded-[100px] relative mx-auto relative z-[20]">
                        <div class="absolute bottom-[-0.1rem] right-[-0.1rem] w-[1rem] h-[1rem] bg-[var(--color-success)] text-white text-[.625rem] flex items-center justify-center rounded-[100px]">
                            C2
                        </div>                
                    </div>
                    <div class="border border-[var(--color-border-2)] rounded-[.375rem] translate-y-[-1.5rem] h-[3.9rem] flex items-center justify-center text-white text-[.6rem] px-[.25rem] bg-[var(--color-main-bg)]">
                        Apostas válidas 2000
                    </div>
                </div>
                <div>
                    <div class="w-[3rem] h-[3rem] bg-[url(/static/convidar/womanC1.png)] bg-cover bg-center border border-[var(--color-success)] rounded-[100px] relative mx-auto relative z-[20]">
                        <div class="absolute bottom-[-0.1rem] right-[-0.1rem] w-[1rem] h-[1rem] bg-[var(--color-success)] text-white text-[.625rem] flex items-center justify-center rounded-[100px]">
                            C3
                        </div>                
                    </div>
                    <div class="border border-[var(--color-border-2)] rounded-[.375rem] translate-y-[-1.5rem] h-[3.9rem] flex items-center justify-center text-white text-[.6rem] px-[.25rem] bg-[var(--color-main-bg)]">
                        Apostas válidas 20000
                    </div>
                </div>
            </div>
            <div class="absolute top-[12.6rem] right-[5rem] leading-[1rem] text-[.6rem] text-center c1-left w-[5.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                   C1contribui comissão<span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">10</span>      
            </div>

            <div class="flex justify-between items-center absolute left-0 right-0 top-[15.2rem] z-[20] px-[2rem]">
                <div class="leading-[1rem] text-[.6rem] text-center c1-left w-[5.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                   C1contribui comissão<span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">10</span>      
                </div>
                 <div class="leading-[1rem] text-[.6rem] text-center c1-left w-[5.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                    C2contribui comissão<span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">20</span>                        
                </div>
                <div class="leading-[1rem] text-[.6rem] text-center c1-left w-[5.6rem] bg-[var(--color-bg-aside-2)] text-white rounded-[.375rem] border border-[var(--color-border-2)]">
                    C3contribui comissão<span class="text-[var(--color-warning)] [transform:skewX(-10deg)]">600</span>                        
                </div>
            </div>
        </div>


        <div class="rounded-[0.28rem] text-[0.6rem] border border-[var(--color-border-2)] text-white/40 p-3 leading-relaxed space-y-2 text-left mt-[1.75rem]">
            <h1 class="text-[0.7rem] font-bold">
                <strong>Um exemplo é o seguinte:</strong>
            </h1>

            <p class="indent-[0.9rem]">
                Suponha que as apostas efetivas atuais de 0 a 10.000 receberão uma comissão de 100 (ou seja, 1%) para cada 10.000, e o apostas efetivas acima de 10.000 receberão uma comissão de 300 para cada 10.000. (ou seja, 3%), A foi o primeiro a descobrir oportunidades de negócios neste site e imediatamente desenvolveu B1, B2 e B3. B1 desenvolveu ainda mais C1 e C2. B2 desenvolveu sem subordinados, e a B3 desenvolveu o relativamente poderoso C3. No segundo dia, a aposta efetiva de B1 é 500, a aposta efetiva de B2 é 3.000, a aposta efetiva de B3 é 2.000, a aposta efetiva de C1 é 1.000, a aposta efetiva de C2 é 2.000 e a aposta efetiva de C3 é de até 20.000.
            </p>

            <div>Então o método de cálculo da renda entre eles é o seguinte:</div>

            <ul class="list-decimal list-inside space-y-2">
                <li>
                <strong>1. Comissão de B1</strong> (contribuições diretas de C1 e C2) =
                (1000 + 2000) * 1% = <em>30</em>
                </li>
                <li>
                <strong>2. Comissão de B2</strong> (sem subordinados) = (0+0) * 1% =
                <em>0</em>
                </li>
                <li>
                <strong>3. Comissão B3</strong> (contribuição direta de C3) = 20.000 * 3%
                = <em>600</em>
                </li>
                <li>
                <strong>4. Além das contribuições dos subordinados diretos B1, B2 e B3,
                    a comissão de A também advém das contribuições dos demais subordinados
                    C1, C2 e C3, conforme segue:</strong>
                <ul class="list-disc list-inside ml-4 space-y-1">
                    <li>
                    <strong>(1) Comissão direta de A</strong> (contribuições diretas de B1,
                    B2 e B3) = (500+3000+2000) * 3% = <em>165</em>
                    </li>
                    <li>
                    <strong>(2) Outras comissões de A</strong> (das contribuições C1,
                    C2)=(1000+2000) * 2%= <em>60</em>
                    </li>
                    <li>
                    <strong>(3) Comissão total de A</strong> (direto + outro) = 165+60 =
                    <em>225</em>
                    </li>
                </ul>
                </li>

                <li>
                <strong>5. Resumo:</strong>
                <ul class="list-disc list-inside ml-4 space-y-1">
                    <li>
                    <strong>(1) Equipe direta</strong>: refere-se aos subordinados
                    desenvolvidos diretamente por A, ou seja, o primeiro nível de
                    relacionamento com A, denominados coletivamente como equipe direta.
                    </li>
                    <li>
                    <strong>(2) Outras equipes</strong>: Refere-se àquelas que são
                    desenvolvidas por subordinados de A. Possuem relacionamento de segundo
                    nível com A ou superior, ou seja, subordinados de subordinados , e os
                    subordinados dos subordinados.. etc., coletivamente referidos como
                    outras equipes; como esse modelo de agência pode desenvolver
                    subordinados ilimitados, para conveniência da explicação, este artigo
                    toma apenas a estrutura de 2 níveis como exemplo.
                    </li>
                    <li>
                    <strong>(3) Descrição de A</strong>: O desempenho direto de A é 5.500
                    e o outro desempenho é 20.000 (devido ao poder de C3). O desempenho
                    total é 28.500 e a comissão correspondente a taxa é de 3%. Como B1 tem
                    um desempenho total de 3.000 e desfruta de um desconto de apenas 1%,
                    enquanto A tem um desempenho total de 28.500 e desfruta de uma taxa de
                    desconto de 3%, então haverá uma diferença de desconto entre A e B1. A
                    diferença é: 3% -1% =2%, essa diferença é a parte contribuída por C1 e
                    C2 para A, então C1 e C2 contribuem para A: (1000+2000)* 2%=60, não há
                    diferença extrema entre A e B3, então C3 contribui para A A comissão de
                    contribuição é 0.
                    </li>
                    <li>
                    <strong>(4) Descrição de B1</strong>: B1 tem subordinados C1 e C2. Como o
                    desempenho direto é 3.000, o índice de desconto correspondente é de 1%.
                    </li>
                    <li>
                    <strong>(5) Explicação B2</strong>: B2 pode ser preguiçoso e não se
                    beneficiará se não desenvolver seus subordinados.
                    </li>
                    <li>
                    <strong>(6) Explicação B3</strong>: Embora B3 tenha aderido
                    relativamente tarde e seja subordinado de A, seu subordinado C3 é muito
                    poderoso e tem um desempenho direto de 20.000, permitindo que B3
                    diretamente desfrutar de comissões mais elevadas. A proporção é de 3%.
                    </li>
                    <li>
                    <strong>(7) Resumo das regras</strong>: Não importa quando você ingressa,
                    de quem você é subordinado, não importa em que nível você está, sua
                    renda nunca será afetada e você não sofre mais as perdas dos subordinados
                    dos outros., o desenvolvimento não é restrito. Este é um modelo de
                    agência absolutamente justo e imparcial, e ninguém estará sempre por
                    baixo só porque entrou tarde.
                    </li>
                </ul>
                </li>
            </ul>
            </div>

    </div>
</template>
<script setup lang="ts">

</script>
<style lang="css" scoped></style>