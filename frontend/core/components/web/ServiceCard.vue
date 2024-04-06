<script setup lang="ts">
import BigNumber from 'bignumber.js';


const getImageUrl = useGetImageUrl();
const props = defineProps<{ service: IService }>();

const wishlist = wishlistStore()
const color = ref("grey-4");

const minPriceVariant = props.service.variants.reduce((prev, current) => prev.price < current.price ? prev : current)

let discount = new BigNumber(0);

if (minPriceVariant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(minPriceVariant?.discount_flat || 0);
} else if (minPriceVariant?.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(minPriceVariant?.discount_percentage || 0)
    .div(100)
    .times(minPriceVariant.price);
}

const isWishlisted = computed(() => {
  const matchedItem = wishlist.wishlistItems.filter(i => i.id == props.service.id)
  if (matchedItem.length > 0) {
    return true
  } else {
    false
  }

})

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
      <q-btn icon="favorite" szie round color="pink" class="cursor-pointer" size="md"
        style="top: 25px; right: 25px; opacity: 0.8" v-if="isWishlisted"
        @click="wishlist.removeWishlistItem(service.id)">
        <q-tooltip class="bg-primary">Remove</q-tooltip></q-btn>
      <q-btn icon="favorite" v-else szie round :color="color" @mouseenter="color = 'pink'"
        @mouseleave="color = 'grey-4'" class="cursor-pointer" size="md" style="top: 25px; right: 25px; opacity: 0.8"
        @click="wishlist.addWishlistItem(service.id)"> <q-tooltip class="bg-primary">Add</q-tooltip></q-btn>
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
