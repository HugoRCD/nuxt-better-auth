// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxthub/core'],

  devtools: { enabled: true },

  hub: {
    db: 'postgresql',
    kv: true
  },

  runtimeConfig: {
    public: {
      auth: {
        redirectUserTo: '/app/user',
        redirectGuestTo: '/',
      },
    },
  },

  nitro: {
    experimental: {
      asyncContext: true
    },
    routeRules: {
      '/app/**': {
        ssr: false
      }
    }
  },

  css: ['~/assets/css/index.css'],

  compatibilityDate: '2025-05-13',
})
