import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mountWithI18n } from '@/test/mountWithI18n'
import PlayBanner from './PlayBanner.vue'

describe('PlayBanner', () => {
  beforeEach(() => {
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn(() => 1),
    )
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.stubGlobal('innerWidth', 1024)
    vi.stubGlobal('innerHeight', 768)
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 300,
      height: 50,
      top: 0,
      left: 0,
      right: 300,
      bottom: 50,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }))
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders the message', () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Scrolling message',
        bgColor: '#000000',
        textColor: '#ffffff',
      },
    })

    expect(wrapper.find('.play-banner__text').text()).toBe('Scrolling message')
  })

  it('emits stop when stop button is clicked', async () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#000000',
        textColor: '#ffffff',
      },
    })

    await wrapper.find('.play-banner__stop').trigger('click')
    expect(wrapper.emitted('stop')).toHaveLength(1)
  })

  it('emits share when share button is clicked', async () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#000000',
        textColor: '#ffffff',
      },
    })

    await wrapper.find('.play-banner__share').trigger('click')
    expect(wrapper.emitted('share')).toHaveLength(1)
  })

  it('emits invertColors when invert button is clicked', async () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#000000',
        textColor: '#ffffff',
      },
    })

    await wrapper.find('.play-banner__invert').trigger('click')
    expect(wrapper.emitted('invertColors')).toHaveLength(1)
  })

  it('shows action labels in title attributes', () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#000000',
        textColor: '#ffffff',
      },
    })

    expect(wrapper.find('.play-banner__share').attributes('title')).toBe(
      'Share',
    )
    expect(wrapper.find('.play-banner__invert').attributes('title')).toBe(
      'Invert colors',
    )
    expect(wrapper.find('.play-banner__stop').attributes('title')).toBe('Stop')
  })

  it('shows share feedback to the left of the share button', () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#000000',
        textColor: '#ffffff',
        shareFeedback: 'Link copied!',
      },
    })

    const feedback = wrapper.find('.play-banner__share-feedback')
    expect(feedback.exists()).toBe(true)
    expect(feedback.text()).toBe('Link copied!')
    expect(wrapper.find('.play-banner__share').attributes('title')).toBe(
      'Share',
    )
  })

  it('hides share feedback when not set', () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#000000',
        textColor: '#ffffff',
      },
    })

    expect(wrapper.find('.play-banner__share-feedback').exists()).toBe(false)
  })

  it('toggles paused state when banner is clicked', async () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#000000',
        textColor: '#ffffff',
      },
    })

    expect(wrapper.find('.play-banner').classes()).not.toContain(
      'play-banner--paused',
    )

    await wrapper.find('.play-banner').trigger('click')
    expect(wrapper.find('.play-banner').classes()).toContain(
      'play-banner--paused',
    )
  })

  it('applies background and text colors', () => {
    const wrapper = mountWithI18n(PlayBanner, {
      props: {
        message: 'Hello',
        bgColor: '#ff0000',
        textColor: '#00ff00',
      },
    })

    expect(wrapper.find('.play-banner').attributes('style')).toContain(
      'background-color: #ff0000',
    )
    expect(wrapper.find('.play-banner__text').attributes('style')).toContain(
      'color: #00ff00',
    )
  })
})
