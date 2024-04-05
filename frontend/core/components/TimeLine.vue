<script setup lang="ts">
defineProps<{
    color?: string,
    mainHeading?: string
    entries: {
        title?: string
        subTitle?: string
        texts: string
    }[]
}>()

</script>

<template>
    <q-timeline :color="color || 'primary'">
        <q-timeline-entry heading v-if="mainHeading">
            {{ mainHeading }}
        </q-timeline-entry>

        <q-timeline-entry v-for="entry, i in entries" :key="i">
            <template v-slot:title v-if="entry.title">
                {{ entry.title }}
            </template>

            <template v-slot:subtitle v-if="entry.subTitle">
                {{ entry.subTitle }}
            </template>

            <div>
                {{ entry.texts }}
            </div>
        </q-timeline-entry>
    </q-timeline>
</template>