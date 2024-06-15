// vite.config.js
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    reactRefresh(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', 'icons/*'], // Add your specific assets here
      manifest: {
        name: 'Your App Name',
        short_name: 'App Name',
        theme_color: '#007bff', // Your preferred theme color
        icons: [
          {
            src: '/icons/icon-192x192.png', // Path to your 192x192 icon
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512x512.png', // Path to your 512x512 icon
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
});
