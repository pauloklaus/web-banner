import type { SpeedOption } from './speedOption'

export interface BannerConfig {
  message: string
  bg: string
  text: string
  speed: SpeedOption
  play: boolean
}
