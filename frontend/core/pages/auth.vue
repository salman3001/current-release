<script setup lang="ts">
definePageMeta({
  layout: "empty",
  middleware: ["is-guest"],
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
