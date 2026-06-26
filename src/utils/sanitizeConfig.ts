import { toPlainText } from './toPlainText'
import { parseColor } from './parseColor'
import { CONFIG_DEFAULTS, SPEED_OPTIONS } from '@/constants'
import type { BannerConfig } from '@/types/bannerConfig'
import type { SpeedOption } from '@/types/speedOption'

function sanitizeColor(value: unknown, fallback: string): string {
  const parsed = parseColor(value)
  return parsed ?? fallback
}

function sanitizeSpeed(value: unknown): SpeedOption {
  const speed = Number(value)
  return (SPEED_OPTIONS as readonly number[]).includes(speed)
    ? (speed as SpeedOption)
    : CONFIG_DEFAULTS.speed
}

function sanitizePlay(value: unknown): boolean {
  return value === true || value === 1 || value === '1' || value === 'true'
}

export function sanitizeConfig(raw: unknown): BannerConfig | null {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) {
    return null
  }

  const record = raw as Record<string, unknown>
  const message = toPlainText(record.message ?? '')
  const bg = sanitizeColor(record.bg, CONFIG_DEFAULTS.bg)
  const text = sanitizeColor(record.text, CONFIG_DEFAULTS.text)
  const speed = sanitizeSpeed(record.speed)
  const play = sanitizePlay(record.play)

  return { message, bg, text, speed, play }
}
