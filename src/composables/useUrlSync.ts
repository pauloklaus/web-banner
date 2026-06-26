import { watch, onMounted } from 'vue'
import { applyQueryConfig, syncConfigToUrl } from '@/utils'
import type { AppState } from '@/types/appState'

export function useUrlSync(state: AppState) {
  let debounceTimer: ReturnType<typeof setTimeout> | undefined

  function syncNow(): void {
    syncConfigToUrl(state)
  }

  function syncDebounced(): void {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(syncNow, 300)
  }

  onMounted(() => {
    applyQueryConfig(window.location.search, state)
    syncNow()
  })

  watch(() => state.message.value, syncDebounced)

  watch([state.bgColor, state.textColor, state.speedMultiplier], syncNow)

  watch(() => state.mode.value, syncNow)

  return { syncNow }
}
