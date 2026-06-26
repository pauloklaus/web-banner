import { describe, expect, it } from 'vitest'
import { MAX_MESSAGE_LENGTH } from '@/constants'
import { toPlainText } from './toPlainText'

describe('toPlainText', () => {
  it('returns empty string for null and undefined', () => {
    expect(toPlainText(null)).toBe('')
    expect(toPlainText(undefined)).toBe('')
  })

  it('converts values to plain text', () => {
    expect(toPlainText('Hello')).toBe('Hello')
    expect(toPlainText(42)).toBe('42')
  })

  it('strips control characters', () => {
    expect(toPlainText('a\u0000b\u0007c')).toBe('abc')
  })

  it('collapses line breaks and tabs into spaces', () => {
    expect(toPlainText('line one\nline two\t tab')).toBe('line one line two  tab')
  })

  it('truncates to max message length', () => {
    const longText = 'a'.repeat(MAX_MESSAGE_LENGTH + 20)
    expect(toPlainText(longText)).toHaveLength(MAX_MESSAGE_LENGTH)
  })

  it('does not interpret HTML tags as markup', () => {
    expect(toPlainText('<script>alert(1)</script>')).toBe(
      '<script>alert(1)</script>',
    )
  })
})
