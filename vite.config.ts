import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const port = Number(env.VITE_PORT) || 5173
  return {
    plugins: [vue({
      template: {
        compilerOptions: {
          isCustomElement: tag => tag === 'ion-icon'
        }
      }
    }), tailwindcss()],
    server: { port },
  }
})
