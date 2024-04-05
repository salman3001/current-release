<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const props = defineProps<{
    accepted: boolean;
    bid: IBid;
}>();


const getImageUrl = useGetImageUrl();
</script>

<template>
    <q-card bordered class="shadow-16 full-width" :class="accepted ? 'border-primary border-2' : ''"
        style="max-width: 450px; height: max-content">
        <q-card-section>
            <div class="row justify-between">
                <p class="text-muted" style="width: max-content">
                    {{ date.formatDate(bid?.created_at, "DD/MM/YYYY hh:mmA") }}
                </p>
                <div>
                    <q-badge v-if="accepted" outline class="q-badge-positive q-py-sm q-px-md justify-center">
                        Accepted</q-badge>
                    <q-badge v-else outline class="q-badge-warning q-py-sm q-px-md justify-center">
                        Under Progress</q-badge>
                </div>
            </div>
            <br />
            <div class="q-gutter-sm">
                Price Offered <span class="text-bold text-subtitle1">&#x20B9;{{
        new BigNumber(bid?.offered_price || 0).toFixed(2)
                    }}</span>

            </div>
            <br />
            <div>
                <p class="text-body-1 ellipsis-3-lines">
                    {{ bid?.message }}
                </p>
            </div>
        </q-card-section>

        <br />
    </q-card>
</template>
