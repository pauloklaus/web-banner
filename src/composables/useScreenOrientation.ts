import { watch, onMounted, onUnmounted, type Ref } from 'vue'
import type { AppMode } from '@/types/appMode'

type OrientationLock = 'portrait-primary' | 'landscape'

type OrientationApi = {
  lock?: (orientation: OrientationLock) => Promise<void>
  unlock?: () => void
}

function orientationApi(): OrientationApi | undefined {
  return screen.orientation as OrientationApi | undefined
}

async function lockOrientation(lock: OrientationLock): Promise<void> {
  const api = orientationApi()
  if (!api?.lock) return

  try {
    await api.lock(lock)
  } catch {
    return
  }
}

async function unlockOrientation(): Promise<void> {
  const api = orientationApi()
  if (!api?.unlock) return

  try {
    api.unlock()
  } catch {
    return
  }
}

function orientationForMode(mode: AppMode): OrientationLock {
  return mode === 'play' ? 'landscape' : 'portrait-primary'
}

export function useScreenOrientation(mode: Ref<AppMode>) {
  async function applyModeOrientation(nextMode: AppMode): Promise<void> {
    await lockOrientation(orientationForMode(nextMode))
  }

  onMounted(() => {
    void applyModeOrientation(mode.value)
  })

  watch(mode, (nextMode) => {
    void applyModeOrientation(nextMode)
  })

  onUnmounted(() => {
    void unlockOrientation()
  })
}
