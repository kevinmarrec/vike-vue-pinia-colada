import { createPinia } from 'pinia'
import type { PageContext } from 'vike/types'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { onCreatePageContext } from '../src/integration/+onCreatePageContext'

vi.mock('pinia', () => ({
  createPinia: vi.fn(() => ({ state: { value: {} }, use: vi.fn() })),
}))

function createPageContext(overrides: Record<string, unknown> = {}) {
  return {
    isClientSide: false,
    globalContext: {},
    config: {},
    ...overrides,
  } as unknown as PageContext
}

describe('onCreatePageContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates pinia on pageContext for server', async () => {
    const pageContext = createPageContext()

    await onCreatePageContext(pageContext)

    expect(createPinia).toHaveBeenCalledOnce()
    expect(pageContext.pinia).toBeDefined()
    expect(pageContext.globalContext.pinia).toBeUndefined()
  })

  it('creates pinia on globalContext for client', async () => {
    const pageContext = createPageContext({ isClientSide: true })

    await onCreatePageContext(pageContext)

    expect(createPinia).toHaveBeenCalledOnce()
    expect(pageContext.globalContext.pinia).toBeDefined()
  })

  it('skips creation if globalContext.pinia already exists on client', async () => {
    const existingPinia = { state: { value: {} } }
    const pageContext = createPageContext({
      isClientSide: true,
      globalContext: { pinia: existingPinia },
    })

    await onCreatePageContext(pageContext)

    expect(createPinia).not.toHaveBeenCalled()
    expect(pageContext.globalContext.pinia).toBe(existingPinia)
  })

  it('calls onCreatePinia hooks', async () => {
    const hook1 = vi.fn()
    const hook2 = vi.fn()
    const pageContext = createPageContext({
      config: { onCreatePinia: [hook1, hook2] } as PageContext['config'],
    })

    await onCreatePageContext(pageContext)

    expect(hook1).toHaveBeenCalledWith(pageContext)
    expect(hook2).toHaveBeenCalledWith(pageContext)
  })

  it('does not fail when no onCreatePinia hooks are defined', async () => {
    const pageContext = createPageContext()

    await expect(onCreatePageContext(pageContext)).resolves.toBeUndefined()
  })
})
