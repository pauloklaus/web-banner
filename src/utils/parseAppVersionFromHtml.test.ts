import { describe, expect, it } from 'vitest'
import { parseAppVersionFromHtml } from './parseAppVersionFromHtml'

describe('parseAppVersionFromHtml', () => {
  it('reads app version from meta tag', () => {
    const html = '<html><head><meta name="app-version" content="1.2.3" /></head></html>'

    expect(parseAppVersionFromHtml(html)).toBe('1.2.3')
  })

  it('returns undefined when meta tag is missing', () => {
    expect(parseAppVersionFromHtml('<html><head></head></html>')).toBeUndefined()
  })
})
