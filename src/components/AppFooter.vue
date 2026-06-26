<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { APP_NAME, AUTHOR, GITHUB_REPO_URL } from '@/config'

const { t } = useI18n()
</script>

<template>
  <footer class="app-footer">
    <span class="app-footer__name">{{ APP_NAME }}</span>

    <template v-if="AUTHOR">
      <span class="app-footer__sep" aria-hidden="true">·</span>
      <span>{{ t('footer.by') }} {{ AUTHOR }}</span>
    </template>

    <template v-if="GITHUB_REPO_URL">
      <span class="app-footer__sep" aria-hidden="true">·</span>
      <a
        class="app-footer__link"
        :href="GITHUB_REPO_URL"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ t('footer.github') }}
      </a>
    </template>
  </footer>
</template>

<style scoped>
.app-footer {
  position: fixed;
  bottom: 12px;
  left: 0;
  right: 0;
  z-index: 50;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.375rem;
  padding: 0 1rem;
  font-size: 0.75rem;
  color: #666;
  text-transform: lowercase;
}

.app-footer__name {
  color: #888;
}

.app-footer__sep {
  color: #555;
}

.app-footer__link {
  color: #888;
  text-decoration: none;
  transition: color 0.15s;
}

.app-footer__link:hover {
  color: #4a9eff;
}
</style>
