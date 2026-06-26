import { APP_VERSION_META_NAME } from '@/constants'

export function parseAppVersionFromHtml(html: string): string | undefined {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return (
    doc
      .querySelector(`meta[name="${APP_VERSION_META_NAME}"]`)
      ?.getAttribute('content') ?? undefined
  )
}
