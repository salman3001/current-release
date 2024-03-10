<script setup lang="ts">
definePageMeta({
    middleware: ['is-user']
})
</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>