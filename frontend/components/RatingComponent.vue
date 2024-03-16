<script setup lang="ts">
defineProps<{
  rating: number;
  size?: string;
}>();
</script>

<template>
  <div class="q-gutter-y-md column">
    <q-rating :model-value="rating" @update:model-value="(v) => $emit('update:model-value', v)" :size="size || '2.5rem'"
      color="yellow-9" icon="star_border" icon-selected="star" readonly />
  </div>
</template>
