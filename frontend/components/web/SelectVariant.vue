<script setup lang="ts">
import BigNumber from 'bignumber.js';

const props = defineProps<{
  variant: IServiceVariant,
  selectedId: number
}>()


let discount = new BigNumber(0)

if (props.variant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(props.variant.discount_flat)
} else if (props.variant.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(props.variant.discount_percentage).div(100).times(props.variant.price)
}
</script>

<template>
  <div @click="$emit('variant-selection', variant)" class="rounded-borders q-pa-sm cursor-pointer"
    :class="selectedId == variant.id ? 'border-primary border-2' : 'border'">
    <q-img src="/images/service-category-placeholder.jpg" style="width: 150px; height: 100px"
      class="cols-2 cols-sm-3 cols-md-4 cols-lg-5 rounded-borders ">
    </q-img>
    <div><q-badge color="negative" v-if="discount.gt(0) && variant.discount_type === DiscountType.FLAT">&#x20B9;{{
      variant.discount_flat }} off</q-badge></div>
    <div><q-badge color="negative" v-if="discount.gt(0) && variant.discount_type === DiscountType.PERCENATAGE">{{
      variant.discount_percentage }}% off</q-badge></div>
    <div class="">{{ variant?.name }}</div>
    <div class="line-through" v-if="discount.gt(0)">&#x20B9;{{ variant.price }}</div>
    <div class="text-bold">&#x20B9;{{ new BigNumber(variant?.price).minus(discount).toFixed(2) }}</div>
  </div>
</template>
