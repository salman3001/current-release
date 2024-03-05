<script setup lang="ts">
defineProps<{
  height: string;
  width: string;
}>();
</script>

<template>
  <q-scroll-area :style="{ height: height, width: width }" :thumb-style="{
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#3a887c',
    width: '3px',
    height: '3px',
    opacity: 1,
  }" :bar-style="{
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#3a887c',
    width: '5px',
    height: '5px',
    opacity: 1,
  }">
    <slot />
  </q-scroll-area>
</template>
