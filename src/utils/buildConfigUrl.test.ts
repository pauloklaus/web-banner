import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAppState } from '@/test/createAppState'
import { buildConfigUrl } from './buildConfigUrl'

describe('buildConfigUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('builds full url from origin, pathname, and config search', () => {
    vi.stubGlobal('location', {
      origin: 'https://example.com',
      pathname: '/banner',
    })

    const url = buildConfigUrl(createAppState({ message: 'Hi' }))

    expect(url).toBe('https://example.com/banner?m=Hi')
  })
})
