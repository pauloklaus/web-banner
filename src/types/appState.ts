import type { Ref } from 'vue'
import type { AppMode } from './appMode'
import type { SpeedOption } from './speedOption'

export interface AppState {
  message: Ref<string>
  bgColor: Ref<string>
  textColor: Ref<string>
  speedMultiplier: Ref<SpeedOption>
  mode: Ref<AppMode>
}
