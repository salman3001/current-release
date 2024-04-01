<script setup lang="ts">
import BigNumber from 'bignumber.js';

const getImageUrl = useGetImageUrl();

const props = defineProps<{ service: IService }>();

const minPriceVariant = props.service.variants.reduce((prev, current) => prev.price < current.price ? prev : current)

let discount = new BigNumber(0);

if (minPriceVariant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(minPriceVariant?.discount_flat || 0);
} else if (minPriceVariant?.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(minPriceVariant?.discount_percentage || 0)
    .div(100)
    .times(minPriceVariant.price);
}

</script>

<template>
  <q-card class="my-card relative-position shadow-10 border" style="height: 13 0px">
    <q-card-section horizontal>
      <q-card-section class="row full-width q-gutter-sm q-pa-xs">
        <div class="col-4">
          <NuxtLink :to="routes.view_service(service?.slug)">
            <q-img :src="getImageUrl(
            service.images?.[0]?.file?.breakpoints?.thumbnail?.url
          )
            " width="100%" height="100%" style="max-width: 150px" class="rounded-borders" />
          </NuxtLink>
        </div>
        <div class="col-7 q-gutter-sm">
          <div class="row items-center q-gutter-xs">
            <q-icon name="star" color="yellow-9" size="20px"></q-icon><span class="subtitle1">{{ service.avg_rating }} |
              {{ service?.meta?.reviews_count }} Reviews</span>
          </div>
          <div class="row justify-between items-center">
            <NuxtLink :to="routes.view_service(service?.slug)">
              <div class="col text-h6 text-bold ellipsis text-nutral ellipsis-2-lines" style="text-wrap: wrap">
                {{ service?.name }}
              </div>
            </NuxtLink>
          </div>
          <div class="row justify-between">
            <div class="">
              <span>
                {{ service.variants?.length ? 1 && "Starting From" : "" }}</span><span class="text-bold text-h6">
                &#x20B9;{{
            service.variants?.length > 1
              ? service?.meta?.starting_from
              : service?.variants[0]?.price
          }}</span>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
    <div class="absolute-top-left" style="top: 5px;left: 5px;">
      <div>
        <q-badge class="q-px-md text-body2" color="negative"
          v-if="discount.gt(0) && minPriceVariant.discount_type === DiscountType.FLAT">&#x20B9;{{
            minPriceVariant.discount_flat }} off</q-badge>
      </div>
      <div>
        <q-badge class="q-px-md text-body2" color="negative" v-if="discount.gt(0) && minPriceVariant.discount_type === DiscountType.PERCENATAGE
            ">{{ minPriceVariant.discount_percentage }}% off</q-badge>
      </div>
    </div>
  </q-card>
</template>
