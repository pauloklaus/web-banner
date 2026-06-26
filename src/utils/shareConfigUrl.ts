import { APP_NAME } from '@/config'
import type { ShareResult } from '@/types/shareResult'

export async function shareConfigUrl(url: string): Promise<ShareResult> {
  if (navigator.share) {
    try {
      await navigator.share({
        title: APP_NAME,
        text: APP_NAME,
        url,
      })
      return { method: 'share' }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return { method: 'cancelled' }
      }
    }
  }

  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  if (isMobile) {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(url)}`,
      '_blank',
      'noopener',
    )
    return { method: 'whatsapp' }
  }

  await navigator.clipboard.writeText(url)
  return { method: 'clipboard' }
}
