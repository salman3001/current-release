<script setup lang="ts">
import BigNumber from "bignumber.js";

const getImageUrl = useGetImageUrl()

const props = defineProps<{
  variant: IServiceVariant;
  selectedId: number;
}>();

let discount = new BigNumber(0);

if (props.variant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(props.variant.discount_flat);
} else if (props.variant.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(props.variant.discount_percentage)
    .div(100)
    .times(props.variant.price);
}
</script>

<template>
  <div @click="$emit('variant-selection', variant)" class="row q-pa-xs q-col-gutter-x-sm cursor-pointer shadow-16"
    :class="selectedId == variant.id ? 'border-primary border-2' : 'border'"
    style="width: 250px; height: 100px; border-radius: 10px">
    <q-img :src="getImageUrl(variant.image?.breakpoints?.thumbnail?.url)" class="col-4" style="height: 100%">
    </q-img>

    <div class="col-8">
      <div>
        <q-badge color="negative" v-if="discount.gt(0) && variant.discount_type === DiscountType.FLAT">&#x20B9;{{
      variant.discount_flat }} off</q-badge>
      </div>
      <div>
        <q-badge color="negative" v-if="discount.gt(0) && variant.discount_type === DiscountType.PERCENATAGE
      ">{{ variant.discount_percentage }}% off</q-badge>
      </div>
      <div class="ellipsis-2-lines">
        {{ variant?.name }} Lorem ipsum dolor sit amet consectetur adipisicing
        elit. Tenetur, placeat!
      </div>
      <div class="row q-gutter-sm">
        <div class="line-through text-subtitle2" v-if="discount.gt(0)">
          &#x20B9;{{ variant.price }}
        </div>
        <div class="text-bold text-body1">
          &#x20B9;{{ new BigNumber(variant?.price).minus(discount).toFixed(2) }}
        </div>
      </div>
    </div>
  </div>
</template>
