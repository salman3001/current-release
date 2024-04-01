<script setup lang="ts">
import BigNumber from 'bignumber.js';

const color = ref("grey-4");

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
  <q-card bordered class="my-card relative-position shadow-10" style="height: 25rem">
    <div class="">
      <WebCrousel :to="routes.view_service(service?.slug)" :rounded="false" :image-urls="service?.images?.length > 0
        ? service?.images?.map((img) =>
          getImageUrl(img?.file?.breakpoints?.thumbnail?.url)
        )
        : ['/images/No-image-found.jpg', '/images/No-image-found.jpg']
        " />
    </div>

    <q-card-section>
      <div class="row justify-between items-center">
        <NuxtLink :to="routes.view_service(service?.slug)">
          <div class="col text-h6 ellipsis text-nutral">
            {{ service?.name }}
          </div>
        </NuxtLink>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-caption text-muted ellipsis-3-lines">
        {{ service?.short_desc }}
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">
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
        <div class="row items-center q-gutter-xs">
          <q-icon name="star" color="yellow-9" size="30px"></q-icon><span class="subtitle1">{{ service.avg_rating }} ({{
        service?.meta?.reviews_count }})</span>
        </div>
      </div>
    </q-card-section>
    <div class="absolute-top-right">
      <q-icon name="favorite" outline :color="color" @mouseenter="color = 'pink'" @mouseleave="color = 'grey-4'"
        class="cursor-pointer" size="30px" style="top: 25px; right: 25px; opacity: 0.8"></q-icon>
    </div>
    <div class="absolute-top-left" style="top: 5px;left: 5px;">
      <div>
        <q-badge class="q-pa-sm text-subtitle1" color="negative"
          v-if="discount.gt(0) && minPriceVariant.discount_type === DiscountType.FLAT">&#x20B9;{{
        minPriceVariant.discount_flat }} off</q-badge>
      </div>
      <div>
        <q-badge class="q-pa-sm text-subtitle1" color="negative" v-if="discount.gt(0) && minPriceVariant.discount_type === DiscountType.PERCENATAGE
        ">{{ minPriceVariant.discount_percentage }}% off</q-badge>
      </div>
    </div>
  </q-card>
</template>
