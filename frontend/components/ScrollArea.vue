<script setup lang="ts">
defineProps<{
  height: string;
  width: string;
}>();
</script>

<template>
  <q-scroll-area
    :style="{ height: height, width: width }"
    :thumb-style="{
      right: '4px',
      borderRadius: '5px',
      backgroundColor: 'green',
      width: '5px',
      opacity: 0.2,
    }"
    :bar-style="{
      right: '2px',
      borderRadius: '2px',
      backgroundColor: 'primary',
      width: '5px',
      opacity: 0.2,
    }"
  >
    <slot />
  </q-scroll-area>
</template>
