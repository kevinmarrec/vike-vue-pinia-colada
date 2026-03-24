import { serializeQueryCache, useQueryCache } from '@pinia/colada'
import type { PageContextServer } from 'vike/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { onAfterRenderHtml } from '../src/integration/+onAfterRenderHtml'

vi.mock('@pinia/colada', () => ({
  serializeQueryCache: vi.fn(() => ({ todos: { data: [1, 2, 3] } })),
  useQueryCache: vi.fn(() => 'mockQueryCache'),
}))

function createPageContext(overrides: Record<string, unknown> = {}) {
  return {
    pinia: {
      state: {
        value: {
          counter: { count: 1 },
          _pc_query: { someQuery: {} },
          _pc_mutation: { someMutation: {} },
        },
      },
    },
    ...overrides,
  } as unknown as PageContextServer
}

describe('onAfterRenderHtml', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns early if pinia is not available', () => {
    const pageContext = createPageContext({ pinia: undefined })

    onAfterRenderHtml(pageContext)

    expect(vi.mocked(serializeQueryCache)).not.toHaveBeenCalled()
    expect(pageContext._piniaColadaCache).toBeUndefined()
    expect(pageContext._piniaInitialState).toBeUndefined()
  })

  it('serializes colada query cache', () => {
    const pageContext = createPageContext()

    onAfterRenderHtml(pageContext)

    expect(useQueryCache).toHaveBeenCalledWith(pageContext.pinia)
    expect(serializeQueryCache).toHaveBeenCalledWith('mockQueryCache')
    expect(pageContext._piniaColadaCache).toEqual({ todos: { data: [1, 2, 3] } })
  })

  it('removes colada stores from pinia state', () => {
    const pageContext = createPageContext()

    onAfterRenderHtml(pageContext)

    expect(pageContext.pinia!.state.value._pc_query).toBeUndefined()
    expect(pageContext.pinia!.state.value._pc_mutation).toBeUndefined()
  })

  it('captures remaining pinia state', () => {
    const pageContext = createPageContext()

    onAfterRenderHtml(pageContext)

    expect(pageContext._piniaInitialState).toEqual({ counter: { count: 1 } })
  })
})
