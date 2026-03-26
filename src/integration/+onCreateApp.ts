import { hydrateQueryCache, PiniaColada, useQueryCache } from '@pinia/colada'
import type { PageContext } from 'vike/types'

export function onCreateApp(pageContext: PageContext) {
  if (!pageContext.app || pageContext.isRenderingHead) return

  const pinia = pageContext.globalContext.pinia ?? pageContext.pinia!
  const { app, config, isClientSide, _piniaInitialState, _piniaColadaCache } = pageContext

  if (isClientSide && _piniaInitialState) {
    pinia.state.value = _piniaInitialState
  }

  app.use(pinia)

  if (isClientSide && _piniaColadaCache) {
    hydrateQueryCache(useQueryCache(pinia), _piniaColadaCache)
  }

  app.use(PiniaColada, config.piniaColadaOptions)
}
