import { describe, expect, it } from 'vitest'
import { nextSpeedOption } from './nextSpeedOption'

describe('nextSpeedOption', () => {
  it('cycles from 1x to 2x', () => {
    expect(nextSpeedOption(1)).toBe(2)
  })

  it('cycles from 2x to 4x', () => {
    expect(nextSpeedOption(2)).toBe(4)
  })

  it('cycles from 4x back to 1x', () => {
    expect(nextSpeedOption(4)).toBe(1)
  })
})
