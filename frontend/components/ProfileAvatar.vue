<script setup lang="ts">
defineProps<{ image: string; name?: string; direction?: string }>();
</script>

<template>
  <div :class="direction || 'column'" class="justify-center items-start" style="max-width: max-content">
    <q-avatar size="96px">
      <img :src="image" />
    </q-avatar>
    <span class="text-h6">{{ name }}</span>
  </div>
</template>
