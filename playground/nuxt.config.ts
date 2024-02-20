export default defineNuxtConfig({
  modules: ['../src/module'],
  devtools: { enabled: true },
  ssr: false,
  css: ["vuetify/lib/styles/main.sass"],
  build: {
    transpile: ["vuetify"],
  },
})
