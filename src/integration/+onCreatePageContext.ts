import { createPinia } from 'pinia'
import type { PageContext } from 'vike/types'

export async function onCreatePageContext(pageContext: PageContext) {
  // Client: reuse existing pinia instance across navigations
  if (pageContext.isClientSide && pageContext.globalContext.pinia) return

  const pinia = createPinia()

  // Client: store on globalContext so it persists across navigations (implicitly sets pageContext.pinia as fallback)
  // Server: store on pageContext so each request gets a fresh instance
  const context = pageContext.isClientSide ? pageContext.globalContext : pageContext
  context.pinia = pinia

  // Call +onCreatePinia hooks
  const { onCreatePinia } = pageContext.config
  if (onCreatePinia) {
    await Promise.all(onCreatePinia.map(hook => hook(pageContext)))
  }
}
