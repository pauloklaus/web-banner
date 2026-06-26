import { buildConfigSearch } from './buildConfigSearch'
import type { AppState } from '@/types/appState'

export function syncConfigToUrl(state: AppState): void {
  const url = `${window.location.pathname}${buildConfigSearch(state)}${window.location.hash}`
  window.history.replaceState(null, '', url)
}
