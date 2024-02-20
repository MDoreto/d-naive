// plugins/vuetify.js
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import "@mdi/font/css/materialdesignicons.css"

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    components,
    directives,
    icons: { defaultSet: "mdi" },
    theme: {
      defaultTheme: "barzel",
      themes: {
        barzel: {
          dark: false,
          colors: {
            primary: "#212b59",
            backfilter: "#ECEFF1",
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
