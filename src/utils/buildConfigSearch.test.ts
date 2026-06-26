import { describe, expect, it } from 'vitest'
import { createAppState } from '@/test/createAppState'
import { buildConfigSearch } from './buildConfigSearch'

describe('buildConfigSearch', () => {
  it('returns empty string for default state', () => {
    expect(buildConfigSearch(createAppState())).toBe('')
  })

  it('returns query string prefixed with question mark', () => {
    const search = buildConfigSearch(
      createAppState({
        message: 'Banner',
        bgColor: '#ff0000',
        mode: 'play',
      }),
    )

    expect(search.startsWith('?')).toBe(true)
    expect(search).toContain('m=Banner')
    expect(search).toContain('b=%23f00')
    expect(search).toContain('p=1')
  })
})
