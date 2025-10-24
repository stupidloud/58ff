import { createApp, type App } from 'vue'
import Toast from './Toast.vue'

let toastApp: App<Element> | null = null
let toastInstance: any = null

export function mountToast() {
  if (toastApp || toastInstance) return
  const container = document.createElement('div')
  container.id = 'toast-container'
  document.body.appendChild(container)
  toastApp = createApp(Toast)
  toastInstance = toastApp.mount(container) as any
}

export function unmountToast() {
  if (toastApp && toastInstance) {
    toastApp.unmount()
    toastApp = null
    toastInstance = null
    const container = document.getElementById('toast-container')
    if (container) document.body.removeChild(container)
  }
}

export interface ToastOptions {
  duration?: number
}

export function showToast(message: string, options: ToastOptions = {}) {
  if (!toastInstance) mountToast()
  toastInstance?.show({ message, duration: options.duration })
}

export function hideToast() {
  toastInstance?.hide()
}

declare global {
  interface Window {
    showToast: (message: string, options?: ToastOptions) => void
    hideToast: () => void
  }
}

if (typeof window !== 'undefined') {
  window.showToast = showToast
  window.hideToast = hideToast
}