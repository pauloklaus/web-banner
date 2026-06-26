import { buildConfigSearch } from './buildConfigSearch'
import type { AppState } from '@/types/appState'

export function buildConfigUrl(state: AppState): string {
  return `${window.location.origin}${window.location.pathname}${buildConfigSearch(state)}`
}
