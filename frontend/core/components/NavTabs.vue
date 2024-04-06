<script setup lang="ts">
defineProps<{
    links: { label: string, url: string }[]
}>()

const route = useRoute()

</script>

<template>
    <q-tabs dense align="left" indicator-color="primary">
        <q-route-tab exact v-for="link, i in links" :key="i" name="Bookings" :label="link.label" :to="link.url"
            :class="route.path == link.url ? 'bg-primary' : ''" />
    </q-tabs>
    <q-separator />
    <slot />
</template>