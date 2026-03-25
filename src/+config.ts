import type { PiniaColadaOptions, serializeQueryCache } from '@pinia/colada'
import type { Pinia, StateTree } from 'pinia'
// eslint-disable-next-line unused-imports/no-unused-imports
import type _vikeVue from 'vike-vue/config' // Needed for declaration merging of Config
import type { Config } from 'vike/types'

export default {
  name: 'vike-vue-pinia-colada',
  require: {
    'vike': '>=0.4.255',
    'vike-vue': '>=0.9.0',
  },
  passToClient: ['_piniaInitialState', '_piniaColadaCache'],
  onCreateApp: 'import:vike-vue-pinia-colada/__internal/integration/onCreateApp:onCreateApp',
  onAfterRenderHtml: 'import:vike-vue-pinia-colada/__internal/integration/onAfterRenderHtml:onAfterRenderHtml',
  onCreatePageContext: 'import:vike-vue-pinia-colada/__internal/integration/onCreatePageContext:onCreatePageContext',
  meta: {
    onCreatePinia: {
      env: { client: true, server: true },
      cumulative: true,
    },
    piniaColadaOptions: {
      env: { client: true, server: true },
    },
  },
} satisfies Config

declare global {
  namespace Vike {
    interface PageContext {
      pinia?: Pinia
      _piniaInitialState?: StateTree
      _piniaColadaCache?: ReturnType<typeof serializeQueryCache>
    }
    interface GlobalContext {
      pinia?: Pinia
    }
    interface Config {
      /**
       * Hook called after creating the Pinia instance.
       *
       * Use this to register Pinia plugins.
       */
      onCreatePinia?: (pageContext: PageContext) => void | Promise<void>
      /**
       * Options passed to the Pinia Colada plugin.
       *
       * @see https://pinia-colada.esm.dev/guide/installation.html
       */
      piniaColadaOptions?: PiniaColadaOptions
    }
    interface ConfigResolved {
      onCreatePinia?: Array<(pageContext: PageContext) => void | Promise<void>>
      piniaColadaOptions?: PiniaColadaOptions
    }
  }
}
