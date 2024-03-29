<script setup lang="ts">
defineProps<{
  urls: string[]
}>()
</script>
<template>
  <div class="full-width">
    <div style="display: flex;gap:1rem;flex-wrap: wrap;align-items: center;">
      <div v-for="(u, i) in urls" :key="i" class="relative-position">
        <q-img spinner-color="white" :src="u"
          style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" accept="jpg,jpeg,png,webp" />
        <q-badge transparent align="middle" color="red" rounded floating style="cursor: pointer;"
          @click="$emit('delete', i)">
          <q-icon name="close" size="16px" />
        </q-badge>
      </div>
      <slot />
    </div>

  </div>
</template>
