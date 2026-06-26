import { toPlainText } from './toPlainText'
import { CONFIG_DEFAULTS } from '@/constants'
import { sanitizeConfig } from './sanitizeConfig'
import type { AppState } from '@/types/appState'
import type { BannerConfig } from '@/types/bannerConfig'

const NAMED_COLORS: Record<string, string> = {
  '#000000': 'black',
  '#ffffff': 'white',
}

function formatColorForUrl(color: string): string {
  const normalized = color.toLowerCase()

  if (NAMED_COLORS[normalized]) {
    return NAMED_COLORS[normalized]
  }

  const match =
    /^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])$/.exec(
      normalized,
    )
  if (
    match &&
    match[1] === match[2] &&
    match[3] === match[4] &&
    match[5] === match[6]
  ) {
    return `#${match[1]}${match[3]}${match[5]}`
  }

  return normalized
}

function stateToConfig(state: AppState): BannerConfig {
  const message = toPlainText(state.message.value)
  const play = state.mode.value === 'play' && message.trim().length > 0

  return sanitizeConfig({
    message,
    bg: state.bgColor.value,
    text: state.textColor.value,
    speed: state.speedMultiplier.value,
    play,
  })!
}

export function encodeQueryConfig(state: AppState): URLSearchParams {
  const config = stateToConfig(state)
  const params = new URLSearchParams()

  if (config.message) {
    params.set('m', config.message)
  }

  if (config.bg !== CONFIG_DEFAULTS.bg) {
    params.set('b', formatColorForUrl(config.bg))
  }

  if (config.text !== CONFIG_DEFAULTS.text) {
    params.set('f', formatColorForUrl(config.text))
  }

  if (config.speed !== CONFIG_DEFAULTS.speed) {
    params.set('s', String(config.speed))
  }

  if (config.play) {
    params.set('p', '1')
  }

  return params
}
