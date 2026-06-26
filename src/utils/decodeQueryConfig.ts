import { sanitizeConfig } from './sanitizeConfig'
import type { BannerConfig } from '@/types/bannerConfig'

const QUERY_KEYS = ['m', 'b', 'f', 'p', 's'] as const

export function decodeQueryConfig(search: string): BannerConfig | null {
  const params = new URLSearchParams(
    search.startsWith('?') ? search.slice(1) : search,
  )
  const hasConfig = QUERY_KEYS.some((key) => params.has(key))

  if (!hasConfig) {
    return null
  }

  return sanitizeConfig({
    message: params.get('m') ?? '',
    bg: params.get('b'),
    text: params.get('f'),
    speed: params.get('s'),
    play: params.get('p'),
  })
}
