export default defineNuxtConfig({
  modules: [['../src/module', {precision:1}], "nuxt-icon"],
  devtools: { enabled: true },
  ssr: false,
  css: ["vuetify/lib/styles/main.sass"],
  build: {
    transpile: ["vuetify"],
  },
})
