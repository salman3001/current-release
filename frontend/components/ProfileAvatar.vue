<script setup lang="ts">
defineProps<{ image: string; name?: string; direction?: string }>();
</script>

<template>
  <div
    :class="direction || 'column'"
    class="justify-center items-start"
    style="max-width: max-content"
  >
    <q-avatar>
      <img :src="image" />
    </q-avatar>
    <span>{{ name }}</span>
  </div>
</template>
