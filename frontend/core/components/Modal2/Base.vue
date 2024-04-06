<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>

<template>
    <q-dialog>
        <q-card style="width: 100%">
            <q-toolbar color="primary">
                <q-toolbar-title><span class="text-weight-bold">{{ title }}</span></q-toolbar-title>
                <q-btn flat dense icon="close" v-close-popup />
            </q-toolbar>
            <q-card-section class="column q-px-md-sm">
                <slot />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>