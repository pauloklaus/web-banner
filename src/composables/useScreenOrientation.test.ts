import { defineComponent, nextTick, ref } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useScreenOrientation } from './useScreenOrientation'
import type { AppMode } from '@/types/appMode'

const TestHost = defineComponent({
  props: {
    mode: {
      type: String as () => AppMode,
      required: true,
    },
  },
  setup(props) {
    const appMode = ref(props.mode)
    useScreenOrientation(appMode)
    return { appMode }
  },
  template: '<div />',
})

describe('useScreenOrientation', () => {
  const lock = vi.fn().mockResolvedValue(undefined)
  const unlock = vi.fn()

  beforeEach(() => {
    lock.mockClear()
    unlock.mockClear()
    Object.defineProperty(window, 'screen', {
      value: {
        orientation: { lock, unlock },
      },
      configurable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('locks portrait on mount in edit mode', async () => {
    mount(TestHost, { props: { mode: 'edit' } })
    await nextTick()

    expect(lock).toHaveBeenCalledWith('portrait-primary')
  })

  it('locks landscape when entering play mode', async () => {
    const wrapper = mount(TestHost, { props: { mode: 'edit' } })
    await nextTick()
    lock.mockClear()

    wrapper.vm.appMode = 'play'
    await nextTick()

    expect(lock).toHaveBeenCalledWith('landscape')
  })

  it('locks portrait when leaving play mode', async () => {
    const wrapper = mount(TestHost, { props: { mode: 'play' } })
    await nextTick()
    lock.mockClear()

    wrapper.vm.appMode = 'edit'
    await nextTick()

    expect(lock).toHaveBeenCalledWith('portrait-primary')
  })

  it('unlocks orientation on unmount', async () => {
    const wrapper = mount(TestHost, { props: { mode: 'edit' } })
    await nextTick()

    wrapper.unmount()

    expect(unlock).toHaveBeenCalled()
  })

  it('ignores when orientation lock is unavailable', async () => {
    Object.defineProperty(window, 'screen', {
      value: { orientation: {} },
      configurable: true,
    })

    expect(() => mount(TestHost, { props: { mode: 'play' } })).not.toThrow()
    await nextTick()
  })
})
