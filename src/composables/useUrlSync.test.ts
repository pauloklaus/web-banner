import { defineComponent, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createAppState } from '@/test/createAppState'
import { useUrlSync } from './useUrlSync'

const TestHost = defineComponent({
  setup() {
    const state = createAppState()
    const { syncNow } = useUrlSync(state)
    return { state, syncNow }
  },
  template: '<div />',
})

describe('useUrlSync', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('history', { replaceState: vi.fn() })
    vi.stubGlobal('location', {
      pathname: '/',
      search: '?m=FromUrl&s=2',
      hash: '',
    })
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('loads config from url on mount and syncs immediately', async () => {
    const wrapper = mount(TestHost)
    await nextTick()

    expect(wrapper.vm.state.message.value).toBe('FromUrl')
    expect(wrapper.vm.state.speedMultiplier.value).toBe(2)
    expect(history.replaceState).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('debounces message updates', async () => {
    const wrapper = mount(TestHost)
    await nextTick()
    vi.mocked(history.replaceState).mockClear()

    wrapper.vm.state.message.value = 'Debounced'
    expect(history.replaceState).not.toHaveBeenCalled()

    vi.advanceTimersByTime(300)
    expect(history.replaceState).toHaveBeenCalled()
    wrapper.unmount()
  })

  it('syncs color and speed changes immediately', async () => {
    const wrapper = mount(TestHost)
    await nextTick()
    vi.mocked(history.replaceState).mockClear()

    wrapper.vm.state.bgColor.value = '#ff0000'
    await nextTick()

    expect(history.replaceState).toHaveBeenCalled()
    wrapper.unmount()
  })
})
