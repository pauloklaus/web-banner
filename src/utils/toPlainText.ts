import { MAX_MESSAGE_LENGTH } from '@/constants'

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export function toPlainText(value: unknown): string {
  if (value === null || value === undefined) {
    return ''
  }

  const element = document.createElement('div')
  element.textContent = String(value)

  return element.textContent
    .replace(CONTROL_CHARS, '')
    .replace(/[\r\n\t]+/g, ' ')
    .slice(0, MAX_MESSAGE_LENGTH)
}
