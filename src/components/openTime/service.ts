import { createApp, reactive } from 'vue'
import OpenTime from './OpenTime.vue'

let mounted = false
const state = reactive({
  visible: false,
  onClose: undefined as undefined | (() => void),
})

export function mountOpenTime() {
  if (mounted) return
  const container = document.createElement('div')
  container.id = 'open-time-app'
  document.body.appendChild(container)

  const app = createApp(OpenTime)
  app.provide('openTimeState', state)
  app.mount(container)
  mounted = true
}

export function showOpenTime(payload?: { onClose?: () => void }) {
  Object.assign(state, payload || {})
  state.visible = true
}

export function hideOpenTime() {
  state.visible = false
}