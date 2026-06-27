<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { APP_NAME, SITE_URL } from '@/config'
import { useScrollBanner } from '@/composables'
import AppBrand from './AppBrand.vue'
import ActionIcon from './ActionIcon.vue'
import shareIcon from '../assets/icons/share.svg'
import invertColorIcon from '../assets/icons/invert-color.svg'
import stopIcon from '../assets/icons/stop.svg'
import type { SpeedOption } from '@/types/speedOption'

const { t } = useI18n()

const BASE_SPEED = 240
const FONT_HEIGHT_RATIO = 0.88
const WORD_SPACING_EM = 0.35

const props = defineProps<{
  message: string
  bgColor: string
  textColor: string
  speedMultiplier?: SpeedOption
  shareFeedback?: string
}>()

const emit = defineEmits<{
  stop: []
  share: []
  invertColors: []
  cycleSpeed: []
}>()

const textRef = ref<HTMLSpanElement | null>(null)
const trackRef = ref<HTMLElement | null>(null)

const fontSize = ref(0)

function updateFontSize() {
  const trackHeight = trackRef.value?.clientHeight ?? window.innerHeight
  fontSize.value = Math.floor(trackHeight * FONT_HEIGHT_RATIO)
}

const scrollSpeed = computed(() => BASE_SPEED * (props.speedMultiplier ?? 1))

const speedLabel = computed(() => `x${props.speedMultiplier ?? 1}`)

const { isPaused, start, stop, togglePause } = useScrollBanner(textRef, {
  speed: scrollSpeed,
})

const bannerStyle = computed(() => ({
  backgroundColor: props.bgColor,
}))

const textStyle = computed(() => ({
  color: props.textColor,
  fontSize: `${fontSize.value}px`,
  wordSpacing: `${WORD_SPACING_EM}em`,
}))

const displaySiteUrl = computed(() =>
  SITE_URL.replace(/^https?:\/\//, '').replace(/\/$/, ''),
)

function onBannerClick() {
  togglePause()
}

function onStop(event: MouseEvent): void {
  event.stopPropagation()
  stop()
  emit('stop')
}

function onShare(event: MouseEvent): void {
  event.stopPropagation()
  emit('share')
}

function onInvertColors(event: MouseEvent): void {
  event.stopPropagation()
  emit('invertColors')
}

function onCycleSpeed(event: MouseEvent): void {
  event.stopPropagation()
  emit('cycleSpeed')
}

async function handleResize() {
  updateFontSize()
  await nextTick()
  start()
}

onMounted(async () => {
  updateFontSize()
  await nextTick()
  start()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stop()
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
    class="play-banner"
    :class="{ 'play-banner--paused': isPaused }"
    :style="bannerStyle"
  >
    <div class="play-banner__brand" :aria-label="APP_NAME" @click.stop>
      <AppBrand :label="displaySiteUrl" :href="SITE_URL" />
    </div>

    <div class="play-banner__controls" @click.stop>
      <span v-if="shareFeedback" class="play-banner__share-feedback">{{
        shareFeedback
      }}</span>

      <button
        class="play-banner__share play-banner__action-btn"
        type="button"
        :title="t('play.share')"
        :aria-label="t('share.ariaLabel')"
        @click="onShare"
      >
        <ActionIcon :src="shareIcon" size="1rem" />
      </button>

      <button
        class="play-banner__invert play-banner__action-btn"
        type="button"
        :title="t('play.invertColors')"
        :aria-label="t('aria.invertColors')"
        @click="onInvertColors"
      >
        <ActionIcon :src="invertColorIcon" size="1rem" />
      </button>

      <button
        class="play-banner__speed play-banner__action-btn"
        type="button"
        :title="t('play.cycleSpeed')"
        :aria-label="t('aria.cycleSpeed', { speed: speedLabel })"
        @click="onCycleSpeed"
      >
        {{ speedLabel }}
      </button>

      <button
        class="play-banner__stop play-banner__action-btn"
        type="button"
        :title="t('play.stop')"
        :aria-label="t('aria.stopPlay')"
        @click="onStop"
      >
        <ActionIcon :src="stopIcon" size="1rem" />
      </button>
    </div>

    <div ref="trackRef" class="play-banner__track" @click="onBannerClick">
      <span ref="textRef" class="play-banner__text" :style="textStyle">{{
        message
      }}</span>
    </div>
  </div>
</template>

<style scoped>
.play-banner {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  user-select: none;
}

.play-banner--paused .play-banner__text {
  opacity: 0.75;
}

.play-banner__brand {
  display: none;
}

.play-banner__brand :deep(.app-brand__label) {
  color: #fff;
}

.play-banner__brand :deep(.app-brand__label--link:hover) {
  color: #4a9eff;
}

.play-banner__brand :deep(.app-brand) {
  padding-right: 0.625rem;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0.375rem;
}

.play-banner__controls {
  position: fixed;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.play-banner__share-feedback {
  display: inline-flex;
  align-items: center;
  height: calc(0.5rem * 2 + 1rem);
  padding: 0 0.625rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0.375rem;
  white-space: nowrap;
}

.play-banner__share,
.play-banner__invert,
.play-banner__speed,
.play-banner__stop {
  padding: 0.5rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 0.375rem;
  cursor: pointer;
}

.play-banner__speed {
  min-width: calc(0.5rem * 2 + 1rem);
  height: calc(0.5rem * 2 + 1rem);
  padding: 0 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1;
}

.play-banner__action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.play-banner__action-btn :deep(.action-icon) {
  filter: brightness(0) invert(1);
}

.play-banner__share:hover,
.play-banner__invert:hover,
.play-banner__speed:hover,
.play-banner__stop:hover {
  background: rgba(0, 0, 0, 0.8);
}

.play-banner__track {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  cursor: pointer;
}

@media (orientation: landscape) {
  .play-banner__brand {
    display: block;
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 10;
  }
}

.play-banner__text {
  position: absolute;
  top: 50%;
  left: 0;
  line-height: 1.1;
  white-space: nowrap;
  will-change: transform;
}
</style>
