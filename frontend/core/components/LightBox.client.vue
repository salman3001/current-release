<script setup lang="ts">
import VuePictureSwipe from "vue3-picture-swipe";

defineProps<{
  items: {
    src: string;
    thumbnail: string;
    w: number;
    h: number;
  };
}>();
</script>

<template>
  <vue-picture-swipe
    :items="items"
    :options="{
      bgOpacity: 0.8,
      arrowKeys: true,
    }"
  ></vue-picture-swipe>
</template>
