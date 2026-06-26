import { describe, expect, it } from 'vitest'
import { decodeQueryConfig } from './decodeQueryConfig'

describe('decodeQueryConfig', () => {
  it('returns null when no config keys are present', () => {
    expect(decodeQueryConfig('')).toBeNull()
    expect(decodeQueryConfig('?foo=bar')).toBeNull()
  })

  it('decodes query string with or without leading question mark', () => {
    const fromBare = decodeQueryConfig('m=Hello&b=red&f=white&s=2&p=1')
    const fromPrefixed = decodeQueryConfig('?m=Hello&b=red&f=white&s=2&p=1')

    expect(fromBare).toEqual(fromPrefixed)
    expect(fromBare).toEqual({
      message: 'Hello',
      bg: '#ff0000',
      text: '#ffffff',
      speed: 2,
      play: true,
    })
  })

  it('uses defaults for omitted optional params', () => {
    expect(decodeQueryConfig('m=Only message')).toEqual({
      message: 'Only message',
      bg: '#000000',
      text: '#ffffff',
      speed: 1,
      play: false,
    })
  })
})
