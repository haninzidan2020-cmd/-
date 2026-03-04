import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'; // الضيف الجديد اللي هيحل المشكلة

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // حطيناه هنا عشان يشغل الألوان والتصميم
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'صحتك بالدنيا',
        short_name: 'صحتك',
        description: 'تطبيق ذكي لمتابعة الصحة، السكر، الضغط، واليوميات الغذائية',
        theme_color: '#10b981',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ]
});
