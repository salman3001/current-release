<script setup lang="ts">
import BigNumber from 'bignumber.js';


const props = defineProps<{
    selectedVariant: IServiceVariant
}>()


let discount = new BigNumber(0)

if (props.selectedVariant.discount_type === DiscountType.FLAT) {
    discount = discount.plus(props.selectedVariant.discount_flat)
} else if (props.selectedVariant.discount_type === DiscountType.PERCENATAGE) {
    discount = new BigNumber(props.selectedVariant.discount_percentage).div(100).times(props.selectedVariant.price)
}
</script>

<template>
    <q-card flat bordered style="width: 300px;height: max-content;" class="gt-sm q-pa-sm">
        <div v-if="selectedVariant">
            <q-card-section class="text-h5">{{ selectedVariant?.name }}</q-card-section>
            <q-card-section>
                <div class="row justify-between">
                    <div>Price</div>
                    <div>&#x20B9;{{ selectedVariant?.price }}</div>
                </div>
                <div class="row justify-between">
                    <div>Discount</div>
                    <div>&#x20B9;{{ discount.toFixed(2) }}</div>
                </div>
            </q-card-section>
            <q-card-section class="row text-h5 text-bold justify-end"><span>&#x20B9;{{ new
            BigNumber(selectedVariant?.price).minus(discount)
                    }}</span></q-card-section>
            <q-card-section class="text-h5">
                <NuxtLink :to="routes.book_Service(selectedVariant.id)">
                    <q-btn class="full-width" color="primary">Book Now</q-btn>
                </NuxtLink>
            </q-card-section>
        </div>
        <div v-else>
            Price Upon variant selection
        </div>
    </q-card>
    <q-footer elevated class="bg-nutral text-muted lt-md">
        <q-toolbar class="" style="min-height: 80px">
            <div class="column" style="max-width: 50%">
                <span>{{ selectedVariant?.name }}</span>
                <div class="q-gutter-sm q-mt-xs">
                    <span class="line-through" v-if="discount.gt(0)">&#x20B9;{{ selectedVariant.price }}</span>
                    <span class="text-bold text-nutral">&#x20B9;{{ new
            BigNumber(selectedVariant?.price).minus(discount).toFixed(2)
                        }}</span>
                </div>
            </div>
            <q-toolbar-title class="row justify-end">
                <NuxtLink :to="routes.book_Service(selectedVariant!.id)">
                    <q-btn color="secondary" :size="$q.screen.gt.xs ? 'md' : 'md'">Book Now</q-btn>
                </NuxtLink>
            </q-toolbar-title>
        </q-toolbar>
    </q-footer>
</template>