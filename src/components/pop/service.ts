import { createApp, reactive } from 'vue'
import Pop from './Pop.vue'

let mounted = false
const state = reactive({
  visible: false,
  title: '',
  subtitle: '',
  code: '',
  lines: [] as string[],
  buttonText: '',
  onClick: undefined as undefined | (() => void),
  onClose: undefined as undefined | (() => void),
})

export function mountPop() {
  if (mounted) return
  const container = document.createElement('div')
  container.id = 'pop-app'
  document.body.appendChild(container)

  const app = createApp(Pop)
  app.provide('popState', state)
  app.mount(container)
  mounted = true
}

export function showPop(payload?: Partial<typeof state>) {
  Object.assign(state, payload || {})
  state.visible = true
}

export function hidePop() {
  state.visible = false
}