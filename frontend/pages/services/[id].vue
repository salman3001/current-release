<script setup lang="ts">
import qs from 'qs'



const route = useRoute()
const customFetch = useCustomFetch()

const selectedVariant = ref<IServiceVariant | null>(null)


const query = {
  populate: {
    images: {
      fields: ['*']
    },
    variants: {
      fields: ['id', 'price', 'name', 'image']
    },
    business: {
      fields: ['id', 'vendor_user_id', 'name'],
      populate: {
        vendor: {
          fields: ['id', 'first_name', 'last_name']
        },
      }
    }
  }
} as AdditionalParams



const { data: service } = await useAsyncData('service' + route.params.id as string, async () => {
  const data = await customFetch<IResType<IService>>(apiRoutes.services_view(route.params.id as string, qs.stringify(query)))
  return data.data
})


const items = [
  {
    src: "https://cdn.quasar.dev/img/mountains.jpg",
    thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
    w: 1200,
    h: 900,
    alt: "some numbers on a grey background", // optional alt attribute for thumbnail image
  },
  {
    src: "https://cdn.quasar.dev/img/mountains.jpg",
    thumbnail: "https://cdn.quasar.dev/img/mountains.jpg  ",
    w: 1200,
    h: 900,
    // htmlAfterThumbnail: '<span class="photos-date">29.12.2021</span>', // optional, insert your html after tag <a> if you need it
  },
  {
    src: "https://cdn.quasar.dev/img/mountains.jpg",
    thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
    w: 1200,
    h: 900,
    alt: "some numbers on a grey background", // optional alt attribute for thumbnail image
  },
  {
    src: "https://cdn.quasar.dev/img/mountains.jpg",
    thumbnail: "https://cdn.quasar.dev/img/mountains.jpg  ",
    w: 1200,
    h: 900,
    // htmlAfterThumbnail: '<span class="photos-date">29.12.2021</span>', // optional, insert your html after tag <a> if you need it
  },
  {
    src: "https://cdn.quasar.dev/img/mountains.jpg",
    thumbnail: "https://cdn.quasar.dev/img/mountains.jpg",
    w: 1200,
    h: 900,
    alt: "some numbers on a grey background", // optional alt attribute for thumbnail image
  },
];
</script>

<template>
  <div class="q-pa-sm q-pa-sm-md q-pa-lg-xl q-gutter-y-lg">
    <div class="row justify-between items-center">
      <h1 class="text-h4" style="max-width: 700px">
        {{ service?.name }}
      </h1>

      <div class="row items-center q-gutter-sm text-h5 text-muted">
        <NuxtLink class="text-muted underline" to="/"><q-btn left flat icon="share"> Share</q-btn></NuxtLink>
        <NuxtLink class="text-muted underline" to="/"><q-btn left flat icon="favorite"> Add to Wishlist</q-btn>
        </NuxtLink>
      </div>
    </div>
    <div class="row q-gutter-x-md items-center">
      <span class="text-h5">{{ service?.avg_rating.toFixed(1) }}</span>
      <RatingComponent :rating="service?.avg_rating" size="2rem" />
    </div>
    <div>
      <LightBox :items="items" />
    </div>
    <p class="text-h6">
      {{ service?.short_desc }}
    </p>
    <p class="text-h6">
      {{ service?.long_desc }}
    </p>
    <div class="row jjustify-between full-width">
      <div class="row items-center q-gutter-md">
        <ProfileAvatar image="https://cdn.quasar.dev/img/avatar.png" />
        <div>
          Listed by {{ service?.business?.vendor?.first_name }} {{ service?.business?.vendor?.last_name }}
          <br />
          <NuxtLink :to="routes.home" class="underline">
            {{ service?.business?.name }}</NuxtLink>
        </div>
      </div>
    </div>
    <q-separator></q-separator>
    <div>
      <h6>Select an Options</h6>
      <div class="q-gutter-md row justify-between">
        <div class="q-gutter-md row items-start" style="flex-grow: 1">
          <WebSelectVariant v-for="variant in service?.variants" :variant="variant"
            @variant-selection="variant => selectedVariant = variant" />
        </div>
        <q-card flat bordered style="min-width: 300px" class="gt-sm q-pa-md">
          <div v-if="selectedVariant">
            <q-card-section class="text-h5">{{ selectedVariant?.name }}</q-card-section>
            <q-card-section>
              <div class="row justify-between">
                <div>Price</div>
                <div>&#x20B9;{{ selectedVariant?.price }}/-</div>
              </div>
              <div class="row justify-between">
                <div>Discount</div>
                <div>&#x20B9;0/-</div>
              </div>
            </q-card-section>
            <q-card-section class="row text-h5 text-bold justify-end"><span>&#x20B9;{{ selectedVariant?.price
                }}/-</span></q-card-section>
            <q-card-section class="text-h5">
              <NuxtLink :to="routes.book_Service(1)">
                <q-btn class="full-width" color="primary">Book Now</q-btn>
              </NuxtLink>
            </q-card-section>
          </div>
          <div v-else>
            Price Upon variant selection
          </div>
        </q-card>
      </div>
    </div>
    <q-separator></q-separator>
    <div :class="$q.screen.gt.xs ? 'row q-col-gutter-md' : 'column q-col-gutter-md'
          " class="">
      <div class="col">
        <h6>What is Included</h6>
        <ul class="q-pt-sm q-gutter-y-sm list-style-none">
          <li v-for="i in 5">
            <q-icon name="done" color="green"></q-icon> Lorem ipsum dolor sit
            amet consectetur adipisicing elit.
          </li>
        </ul>
      </div>
      <div class="col">
        <h6>What is Excluded</h6>
        <ul class="q-pt-sm q-gutter-y-sm list-style-none">
          <li v-for="i in 5">
            <q-icon name="close" color="red"></q-icon> Lorem ipsum dolor sit
            amet consectetur adipisicing elit.
          </li>
        </ul>
      </div>
    </div>

    <q-footer elevated class="bg-nutral text-muted lt-md">
      <q-toolbar class="" style="min-height: 80px">
        <div class="column" style="max-width: 50%">
          <span> Lorem ipsum dolor sit ipsum dolor si</span>
          <span class="text-h6 text-bold text-nutral"> &#x20B9;200/- </span>
        </div>
        <q-toolbar-title class="row justify-end">
          <NuxtLink :to="routes.book_Service(1)">
            <q-btn color="secondary" :size="$q.screen.gt.xs ? 'md' : 'md'">Book Now</q-btn>
          </NuxtLink>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
    <q-separator />
    <div class="q-gutter-md">
      <h5>Cutomer Reviews</h5>
      <div class="row gap-100">
        <div class="q-gutter-lg col-12 col-md-4" style="">
          <RatingComponent :rating="4" /><span class="text-h5">4 out of 5</span>
          <q-separator />
          <div class="q-gutter-y-sm">
            <h6>Rate this service</h6>
            <p>Share your throught about this service</p>
            <q-btn color="primary">Write a Review</q-btn>
          </div>
          <q-separator />
        </div>
        <CustomerReviews />
      </div>
    </div>
  </div>
</template>
