<script setup lang="ts">

definePageMeta({
    layout: 'vendor-layout',
    middleware: ['is-vendor']
})

</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>