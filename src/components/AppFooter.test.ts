import { describe, expect, it, vi } from 'vitest'
import { mountWithI18n } from '@/test/mountWithI18n'
import AppFooter from './AppFooter.vue'

vi.mock('@/config', () => ({
  APP_NAME: 'WebBanner',
  AUTHOR: 'Test Author',
  GITHUB_REPO_URL: 'https://github.com/test/repo',
}))

describe('AppFooter', () => {
  it('renders app name, author, and github link', () => {
    const wrapper = mountWithI18n(AppFooter)

    expect(wrapper.text()).toContain('WebBanner')
    expect(wrapper.text()).toContain('Test Author')
    expect(wrapper.text()).toContain('GitHub')

    const link = wrapper.find('a.app-footer__link')
    expect(link.attributes('href')).toBe('https://github.com/test/repo')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  })
})
