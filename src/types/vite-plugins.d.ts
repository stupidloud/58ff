declare module 'vite-plugin-html' {
  import type { Plugin } from 'vite'
  export function createHtmlPlugin(options?: any): Plugin
}

declare module 'vite-plugin-vue-devtools' {
  import type { Plugin } from 'vite'
  const plugin: () => Plugin
  export default plugin
}

declare module 'vite-plugin-pwa' {
  import type { Plugin } from 'vite'
  export function VitePWA(options?: any): Plugin
}
