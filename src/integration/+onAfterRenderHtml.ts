import { serializeQueryCache, useQueryCache } from '@pinia/colada'
import type { PageContextServer } from 'vike/types'

export function onAfterRenderHtml(pageContext: PageContextServer) {
  if (!pageContext.pinia) return

  // Serialize Colada cache before cleaning pinia state
  pageContext._piniaColadaCache = serializeQueryCache(useQueryCache(pageContext.pinia))

  // Remove Colada stores (contain non-serializable functions)
  delete pageContext.pinia.state.value._pc_query
  delete pageContext.pinia.state.value._pc_mutation

  // Capture remaining pinia state
  pageContext._piniaInitialState = pageContext.pinia.state.value
}
