<script setup lang="ts">
defineProps<{
    type: 'card' | 'list' | 'page'
}>()
</script>

<template>
    <SkeletonCard v-if="type === 'card'" />
    <SkeletonList v-if="type === 'list'" />
    <div v-if="type === 'page'"> Loading page ..</div>

</template>