import { defineComponent, nextTick } from 'vue'
import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'
import en from '@/i18n/locales/en.json'
import ptBR from '@/i18n/locales/pt-BR.json'
import es from '@/i18n/locales/es.json'
import { useDocumentMeta } from './useDocumentMeta'

vi.mock('@/config', () => ({
  APP_NAME: 'WebBanner',
  SITE_URL: 'https://example.com',
}))

const TestHost = defineComponent({
  setup() {
    useDocumentMeta()
    return {}
  },
  template: '<div />',
})

describe('useDocumentMeta', () => {
  it('sets document title and meta tags on mount', async () => {
    const wrapper = mount(TestHost, {
      global: {
        plugins: [
          createI18n({
            legacy: false,
            locale: 'en',
            fallbackLocale: 'en',
            messages: { en, 'pt-BR': ptBR, es },
          }),
        ],
      },
    })
    await nextTick()

    expect(document.title).toBe('WebBanner')
    expect(document.documentElement.lang).toBe('en')
    expect(
      document.head.querySelector('meta[name="description"]')?.getAttribute(
        'content',
      ),
    ).toBeTruthy()
    expect(
      document.head
        .querySelector('meta[property="og:image"]')
        ?.getAttribute('content'),
    ).toBe('https://example.com/icons/og-image-en.png')
    wrapper.unmount()
  })
})
