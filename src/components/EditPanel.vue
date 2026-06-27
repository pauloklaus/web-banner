<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { MAX_MESSAGE_LENGTH, toPlainText } from '@/utils'
import { usePwaInstall } from '@/composables'
import { APP_NAME } from '@/config'
import AppBrand from './AppBrand.vue'
import AppFooter from './AppFooter.vue'
import ActionIcon from './ActionIcon.vue'
import installIcon from '../assets/icons/install.svg'
import playIcon from '../assets/icons/play.svg'
import shareIcon from '../assets/icons/share.svg'
import type { SpeedOption } from '@/types/speedOption'

const { t } = useI18n()

const message = defineModel<string>('message', { default: '' })
const bgColor = defineModel<string>('bgColor', { default: '#000000' })
const textColor = defineModel<string>('textColor', { default: '#ffffff' })
const speedMultiplier = defineModel<SpeedOption>('speedMultiplier', {
  default: 1,
})

const speedOptions: SpeedOption[] = [1, 2, 4]

defineProps<{
  shareFeedback?: string
}>()

const emit = defineEmits<{
  play: []
  share: []
}>()

const { canInstall, install } = usePwaInstall()

const canPlay = computed(() => message.value.trim().length > 0)

function onPlay() {
  if (canPlay.value) {
    emit('play')
  }
}

function onMessageInput(event: Event): void {
  const input = event.target as HTMLInputElement
  message.value = toPlainText(input.value)
}

function onMessagePaste(event: ClipboardEvent): void {
  event.preventDefault()
  const pasted = event.clipboardData?.getData('text/plain') ?? ''
  const input = event.target as HTMLInputElement
  const start = input.selectionStart ?? message.value.length
  const end = input.selectionEnd ?? message.value.length
  const nextValue =
    message.value.slice(0, start) + pasted + message.value.slice(end)
  message.value = toPlainText(nextValue)
}
</script>

<template>
  <div class="edit-panel">
    <header class="edit-panel__header">
      <AppBrand :label="APP_NAME" />

      <button
        v-if="canInstall"
        class="edit-panel__install edit-panel__action-btn"
        type="button"
        :aria-label="t('install.ariaLabel')"
        @click="install"
      >
        <ActionIcon :src="installIcon" />
        <span>{{ t('install.button') }}</span>
      </button>
    </header>

    <div class="edit-panel__scroll">
      <label class="edit-panel__field">
      <span class="edit-panel__label">{{ t('edit.message') }}</span>
      <input
        :value="message"
        type="text"
        class="edit-panel__input"
        :placeholder="t('edit.messagePlaceholder')"
        :maxlength="MAX_MESSAGE_LENGTH"
        @input="onMessageInput"
        @paste="onMessagePaste"
        @keyup.enter="onPlay"
      />
      <span class="edit-panel__counter"
        >{{ message.length }}/{{ MAX_MESSAGE_LENGTH }}</span
      >
    </label>

    <div class="edit-panel__settings">
      <div class="edit-panel__colors">
        <label class="edit-panel__color-field">
          <span class="edit-panel__label">{{ t('edit.background') }}</span>
          <input
            v-model="bgColor"
            type="color"
            class="edit-panel__color"
            :aria-label="t('aria.backgroundColor')"
          />
        </label>

        <label class="edit-panel__color-field">
          <span class="edit-panel__label">{{ t('edit.text') }}</span>
          <input
            v-model="textColor"
            type="color"
            class="edit-panel__color"
            :aria-label="t('aria.textColor')"
          />
        </label>
      </div>

      <div class="edit-panel__speed">
        <span class="edit-panel__label">{{ t('edit.speed') }}</span>
        <div class="edit-panel__speed-buttons">
          <button
            v-for="option in speedOptions"
            :key="option"
            type="button"
            class="edit-panel__speed-btn"
            :class="{
              'edit-panel__speed-btn--active': speedMultiplier === option,
            }"
            :aria-pressed="speedMultiplier === option"
            @click="speedMultiplier = option"
          >
            x{{ option }}
          </button>
        </div>
      </div>
    </div>

    <div class="edit-panel__actions">
      <button
        class="edit-panel__play edit-panel__action-btn"
        type="button"
        :disabled="!canPlay"
        @click="onPlay"
      >
        <ActionIcon :src="playIcon" />
        <span>{{ t('edit.play') }}</span>
      </button>

      <button
        class="edit-panel__share edit-panel__action-btn"
        type="button"
        :disabled="!canPlay"
        :aria-label="t('share.ariaLabel')"
        @click="emit('share')"
      >
        <ActionIcon :src="shareIcon" />
        <span>{{ shareFeedback || t('play.share') }}</span>
      </button>
    </div>
    </div>

    <AppFooter class="edit-panel__footer" />
  </div>
