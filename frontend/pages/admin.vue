<script setup lang="ts">

definePageMeta({
    layout: 'admin-layout',
    middleware: ['is-logged-in', 'is-admin']
})

</script>

<template>
    <div>
        <NuxtPage />
    </div>
</template>