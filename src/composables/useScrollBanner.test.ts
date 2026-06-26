import { defineComponent, nextTick, ref, toRef } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useScrollBanner } from './useScrollBanner'

const TestHost = defineComponent({
  props: {
    speed: {
      type: Number,
      default: 120,
    },
  },
  setup(props) {
    const textRef = ref<HTMLElement | null>(null)
    const banner = useScrollBanner(textRef, { speed: toRef(props, 'speed') })
    return { textRef, ...banner }
  },
  template: '<span ref="textRef">Scrolling text</span>',
})

describe('useScrollBanner', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('innerWidth', 800)
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 200,
      height: 40,
      top: 0,
      left: 0,
      right: 200,
      bottom: 40,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('starts with paused false and toggles pause', async () => {
    const wrapper = mount(TestHost)
    await nextTick()

    expect(wrapper.vm.isPaused).toBe(false)
    wrapper.vm.togglePause()
    expect(wrapper.vm.isPaused).toBe(true)
    wrapper.unmount()
  })

  it('positions text on start', async () => {
    const wrapper = mount(TestHost)
    await nextTick()

    wrapper.vm.start()
    await nextTick()

    expect(wrapper.vm.textRef?.style.transform).toContain('translate(800px')
    wrapper.unmount()
  })

  it('cancels animation frame on stop', async () => {
    const wrapper = mount(TestHost)
    await nextTick()

    wrapper.vm.start()
    wrapper.vm.stop()

    expect(cancelAnimationFrame).toHaveBeenCalled()
    wrapper.unmount()
  })
})
