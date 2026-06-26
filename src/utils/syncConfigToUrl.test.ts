import { afterEach, describe, expect, it, vi } from 'vitest'
import { createAppState } from '@/test/createAppState'
import { syncConfigToUrl } from './syncConfigToUrl'

describe('syncConfigToUrl', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('replaces history state with pathname, query, and hash', () => {
    const replaceState = vi.fn()
    vi.stubGlobal('history', { replaceState })
    vi.stubGlobal('location', {
      pathname: '/app',
      hash: '#section',
    })

    syncConfigToUrl(createAppState({ message: 'Hi' }))

    expect(replaceState).toHaveBeenCalledWith(null, '', '/app?m=Hi#section')
  })
})
