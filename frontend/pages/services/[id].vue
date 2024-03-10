<script setup lang="ts">
import qs from 'qs'



const route = useRoute()
const customFetch = useCustomFetch()
const modal = modalStore()
const user = useCookie('user')

const selectedVariant = ref<IServiceVariant | null>(null)




const reviewsQuery = {

} as AdditionalParams



const { data: service, pending: servicePending } = await useAsyncData('service' + route.params.id as string, async () => {
  const data = await customFetch<IResType<IService>>(apiRoutes.services_view(route.params.id as string), {
    query: {
      populate: {
        images: {
          fields: ['*']
        },
        variants: {
          fields: ['id', 'price', 'name', 'image', 'included', 'excluded']
        },
        business: {
          fields: ['id', 'vendor_user_id', 'name'],
          populate: {
            vendor: {
              fields: ['id', 'first_name', 'last_name']
            },
          }
        },
        reviews: {
          fields: ['rating']
        }
      } as AdditionalParams
    }
  })
  return data.data
})

selectedVariant.value = service.value?.variants[0] || null

const { data: reviews, pending: reviewsPending, refresh: refreshReviews } = useAsyncData('reviews' + route.params.id as string, async () => {
  const data = await customFetch<IPageRes<IReview[]>>(apiRoutes.reviews(route.params.id as string), {
    query: {
      populate: {
        user: {
          fields: ['first_name', 'last_name'],
          populate: {
            profile: {
              fields: ['avatar']
            }
          }
        }
      },
      page: 1
    } as AdditionalParams
  })
  return data.data
}, {
  server: false,
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
      <span class="text-h5">{{ service?.avg_rating }}</span>
      <RatingComponent :rating="service?.avg_rating || 0" size="2rem" />
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
      <br>
      <div class="q-gutter-md row justify-between">
        <div>
          <div class="q-gutter-md row items-start" style="flex-grow: 1">
            <WebSelectVariant v-for="variant in service?.variants" :variant="variant"
              @variant-selection="variant => selectedVariant = variant" :selected-id="selectedVariant?.id || 0" />
          </div>
          <br>

          <div :class="$q.screen.gt.xs ? 'row q-col-gutter-md' : 'column q-col-gutter-md'
          " class="">
            <div class="col">
              <h6>What is Included</h6>
              <ul class="q-pt-sm q-gutter-y-sm list-style-none">
                <li v-for="i in selectedVariant?.included">
                  <q-icon name="done" color="green"></q-icon> {{ i }}
                </li>
              </ul>
            </div>
            <div class="col">
              <h6>What is Excluded</h6>
              <ul class="q-pt-sm q-gutter-y-sm list-style-none">
                <li v-for="i in selectedVariant?.excluded">
                  <q-icon name="close" color="red"></q-icon> {{ i }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <WebPriceCard :selected-variant="selectedVariant!" />
      </div>
    </div>
    <WebPriceCardFooter :selected-variant="selectedVariant!" />

    <q-separator />
    <div class="q-gutter-md">
      <h5>Cutomer Reviews</h5>
      <div class="row gap-100">
        <div class="q-gutter-lg col-12 col-md-4" style="">
          <RatingComponent :rating="service?.avg_rating || 0" /><span class="text-h5">{{ service?.avg_rating || 0 }} out
            of 5</span>
          <q-separator />
          <div class="q-gutter-y-sm">
            <h6>Rate this service</h6>
            <p>Share your throught about this service</p>
            <q-btn color="primary" @click="() => {
          if (user) {
            modal.togel('WebAddReview', {
              serviceId: service?.id,
              onSuccess: refreshReviews
            })
          } else {
            navigateTo(routes.auth.login + `?next=${route.path}`)
          }
        }">Write a Review</q-btn>
          </div>
          <q-separator />
        </div>
        <div style="max-width: 500px" class="q-gutter-xl col-12 col-md-8">
          <div v-if="reviewsPending">
            <SkeletonBase type="list" v-for="i in 5" />

          </div>
          <div v-if="reviews?.data.length! < 1" class="text-subtitle1">
            <q-icon name="info" class="text-primary" size="20px" /> This Service dont have any reviews yet
          </div>
          <div v-for="review in reviews?.data" class="q-gutter-sm">
            <CustomerReview :review="review" />
          </div>
          <q-btn color="primary" v-if="reviews?.meta.next_page_url">View More</q-btn>
        </div>
      </div>
    </div>
  </div>
</template>
