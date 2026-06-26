import { CSS_NAMED_COLORS } from '@/constants'

function parseHexWithHash(value: string): string | null {
  if (/^#[0-9a-fA-F]{6}$/.test(value)) {
    return value.toLowerCase()
  }

  if (/^#[0-9a-fA-F]{3}$/.test(value)) {
    const [, r, g, b] = value
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase()
  }

  return null
}

function rgbComponentsToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, '0')).join('')}`
}

function parseRgbString(value: string): string | null {
  const match = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(value)
  if (!match) return null

  return rgbComponentsToHex(Number(match[1]), Number(match[2]), Number(match[3]))
}

function resolveCssColorViaStyle(value: string): string | null {
  const probe = document.createElement('span')
  probe.style.color = ''
  probe.style.color = value
  if (!probe.style.color) return null

  document.body.appendChild(probe)
  const resolved = getComputedStyle(probe).color
  document.body.removeChild(probe)

  const fromRgb = parseRgbString(resolved)
  if (fromRgb) return fromRgb

  return CSS_NAMED_COLORS[resolved.toLowerCase()] ?? null
}

function resolveCssColor(value: string): string | null {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (ctx) {
    const sentinel = 'rgba(254, 1, 2, 0.5)'
    ctx.fillStyle = sentinel
    ctx.fillStyle = value

    if (ctx.fillStyle !== sentinel) {
      const resolved = ctx.fillStyle
      if (resolved.startsWith('#')) {
        return resolved.toLowerCase()
      }

      ctx.fillStyle = sentinel
      ctx.fillStyle = resolved
      if (ctx.fillStyle.startsWith('#')) {
        return ctx.fillStyle.toLowerCase()
      }
    }
  }

  return resolveCssColorViaStyle(value)
}

export function parseColor(value: unknown): string | null {
  if (value === null || value === undefined) return null

  const trimmed = String(value).trim()
  if (!trimmed) return null

  if (trimmed.startsWith('#')) {
    return parseHexWithHash(trimmed)
  }

  if (/^[0-9a-fA-F]{6}$/.test(trimmed)) {
    return `#${trimmed.toLowerCase()}`
  }

  return resolveCssColor(trimmed)
}
