import { describe, expect, it } from 'vitest'
import { parseColor } from './parseColor'

describe('parseColor', () => {
  it('returns null for empty or missing values', () => {
    expect(parseColor(null)).toBeNull()
    expect(parseColor(undefined)).toBeNull()
    expect(parseColor('')).toBeNull()
    expect(parseColor('   ')).toBeNull()
  })

  it('parses six-digit hex with hash', () => {
    expect(parseColor('#FF00AA')).toBe('#ff00aa')
    expect(parseColor('#ff00aa')).toBe('#ff00aa')
  })

  it('expands three-digit hex shorthand', () => {
    expect(parseColor('#f0a')).toBe('#ff00aa')
  })

  it('parses six-digit hex without hash', () => {
    expect(parseColor('ff00aa')).toBe('#ff00aa')
  })

  it('resolves named CSS colors', () => {
    expect(parseColor('red')).toBe('#ff0000')
    expect(parseColor('blue')).toBe('#0000ff')
  })

  it('returns null for invalid colors', () => {
    expect(parseColor('not-a-color')).toBeNull()
    expect(parseColor('#gggggg')).toBeNull()
    expect(parseColor('#12')).toBeNull()
  })
})
