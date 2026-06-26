import { describe, expect, it } from 'vitest'
import { mountWithI18n } from '@/test/mountWithI18n'
import EditPanel from './EditPanel.vue'

function mountEditPanel(
  props: {
    message?: string
    bgColor?: string
    textColor?: string
    speedMultiplier?: 1 | 2 | 4
    shareFeedback?: string
  } = {},
) {
  return mountWithI18n(EditPanel, {
    props: {
      message: '',
      bgColor: '#000000',
      textColor: '#ffffff',
      speedMultiplier: 1,
      ...props,
    },
  })
}

describe('EditPanel', () => {
  it('disables play and share when message is empty', () => {
    const wrapper = mountEditPanel()

    expect(
      wrapper.find('.edit-panel__play').attributes('disabled'),
    ).toBeDefined()
    expect(
      wrapper.find('.edit-panel__share').attributes('disabled'),
    ).toBeDefined()
  })

  it('enables play and emits event when message is present', async () => {
    const wrapper = mountEditPanel({ message: 'Hello' })

    const playButton = wrapper.find('.edit-panel__play')
    expect(playButton.attributes('disabled')).toBeUndefined()

    await playButton.trigger('click')
    expect(wrapper.emitted('play')).toHaveLength(1)
  })

  it('emits share when share button is clicked', async () => {
    const wrapper = mountEditPanel({ message: 'Hello' })

    await wrapper.find('.edit-panel__share').trigger('click')
    expect(wrapper.emitted('share')).toHaveLength(1)
  })

  it('shows character counter with max length', () => {
    const wrapper = mountEditPanel({ message: 'Hi' })

    expect(wrapper.find('.edit-panel__counter').text()).toBe('2/100')
  })

  it('updates speed multiplier when speed button is clicked', async () => {
    const wrapper = mountEditPanel({ message: 'Hello', speedMultiplier: 1 })

    const speedButtons = wrapper.findAll('.edit-panel__speed-btn')
    await speedButtons[2]!.trigger('click')

    expect(wrapper.emitted('update:speedMultiplier')?.[0]).toEqual([4])
  })

  it('sanitizes pasted message text', async () => {
    const wrapper = mountEditPanel({ message: 'Hello' })
    const input = wrapper.find('.edit-panel__input')

    await input.trigger('paste', {
      clipboardData: {
        getData: (type: string) => (type === 'text/plain' ? '\nWorld' : ''),
      },
    })

    expect(wrapper.emitted('update:message')?.at(-1)).toEqual(['Hello World'])
  })

  it('shows share feedback when provided', () => {
    const wrapper = mountEditPanel({
      message: 'Hello',
      shareFeedback: 'Link copied!',
    })

    expect(wrapper.find('.edit-panel__share').text()).toContain('Link copied!')
  })
})
