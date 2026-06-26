import { decodeQueryConfig } from './decodeQueryConfig'
import type { AppState } from '@/types/appState'

export function applyQueryConfig(search: string, state: AppState): void {
  try {
    const config = decodeQueryConfig(search)
    if (!config) return

    state.message.value = config.message
    state.bgColor.value = config.bg
    state.textColor.value = config.text
    state.speedMultiplier.value = config.speed

    if (config.play && config.message.trim()) {
      state.mode.value = 'play'
    }
  } catch {}
}
