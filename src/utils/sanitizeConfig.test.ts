import { describe, expect, it } from 'vitest'
import { CONFIG_DEFAULTS } from '@/constants'
import { sanitizeConfig } from './sanitizeConfig'

describe('sanitizeConfig', () => {
  it('returns null for non-object input', () => {
    expect(sanitizeConfig(null)).toBeNull()
    expect(sanitizeConfig('text')).toBeNull()
    expect(sanitizeConfig([])).toBeNull()
  })

  it('sanitizes a valid config', () => {
    expect(
      sanitizeConfig({
        message: 'Hello',
        bg: '#112233',
        text: '#aabbcc',
        speed: 2,
        play: true,
      }),
    ).toEqual({
      message: 'Hello',
      bg: '#112233',
      text: '#aabbcc',
      speed: 2,
      play: true,
    })
  })

  it('falls back to defaults for invalid colors and speed', () => {
    expect(
      sanitizeConfig({
        message: 'Hi',
        bg: 'invalid',
        text: 'also-invalid',
        speed: 99,
        play: false,
      }),
    ).toEqual({
      message: 'Hi',
      bg: CONFIG_DEFAULTS.bg,
      text: CONFIG_DEFAULTS.text,
      speed: CONFIG_DEFAULTS.speed,
      play: false,
    })
  })

  it('accepts common play flag values', () => {
    expect(sanitizeConfig({ play: 1 })?.play).toBe(true)
    expect(sanitizeConfig({ play: '1' })?.play).toBe(true)
    expect(sanitizeConfig({ play: 'true' })?.play).toBe(true)
    expect(sanitizeConfig({ play: 0 })?.play).toBe(false)
    expect(sanitizeConfig({ play: 'yes' })?.play).toBe(false)
  })
})
