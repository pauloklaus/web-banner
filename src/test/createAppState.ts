import { ref } from 'vue'
import type { AppState } from '@/types/appState'
import type { AppMode } from '@/types/appMode'
import type { SpeedOption } from '@/types/speedOption'

interface AppStateInput {
  message?: string
  bgColor?: string
  textColor?: string
  speedMultiplier?: SpeedOption
  mode?: AppMode
}

export function createAppState(input: AppStateInput = {}): AppState {
  return {
    message: ref(input.message ?? ''),
    bgColor: ref(input.bgColor ?? '#000000'),
    textColor: ref(input.textColor ?? '#ffffff'),
    speedMultiplier: ref(input.speedMultiplier ?? 1),
    mode: ref(input.mode ?? 'edit'),
  }
}
