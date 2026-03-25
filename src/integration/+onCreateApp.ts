import { hydrateQueryCache, PiniaColada, useQueryCache } from '@pinia/colada'
import type { PageContext } from 'vike/types'

export function onCreateApp(pageContext: PageContext) {
  if (!pageContext.app) return

  const pinia = pageContext.globalContext.pinia ?? pageContext.pinia!

  if (pageContext.isClientSide) {
    const { _piniaInitialState, _piniaColadaCache } = pageContext
    if (_piniaInitialState) pinia.state.value = _piniaInitialState
    if (_piniaColadaCache) hydrateQueryCache(useQueryCache(pinia), _piniaColadaCache)
  }

  pageContext.app.use(pinia)
  pageContext.app.use(PiniaColada, pageContext.config.piniaColadaOptions)
}
