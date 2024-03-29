<script setup lang="ts">
definePageMeta({
  middleware: ["is-logged-in"],
});
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>
