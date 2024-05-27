import { defineNuxtModule, createResolver, addComponentsDir, addImports, addPluginTemplate, addPlugin } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions { }
const path = require('path')
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'd-naive',
    configKey: 'd-naive'
  },
  // Default configuration options of the Nuxt module
  defaults: {
  },
  setup(options, nuxt) {
    const { resolve } = createResolver(import.meta.url)
    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`

    const plugin = `export default defineNuxtPlugin((nuxtApp) => {
       nuxtApp.provide('dNaive', ${JSON.stringify(options)}) 
    })`

    addComponentsDir({
      path: resolve('./runtime/components'),
      pathPrefix: false,
      prefix: 'd',
      global: true
    })
    addImports([
      ...[
        'formatValue',
        'getValue',
      ].map(n => ({ name: n, from: resolve('runtime/utils') })),
    ])
    addPluginTemplate({ getContents: () => plugin, write:true, dst: resolve("./runtime/observer.mjs"), filename: "plugin.mjs" })
  }
})
