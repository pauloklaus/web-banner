import { encodeQueryConfig } from './encodeQueryConfig'
import type { AppState } from '@/types/appState'

export function buildConfigSearch(state: AppState): string {
  const query = encodeQueryConfig(state).toString()
  return query ? `?${query}` : ''
}
