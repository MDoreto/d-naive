import { defineNuxtPlugin } from '#app'
import naive from "naive-ui"
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(naive)
  console.log('Plugin injected by my-module!')

})
