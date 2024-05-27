import { defineNuxtModule, createResolver, addComponentsDir, addImports, addPluginTemplate } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions { }
export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'd-naive',
    configKey: 'd-naive'
  },
  // Default configuration options of the Nuxt module
  defaults: {
  },
  setup(options) {
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
    addPluginTemplate({ getContents: () => plugin, filename: "plugin.mjs" })
  }
})
