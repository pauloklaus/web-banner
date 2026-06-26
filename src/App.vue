<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { EditPanel, PlayBanner } from '@/components'
import { buildConfigUrl, shareConfigUrl } from '@/utils'
import { useDocumentMeta, useUrlSync } from '@/composables'
import type { AppMode } from '@/types/appMode'
import type { SpeedOption } from '@/types/speedOption'

const { t } = useI18n()
useDocumentMeta()

const message = ref('')
const bgColor = ref('#000000')
const textColor = ref('#ffffff')
const speedMultiplier = ref<SpeedOption>(1)
const mode = ref<AppMode>('edit')
const shareFeedback = ref('')

const state = { message, bgColor, textColor, speedMultiplier, mode }
const { syncNow } = useUrlSync(state)

function startPlay() {
  if (!message.value.trim()) return
  mode.value = 'play'
}

function stopPlay() {
  mode.value = 'edit'
}

async function handleShare() {
  syncNow()
  const result = await shareConfigUrl(buildConfigUrl(state))

  if (result.method === 'clipboard') {
    shareFeedback.value = t('share.linkCopied')
    setTimeout(() => {
      shareFeedback.value = ''
    }, 2000)
  }
}
</script>

<template>
  <EditPanel
    v-if="mode === 'edit'"
    v-model:message="message"
    v-model:bg-color="bgColor"
    v-model:text-color="textColor"
    v-model:speed-multiplier="speedMultiplier"
    :share-feedback="shareFeedback"
    @play="startPlay"
    @share="handleShare"
  />
  <PlayBanner
    v-else
    :message="message"
    :bg-color="bgColor"
    :text-color="textColor"
    :speed-multiplier="speedMultiplier"
    :share-feedback="shareFeedback"
    @share="handleShare"
    @stop="stopPlay"
  />
</template>