</template>

<style scoped>
.edit-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  height: 100dvh;
  max-height: 100dvh;
  overflow: hidden;
  background: #1a1a1a;
  color: #f0f0f0;
}

.edit-panel__scroll {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 1.5rem;
  min-height: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  padding: 4.5rem 1.5rem 1rem;
}

.edit-panel__footer :deep(.app-footer) {
  position: static;
  flex-shrink: 0;
  padding: 0.75rem 1rem calc(0.75rem + env(safe-area-inset-bottom, 0px));
}

.edit-panel__header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 12px;
}

.edit-panel__install {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #fff;
  background: #4a9eff;
  border-radius: 0.375rem;
  transition: background 0.15s;
}

.edit-panel__action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.edit-panel__action-btn :deep(.action-icon) {
  filter: brightness(0) invert(1);
}

.edit-panel__install:hover {
  background: #3a8eef;
}

.edit-panel__field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  max-width: 28rem;
}

.edit-panel__label {
  font-size: 0.875rem;
  color: #aaa;
}

.edit-panel__input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #444;
  border-radius: 0.5rem;
  background: #2a2a2a;
  color: #f0f0f0;
}

.edit-panel__input:focus {
  outline: 2px solid #4a9eff;
  outline-offset: 2px;
}

.edit-panel__counter {
  font-size: 0.75rem;
  color: #666;
  text-align: right;
}

.edit-panel__settings {
  display: contents;
}

.edit-panel__colors {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: center;
}

.edit-panel__color-field {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.edit-panel__color {
  width: 3.5rem;
  height: 3.5rem;
  padding: 0;
  border: 2px solid #444;
  border-radius: 0.5rem;
  cursor: pointer;
  background: transparent;
}

.edit-panel__speed {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.edit-panel__speed-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-panel__speed-btn {
  min-width: 3.5rem;
  padding: 0.625rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #f0f0f0;
  background: #2a2a2a;
  border: 2px solid #444;
  border-radius: 0.5rem;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.edit-panel__speed-btn:hover {
  background: #333;
}

.edit-panel__speed-btn--active {
  color: #fff;
  background: #4a9eff;
  border-color: #4a9eff;
}

.edit-panel__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: center;
}

.edit-panel__play {
  padding: 0.875rem 2.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #fff;
  background: #4a9eff;
  border-radius: 0.5rem;
  transition: background 0.15s;
}

.edit-panel__play:hover:not(:disabled) {
  background: #3a8eef;
}

.edit-panel__play:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.edit-panel__share {
  padding: 0.875rem 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: #f0f0f0;
  background: #2a2a2a;
  border: 2px solid #444;
  border-radius: 0.5rem;
  transition:
    background 0.15s,
    border-color 0.15s;
}

.edit-panel__share:hover:not(:disabled) {
  background: #333;
  border-color: #555;
}

.edit-panel__share:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

@media (orientation: landscape) and (max-height: 32rem) {
  .edit-panel__scroll {
    gap: 0.75rem;
    padding: 3.25rem 1rem 0.75rem;
  }

  .edit-panel__settings {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 28rem;
  }

  .edit-panel__colors {
    gap: 1rem;
  }

  .edit-panel__speed-btn {
    min-width: 2.75rem;
    padding: 0.5rem 0.75rem;
  }

  .edit-panel__color {
    width: 2.75rem;
    height: 2.75rem;
  }

  .edit-panel__play,
  .edit-panel__share {
    padding: 0.625rem 1.25rem;
    font-size: 1rem;
  }
}
</style>
