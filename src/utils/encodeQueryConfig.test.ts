import { describe, expect, it } from 'vitest'
import { createAppState } from '@/test/createAppState'
import { encodeQueryConfig } from './encodeQueryConfig'

describe('encodeQueryConfig', () => {
  it('omits params that match defaults', () => {
    const params = encodeQueryConfig(createAppState())

    expect(params.toString()).toBe('')
  })

  it('encodes message and non-default options', () => {
    const params = encodeQueryConfig(
      createAppState({
        message: 'Banner text',
        bgColor: '#ff0000',
        textColor: '#00ff00',
        speedMultiplier: 4,
        mode: 'play',
      }),
    )

    expect(params.get('m')).toBe('Banner text')
    expect(params.get('b')).toBe('#f00')
    expect(params.get('f')).toBe('#0f0')
    expect(params.get('s')).toBe('4')
    expect(params.get('p')).toBe('1')
  })

  it('does not set play when message is empty', () => {
    const params = encodeQueryConfig(
      createAppState({
        message: '   ',
        mode: 'play',
      }),
    )

    expect(params.has('p')).toBe(false)
  })
})
