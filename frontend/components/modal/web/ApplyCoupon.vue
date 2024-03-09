<script setup lang="ts">
import { ref } from 'vue';

const customFetch = useCustomFetch()

const modal = modalStore();

const { data, pending } = useAsyncData(async () => {
    const data = await customFetch(apiRoutes.get_coupons(modal.meta?.variantId))
}, { server: false, lazy: true })



</script>

<template>
    <q-card style="width: 100%">
        <q-toolbar style="background-color: #ebeae4">
            <q-toolbar-title><span class="text-weight-bold">Apply Coupon</span></q-toolbar-title>
            <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="column q-px-md-sm">
            <div>
                <SkeletonBase type="list" v-for="i in 5" />

            </div>
            <div>
                <div class="row q-gutter-sm justify-end q-pt-lg">
                    <q-btn color="secondary" style=" min-width: 6rem" @click="modal.show = !modal.show"
                        :disabled="pending">Cancle</q-btn>
                    <q-btn color="primary" v-if="pending" disabled>
                        <LoadingIndicator /> Processing
                    </q-btn>
                    <q-btn color="primary" type="submit" :disabled="pending" v-else
                        style="min-width: 6rem">Apply</q-btn>
                </div>
            </div>
        </q-card-section>
    </q-card>
</template>
