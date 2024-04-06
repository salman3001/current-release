<script setup lang="ts">
import { date } from 'quasar';

defineProps<{
    booking: IBooking
}>()
</script>

<template>
    <TimeLine>
        <template v-for="(b, i) in booking?.history" :key="i">
            <q-timeline-entry>
                <template v-slot:title>
                    {{ b.event }}
                </template>

                <template v-slot:subtitle>
                    {{ date.formatDate(b.date_time, "DD/MM/YYYY hh:mmA") }}
                </template>
                <div class="text-muted">
                    {{ b.remarks }}
                </div>
            </q-timeline-entry>
        </template>
    </TimeLine>
</template>