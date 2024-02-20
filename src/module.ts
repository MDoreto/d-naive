import { defineNuxtModule, addPlugin, createResolver, addComponentsDir,addImports } from '@nuxt/kit'

// Module options TypeScript interface definition
export interface ModuleOptions {}

export default defineNuxtModule<ModuleOptions>({
  meta: {
    name: 'd-naive',
    configKey: 'd-naive'
  },
  // Default configuration options of the Nuxt module
  defaults: {},
  setup() {
    const { resolve } = createResolver(import.meta.url)

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
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
  }
})
