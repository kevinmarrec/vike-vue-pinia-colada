import { hydrateQueryCache, PiniaColada, useQueryCache } from '@pinia/colada'
import type { PageContext } from 'vike/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { onCreateApp } from '../src/integration/+onCreateApp'

vi.mock('@pinia/colada', () => ({
  hydrateQueryCache: vi.fn(),
  PiniaColada: { install: vi.fn() },
  useQueryCache: vi.fn(() => 'mockQueryCache'),
}))

function createMockPinia() {
  return { state: { value: {} }, use: vi.fn() }
}

function createPageContext(overrides: Record<string, unknown> = {}) {
  return {
    isClientSide: false,
    app: { use: vi.fn() },
    globalContext: {},
    pinia: createMockPinia(),
    ...overrides,
  } as unknown as PageContext
}

describe('onCreateApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns early if app is not available', () => {
    const pageContext = createPageContext({ app: undefined as unknown as PageContext['app'] })

    onCreateApp(pageContext)

    expect(vi.mocked(hydrateQueryCache)).not.toHaveBeenCalled()
  })

  it('installs pinia and PiniaColada on the app', () => {
    const pageContext = createPageContext()

    onCreateApp(pageContext)

    expect(pageContext.app!.use).toHaveBeenCalledWith(pageContext.pinia)
    expect(pageContext.app!.use).toHaveBeenCalledWith(PiniaColada)
  })

  it('prefers globalContext.pinia over pageContext.pinia', () => {
    const globalPinia = createMockPinia()
    const pageContext = createPageContext({
      globalContext: { pinia: globalPinia },
    })

    onCreateApp(pageContext)

    expect(pageContext.app!.use).toHaveBeenCalledWith(globalPinia)
  })

  it('hydrates pinia state on client', () => {
    const pinia = createMockPinia()
    const initialState = { counter: { count: 42 } }
    const pageContext = createPageContext({
      isClientSide: true,
      pinia: pinia as unknown as PageContext['pinia'],
      _piniaInitialState: initialState,
    })

    onCreateApp(pageContext)

    expect(pinia.state.value).toBe(initialState)
  })

  it('hydrates colada cache on client', () => {
    const pinia = createMockPinia()
    const cache = { todos: { data: [1, 2, 3] } }
    const pageContext = createPageContext({
      isClientSide: true,
      pinia: pinia as unknown as PageContext['pinia'],
      _piniaColadaCache: cache as unknown as PageContext['_piniaColadaCache'],
    })

    onCreateApp(pageContext)

    expect(useQueryCache).toHaveBeenCalledWith(pinia)
    expect(hydrateQueryCache).toHaveBeenCalledWith('mockQueryCache', cache)
  })

  it('does not hydrate on server', () => {
    const pageContext = createPageContext({
      isClientSide: false,
      _piniaInitialState: { counter: { count: 1 } },
      _piniaColadaCache: {} as PageContext['_piniaColadaCache'],
    })

    onCreateApp(pageContext)

    expect(vi.mocked(hydrateQueryCache)).not.toHaveBeenCalled()
  })

  it('does not hydrate if no initial state or cache', () => {
    const pinia = createMockPinia()
    const pageContext = createPageContext({
      isClientSide: true,
      pinia: pinia as unknown as PageContext['pinia'],
    })

    onCreateApp(pageContext)

    expect(pinia.state.value).toEqual({})
    expect(vi.mocked(hydrateQueryCache)).not.toHaveBeenCalled()
  })
})
