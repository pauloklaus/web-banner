<script setup lang="ts">
import { APP_NAME } from '@/config'

defineProps<{
  label: string
  href?: string
}>()
</script>

<template>
  <div class="app-brand">
    <img
      class="app-brand__logo"
      src="/icons/apple-touch-icon.png"
      width="36"
      height="36"
      :alt="APP_NAME"
    />
    <a
      v-if="href"
      class="app-brand__label app-brand__label--link"
      :href="href"
      target="_blank"
      rel="noopener noreferrer"
      @click.stop
    >
      {{ label }}
    </a>
    <span v-else class="app-brand__label">{{ label }}</span>
  </div>
</template>

<style scoped>
.app-brand {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.app-brand__logo {
  display: block;
  border-radius: 0.5rem;
}

.app-brand__label {
  font-size: 1.125rem;
  font-weight: 600;
  color: #f0f0f0;
}

.app-brand__label--link {
  text-decoration: none;
  transition: color 0.15s;
}

.app-brand__label--link:hover {
  color: #4a9eff;
}
</style>
