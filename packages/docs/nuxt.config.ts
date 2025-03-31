// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxt/ui"],

  app: {
    baseURL: '/japanmesh',
    buildAssetsDir: '/assets/',
  },

  colorMode: {
    preference: 'light'
  },

  compatibilityDate: '2025-03-31',
})