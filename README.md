[![npm version](https://img.shields.io/npm/v/vike-vue-pinia-colada)](https://www.npmjs.com/package/vike-vue-pinia-colada)

# `vike-vue-pinia-colada`

[Pinia Colada](https://pinia-colada.esm.dev) integration for [`vike-vue`](https://vike.dev/vike-vue) with SSR support.

Built on top of the same patterns as [`vike-vue-pinia`](https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-pinia), with added Pinia Colada query cache serialization/hydration.

> [!NOTE]
> Pinia is included — you don't need `vike-vue-pinia` alongside this extension.

## Installation

1. `npm install vike-vue-pinia-colada pinia @pinia/colada`
2. Extend `+config.js`:

   ```js
   // pages/+config.js

   import vikeVuePiniaColada from 'vike-vue-pinia-colada/config'
   import vikeVue from 'vike-vue/config'

   export default {
     // ...
     extends: [vikeVue, vikeVuePiniaColada]
   }
   ```

## Why a separate extension?

Pinia Colada stores its query cache inside Pinia, but serializing it through Pinia's standard state hydration doesn't work reliably — cache keys can be functions, which aren't serializable out of the box. This causes issues when relying solely on `vike-vue-pinia` for SSR.

The recommended approach is to use the dedicated helpers provided by Pinia Colada ([`serializeQueryCache`](https://pinia-colada.esm.dev/guide/ssr.html) / `reviveQueryCache`) to correctly serialize the query cache on the server and hydrate it on the client. This is exactly what this extension does under the hood.

## See also

- [Pinia Colada](https://pinia-colada.esm.dev)
- [`vike-vue-pinia`](https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-pinia) — Reference implementation for Pinia integration
