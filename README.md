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

## See also

- [Pinia Colada](https://pinia-colada.esm.dev)
- [`vike-vue-pinia`](https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-pinia) — Reference implementation for Pinia integration
