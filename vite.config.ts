import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'صحتك بالدنيا', // اسم التطبيق الكامل
        short_name: 'صحتك', // الاسم القصير اللي هيظهر تحت الأيقونة
        description: 'تطبيق ذكي لمتابعة الصحة، السكر، الضغط، واليوميات الغذائية',
        theme_color: '#10b981', // لون شريط الموبايل من فوق (الزمردي بتاعنا)
        background_color: '#ffffff',
        display: 'standalone', // السر هنا: ده اللي بيخليه يفتح شاشة كاملة بدون شريط المتصفح
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