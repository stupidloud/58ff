import { createApp, reactive } from 'vue'
import InstallPrompt from './Install.vue'

let mounted = false
const state = reactive({
  visible: false,
  onCancel: undefined as undefined | (() => void),
  onConfirm: undefined as undefined | (() => void),
  onClose: undefined as undefined | (() => void),
})

export function mountInstall() {
  if (mounted) return
  const container = document.createElement('div')
  container.id = 'install-app'
  document.body.appendChild(container)

  const app = createApp(InstallPrompt)
  app.provide('installState', state)
  app.mount(container)
  mounted = true
}

export function showInstall(payload?: { onCancel?: () => void; onConfirm?: () => void; onClose?: () => void }) {
  Object.assign(state, payload || {})
  state.visible = true
}

export function hideInstall() {
  state.visible = false
}