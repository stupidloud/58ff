import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const port = Number(env.VITE_PORT) || 5173
  return {
    plugins: [
      vue({
        template: {
          compilerOptions: {
            isCustomElement: tag => tag === 'ion-icon'
          }
        }
      }),
      tailwindcss(),
      vueDevTools(),
      createHtmlPlugin({
        inject: {
          data: {
            SITE_NAME: env.VITE_SITE_NAME || 'Iara-777',
            SITE_SHORT_NAME: env.VITE_SITE_SHORT_NAME || 'Iara',
            SITE_DESCRIPTION: env.VITE_SITE_DESCRIPTION || 'Iara-777'
          }
        }
      }),
      VitePWA({
        strategies: 'injectManifest',
        srcDir: 'public',
        filename: 'sw.js',
        registerType: 'prompt',
        injectRegister: null,
        includeAssets: ['favicon.png', 'icon-192.png', 'icon-512.png'],
        manifest: {
          name: env.VITE_SITE_NAME || 'Iara-777',
          short_name: env.VITE_SITE_SHORT_NAME || 'Iara',
          description: env.VITE_SITE_DESCRIPTION || 'Iara-777',
          theme_color: '#ff6b35',
          background_color: '#1a1a1a',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          lang: 'pt-BR',
          dir: 'ltr',
          categories: ['entertainment', 'games'],
          icons: [
            { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
            { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' }
          ]
        },
        injectManifest: {
          globPatterns: [],
          injectionPoint: undefined,
          rollupFormat: 'iife'
        },
        manifestFilename: 'manifest.webmanifest',
        useCredentials: false,
        devOptions: {
          enabled: true,
          type: 'module'
        }
      })
    ],
    build: {
      cssCodeSplit: false,
      rollupOptions: {
        output: {
          assetFileNames: (assetInfo) => {
            if (assetInfo.name && assetInfo.name.endsWith('.css')) {
              return 'assets/style-[hash].css'
            }
            return 'assets/[name]-[hash][extname]'
          }
        }
      }
    },
    server: {
      host: '0.0.0.0',
      port,
      proxy: {
        '/api_v1': {
          target: 'https://ondas-777.com',
          changeOrigin: true,
          secure: true
        }
      }
    }
  }
})
