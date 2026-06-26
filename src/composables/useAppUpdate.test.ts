import { defineComponent, nextTick } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { useAppUpdate } from './useAppUpdate'

const TestHost = defineComponent({
  setup() {
    useAppUpdate()
  },
  template: '<div />',
})

describe('useAppUpdate', () => {
  const reload = vi.fn()
  const fetchMock = vi.fn()

  beforeEach(() => {
    reload.mockClear()
    fetchMock.mockReset()
    vi.stubGlobal('location', { reload })
    vi.stubGlobal('fetch', fetchMock)
    document.head.innerHTML = '<meta name="app-version" content="1.0.0" />'
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
    document.head.innerHTML = ''
  })

  it('reloads when a newer version is available', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve('<meta name="app-version" content="1.0.1" />'),
    })

    mount(TestHost)
    await nextTick()
    await vi.waitFor(() => expect(reload).toHaveBeenCalled())
  })

  it('does not reload when version matches', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve('<meta name="app-version" content="1.0.0" />'),
    })

    mount(TestHost)
    await nextTick()
    await Promise.resolve()

    expect(reload).not.toHaveBeenCalled()
  })

  it('does not reload when loaded version meta is missing', async () => {
    document.head.innerHTML = ''

    mount(TestHost)
    await nextTick()
    await Promise.resolve()

    expect(fetchMock).not.toHaveBeenCalled()
    expect(reload).not.toHaveBeenCalled()
  })

  it('checks again when the tab becomes visible', async () => {
    fetchMock.mockResolvedValue({
      ok: true,
      text: () =>
        Promise.resolve('<meta name="app-version" content="1.0.0" />'),
    })

    mount(TestHost)
    await nextTick()
    await Promise.resolve()
    fetchMock.mockClear()

    Object.defineProperty(document, 'visibilityState', {
      value: 'visible',
      configurable: true,
    })
    document.dispatchEvent(new Event('visibilitychange'))
    await nextTick()

    expect(fetchMock).toHaveBeenCalled()
  })
})
