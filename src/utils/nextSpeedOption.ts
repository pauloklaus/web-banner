import { SPEED_OPTIONS } from '@/constants'
import type { SpeedOption } from '@/types/speedOption'

export function nextSpeedOption(current: SpeedOption): SpeedOption {
  const index = SPEED_OPTIONS.indexOf(current)
  const nextIndex = (index + 1) % SPEED_OPTIONS.length
  return SPEED_OPTIONS[nextIndex]
}
