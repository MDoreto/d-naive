import { defineNuxtPlugin } from '#app'
import naive from "naive-ui"
export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(naive)

})
