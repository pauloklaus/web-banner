import { onMounted, onUnmounted } from 'vue'
import { APP_UPDATE_CHECK_INTERVAL_MS } from '@/constants'
import { parseAppVersionFromHtml, readLoadedAppVersion } from '@/utils'

async function checkForAppUpdate(): Promise<void> {
  const loadedVersion = readLoadedAppVersion()
  if (!loadedVersion) return

  try {
    const response = await fetch(`/index.html?t=${Date.now()}`, {
      cache: 'no-store',
    })

    if (!response.ok) return

    const remoteVersion = parseAppVersionFromHtml(await response.text())

    if (remoteVersion && remoteVersion !== loadedVersion) {
      window.location.reload()
    }
  } catch {
    return
  }
}

export function useAppUpdate(): void {
  let intervalId: ReturnType<typeof setInterval> | undefined

  function onVisibilityChange(): void {
    if (document.visibilityState === 'visible') {
      void checkForAppUpdate()
    }
  }

  onMounted(() => {
    void checkForAppUpdate()
    intervalId = setInterval(() => {
      void checkForAppUpdate()
    }, APP_UPDATE_CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', onVisibilityChange)
  })

  onUnmounted(() => {
    if (intervalId !== undefined) {
      clearInterval(intervalId)
    }

    document.removeEventListener('visibilitychange', onVisibilityChange)
  })
}
