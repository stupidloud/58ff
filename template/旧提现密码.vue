<template>
    <div class="h-screen flex flex-col relative z-10 bg-[var(--color-bg-main)]">
        <CommonHeader>
            Senha de Saque
        </CommonHeader>

        <div class="p-[1rem] flex-1">
            <!-- 重新定义提现密码标题 -->
            <div class="mb-[1.5rem]">
                <h2 class="text-white text-[1.2rem] font-medium">
                    Redefinir Senha de Saque
                </h2>
            </div>

            <!-- 新密码输入 -->
            <div class="mb-[2rem]">
                <WithdrawPasswordInput
                    v-model="newPassword"
                    label="Nova Senha de Saque"
                    :show-label="true"
                    @complete="handleNewPasswordComplete"
                />
            </div>

            <!-- 确认密码输入 -->
            <div class="mb-[2rem]">
                <WithdrawPasswordInput
                    v-model="confirmPassword"
                    label="Confirme a Nova Senha de Saque"
                    :show-label="true"
                    @complete="handleConfirmPasswordComplete"
                />
            </div>

            <!-- 警告提示 -->
            <div class="mb-[3rem]">
                <p class="text-[var(--color-warning)] text-[1rem] !leading-relaxed">
                    Atenção: A senha de saque protege seus fundos e é extremamente importante. Mantenha-a em segredo para prevenir qualquer perda financeira
                </p>
            </div>
        </div>

        <!-- 底部按钮 -->
        <div class="absolute bottom-0 left-0 w-full bg-[var(--color-bg-primary)] flex items-center p-[1rem] pb-[2rem] justify-space-between">         
            <Button class="w-[100%] h-[3.6rem] flex items-center justify-center m-auto px-[1.5rem] rounded-[.5rem] bg-[var(--color-active)] text-[var(--color-bg-primary)] text-[1.2rem]"                                                          
                    @click="handleSubmit">
                    {{ loading ? 'Processando...' : 'Próximo' }}
            </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import Button from '../../components/ui/Button.vue'
import { playerApi } from '../../services/api'
import { $toast } from '../../components/common/toast'
import WithdrawPasswordInput from '../../components/ui/WithdrawPasswordInput.vue'

// 定义props(接收从App.vue传递的属性,但不使用)
interface Props {
  initialTab?: string
  promotionInitialTab?: string
}

withDefaults(defineProps<Props>(), {
  initialTab: '',
  promotionInitialTab: ''
})

// 定义emits(接收从App.vue传递的事件监听器,但不使用)
defineEmits<{
  'open-modal': [tab: 'login' | 'register']
  'open-deposit-modal': []
  'announcement-click': []
  'navigate-to-slots': []
  'return': []
}>()

const router = useRouter()

// 响应式数据
const loading = ref(false)

// 密码状态
const newPassword = ref('')
const confirmPassword = ref('')

// 表单验证
const isFormValid = computed(() => {
  const newPasswordValue = newPassword.value
  const confirmPasswordValue = confirmPassword.value

  return newPasswordValue.length === 6 &&
         confirmPasswordValue.length === 6 &&
         newPasswordValue === confirmPasswordValue &&
         /^\d{6}$/.test(newPasswordValue)
})

// 处理密码输入完成
const handleNewPasswordComplete = (password: string) => {
    console.log('新密码输入完成:', password);
}

const handleConfirmPasswordComplete = (password: string) => {
    console.log('确认密码输入完成:', password);
}



// 提交处理
const handleSubmit = async () => {
  if (loading.value || !isFormValid.value) return

  const newPasswordValue = newPassword.value
  const confirmPasswordValue = confirmPassword.value

  // 表单验证
  if (newPasswordValue.length !== 6) {
    $toast.error('A senha de saque deve ter 6 dígitos')
    return
  }

  if (!/^\d{6}$/.test(newPasswordValue)) {
    $toast.error('A senha de saque deve conter apenas números')
    return
  }

  if (confirmPasswordValue.length !== 6) {
    $toast.error('Por favor, confirme a senha de saque')
    return
  }

  if (newPasswordValue !== confirmPasswordValue) {
    $toast.error('As senhas não coincidem')
    return
  }

  try {
    loading.value = true

    // 调用设置提现密码的API（用于修改密码）
    const response = await playerApi.setWithdrawPassword(newPasswordValue)

    if (response.code === 1) {
      // 显示成功消息
      $toast.success('Senha de saque alterada com sucesso!')

      // 延迟一下再返回，让用户看到成功提示
      setTimeout(() => {
        router.back()
      }, 1500)
    } else {
      // 检查是否是认证相关错误
      if (response.code === 1002 || response.code === 1004 || response.code === 1006 || response.code === 1007) {
        $toast.error('Sessão expirada. Faça login novamente.') // 会话已过期，请重新登录
        return
      }

      $toast.error(response.msg || 'Erro ao alterar senha de saque')
    }

  } catch (error: any) {
    console.error('修改提现密码失败:', error)
    const errorMsg = error instanceof Error ? error.message : 'Erro ao alterar senha de saque, tente novamente'
    $toast.error(errorMsg)
  } finally {
    loading.value = false
  }
}
</script>