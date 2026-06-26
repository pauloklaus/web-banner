import type { SpeedOption } from '@/types/speedOption'

interface ConfigDefaults {
  message: string
  bg: string
  text: string
  speed: SpeedOption
  play: boolean
}

export const CONFIG_DEFAULTS: ConfigDefaults = {
  message: '',
  bg: '#000000',
  text: '#ffffff',
  speed: 1,
  play: false,
}
