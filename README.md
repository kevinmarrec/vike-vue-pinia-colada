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

## Pinia Colada Options

You can pass options to the Pinia Colada plugin via the `piniaColadaOptions` config:

```js
// pages/+config.js

export default {
  piniaColadaOptions: {
    queryOptions: {
      staleTime: 5000,
    },
  }
}
```

All options from [`PiniaColadaOptions`](https://pinia-colada.esm.dev/guide/installation.html) are supported.

## Why a separate extension?

Pinia Colada stores its query cache inside Pinia, but serializing it through Pinia's standard state hydration doesn't work reliably — cache keys can be functions, which aren't serializable out of the box. This causes issues when relying solely on `vike-vue-pinia` for SSR.

The recommended approach is to use the dedicated helpers provided by Pinia Colada ([`serializeQueryCache`](https://pinia-colada.esm.dev/guide/ssr.html) / `reviveQueryCache`) to correctly serialize the query cache on the server and hydrate it on the client. This is exactly what this extension does under the hood.

## Architecture differences with `vike-vue-pinia`

This extension differs from `vike-vue-pinia` in how Pinia is initialized:

- **`vike-vue-pinia`** uses `+onCreatePageContext.ssr.ts` for server-side Pinia creation, then creates the client-side instance separately in `+onCreateApp.ts` via a shared `createPiniaPlus` helper.
- **`vike-vue-pinia-colada`** uses a single `+onCreatePageContext.ts` (no `.ssr` suffix) that handles both environments. On the client, it early-returns if a Pinia instance already exists on `globalContext`.

Both approaches avoid unnecessary `pageContext.json` requests during client-side navigation:

- `.ssr.js` hooks only run during SSR (initial server render), not during client-side navigation.
- No-suffix hooks run on both server and client — during client-side navigation, they execute client-side, so no server round-trip is needed.
- Only `.server.js` hooks would trigger `pageContext.json` requests during client-side navigation.

The result is a simpler implementation: one hook handles Pinia creation in both environments, while `+onCreateApp` focuses solely on app plugin installation and hydration. The trade-off is a negligible extra `onCreatePageContext` call on each client-side navigation (which immediately early-returns).

## See also

- [Pinia Colada](https://pinia-colada.esm.dev)
- [`vike-vue-pinia`](https://github.com/vikejs/vike-vue/tree/main/packages/vike-vue-pinia) — Reference implementation for Pinia integration
