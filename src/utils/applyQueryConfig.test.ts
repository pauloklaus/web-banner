import { describe, expect, it } from 'vitest'
import { createAppState } from '@/test/createAppState'
import { applyQueryConfig } from './applyQueryConfig'

describe('applyQueryConfig', () => {
  it('applies decoded config to state', () => {
    const state = createAppState()

    applyQueryConfig('m=Hello&b=%23f00&f=white&s=2', state)

    expect(state.message.value).toBe('Hello')
    expect(state.bgColor.value).toBe('#ff0000')
    expect(state.textColor.value).toBe('#ffffff')
    expect(state.speedMultiplier.value).toBe(2)
    expect(state.mode.value).toBe('edit')
  })

  it('enters play mode when play flag is set and message is not empty', () => {
    const state = createAppState()

    applyQueryConfig('m=Hello&p=1', state)

    expect(state.mode.value).toBe('play')
  })

  it('does not enter play mode when message is empty', () => {
    const state = createAppState({ mode: 'edit' })

    applyQueryConfig('p=1', state)

    expect(state.mode.value).toBe('edit')
  })

  it('ignores queries without config keys', () => {
    const state = createAppState({
      message: 'Keep me',
      bgColor: '#123456',
    })

    applyQueryConfig('?foo=bar', state)

    expect(state.message.value).toBe('Keep me')
    expect(state.bgColor.value).toBe('#123456')
  })
})
