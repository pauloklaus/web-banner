import { afterEach, describe, expect, it } from 'vitest'
import { readLoadedAppVersion } from './readLoadedAppVersion'

describe('readLoadedAppVersion', () => {
  afterEach(() => {
    document.head.innerHTML = ''
  })

  it('reads app version from document meta tag', () => {
    document.head.innerHTML = '<meta name="app-version" content="0.1.0" />'

    expect(readLoadedAppVersion()).toBe('0.1.0')
  })

  it('returns undefined when meta tag is missing', () => {
    expect(readLoadedAppVersion()).toBeUndefined()
  })
})
