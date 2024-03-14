<script setup lang="ts">
defineProps<{
  type: "card" | "list" | "page" | "table" | "page";
}>();
</script>

<template>
  <SkeletonCard v-if="type === 'card'" />
  <SkeletonList v-if="type === 'list'" />
  <SkeletonTable v-if="type === 'table'" />
  <SkeletonPage v-if="type === 'page'" />
  <div v-if="type === 'page'">Loading page ..</div>
</template>
