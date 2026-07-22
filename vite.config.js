import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.js',
      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
      manifest: {
        name: 'ГС Заказы',
        short_name: 'ГС Заказы',
        description: 'Панель управления заказами',
        theme_color: '#6d4ff6',
        background_color: '#07070d',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/gastro-admin/',
        scope: '/gastro-admin/',
        id: '/gastro-admin/',
        lang: 'ru',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
    })
  ],
  base: '/gastro-admin/',
  build: { outDir: 'dist', assetsInlineLimit: 0 },
  server: { host: '0.0.0.0', port: 5174 }
})
