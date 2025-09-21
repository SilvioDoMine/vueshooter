// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/test-utils/module',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@vite-pwa/nuxt',
  ],
  pwa: {
    /* Configuration options */
    strategies: 'generateSW',
    // srcDir: 'service-worker',
    // filename: 'sw.js',
    registerType: 'autoUpdate',
    manifest: {
      name: 'Spaceshooter',
      short_name: 'Spaceshooter',
      description: 'A simple 3D multiplayer shooter game built with Nuxt 4 and Three.js',
      start_url: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#000000',
      icons: [
        {
          src: '/icon-48x48.png',
          sizes: '48x48',
          type: 'image/png',
        },
        {
          src: '/icon-72x72.png',
          sizes: '72x72',
          type: 'image/png',
        },
        {
          src: '/icon-96x96.png',
          sizes: '96x96',
          type: 'image/png',
        },
        {
          src: '/icon-128x128.png',
          sizes: '128x128',
          type: 'image/png',
        },
        {
          src: '/icon-144x144.png',
          sizes: '144x144',
          type: 'image/png',
        },
        {
          src: '/icon-152x152.png',
          sizes: '152x152',
          type: 'image/png',
        },
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-384x384.png',
          sizes: '384x384',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  ssr: false, // Three.js needs client-side rendering
  app: {
    head: {
      meta: [
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover'
        },
        {
          name: 'apple-mobile-web-app-status-bar-style',
          content: 'black-translucent'
        }
      ]
    }
  }
})