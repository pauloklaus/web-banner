import { ref, unref, onUnmounted, type MaybeRef, type Ref } from 'vue'

const SCROLL_SPEED = 240

interface UseScrollBannerOptions {
  speed?: MaybeRef<number>
}

export function useScrollBanner(
  textRef: Ref<HTMLElement | null>,
  options: UseScrollBannerOptions = {},
) {
  const speedSource = options.speed ?? SCROLL_SPEED
  const isPaused = ref(false)

  let animationId: number | null = null
  let positionX = 0
  let lastTimestamp: number | null = null
  let textWidth = 0
  let viewportWidth = 0

  function measure(): void {
    if (!textRef.value) return
    const rect = textRef.value.getBoundingClientRect()
    textWidth = rect.width
    viewportWidth = window.innerWidth
  }

  function resetPosition(): void {
    positionX = viewportWidth
    if (textRef.value) {
      textRef.value.style.transform = `translate(${positionX}px, -50%)`
    }
  }

  function tick(timestamp: number): void {
    if (isPaused.value) {
      lastTimestamp = null
      animationId = requestAnimationFrame(tick)
      return
    }

    if (lastTimestamp === null) {
      lastTimestamp = timestamp
    }

    const delta = (timestamp - lastTimestamp) / 1000
    lastTimestamp = timestamp

    positionX -= unref(speedSource) * delta

    if (positionX <= -textWidth) {
      positionX = viewportWidth
    }

    if (textRef.value) {
      textRef.value.style.transform = `translate(${positionX}px, -50%)`
    }

    animationId = requestAnimationFrame(tick)
  }

  function start(): void {
    stop()
    measure()
    resetPosition()
    lastTimestamp = null
    animationId = requestAnimationFrame(tick)
  }

  function stop(): void {
    if (animationId !== null) {
      cancelAnimationFrame(animationId)
      animationId = null
    }
    lastTimestamp = null
  }

  function togglePause(): void {
    isPaused.value = !isPaused.value
    if (!isPaused.value) {
      lastTimestamp = null
    }
  }

  onUnmounted(() => {
    stop()
  })

  return {
    isPaused,
    start,
    stop,
    togglePause,
    measure,
  }
}
