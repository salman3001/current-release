<script setup lang="ts">
const route = useRoute();
const customFetch = useCustomFetch();
const modal = modalStore();
const user = useCookie("user");
const getImageUrl = useGetImageUrl();
const slide = ref()

const selectedVariant = ref<IServiceVariant | null>(null);

const { data: service, pending: servicePending } = await useAsyncData(
  ("service-" + route.params.slug) as string,
  async () => {
    const data = await customFetch<IResType<IService>>(
      apiRoutes.services_view_by_slug(route.params.slug as string),
      {
        query: {
          preload: [
            {
              serviceCategory: {
                select: ["name"],
              },
            },
            {
              images: {
                select: ["*"],
              },
              variants: {
                select: [
                  "id",
                  "price",
                  "name",
                  "image",
                  "included",
                  "excluded",
                ],
              },
              vendorUser: {
                select: ["id", "first_name", "last_name", "businessName"],
              },
              reviews: {
                select: ["rating"],
              },
            },
          ],
        } as AdditionalParams,
      }
    );
    return data.data;
  }
);

const {
  data: similarServices,
  refresh,
  pending: similarServicesPending,
} = await useAsyncData(() =>
  customFetch<IPageRes<IService[]>>(apiRoutes.services, {
    query: {
      page: 1,
      rowsPerPage: 5,
      preload: [
        {
          variants: {
            select: ["id", "price"],
          },
          reviews: {
            select: ["rating"],
          },
        },
      ],
      withAggregate: [
        {
          aggregator: "min",
          field: "price",
          relation: "variants",
          as: "starting_from",
        },
      ],
    } as AdditionalParams,
  })
);

selectedVariant.value = service.value?.variants[0] || null;

const {
  data: reviews,
  pending: reviewsPending,
  refresh: refreshReviews,
} = useAsyncData(
  ("reviews" + route.params.slug) as string,
  async () => {
    const data = await customFetch<IPageRes<IReview[]>>(
      apiRoutes.reviews(service.value!.id),
      {
        query: {
          preload: [
            {
              user: {
                select: ["first_name", "last_name"],
                preload: [
                  {
                    profile: {
                      select: ["avatar"],
                    },
                  },
                ],
              },
            },
          ],
          page: 1,
        } as AdditionalParams,
      }
    );
    return data.data;
  },
  {
    server: false,
  }
);
</script>

<template>
  <br />
  <div>
    <q-card class="shadow-18 q-pa-none">
      <q-card-section :horizontal="$q.screen.gt.sm" class="">
        <q-card-section class="col q-pb-md justify-center position-relative items-center" :style="{
        scale: $q.screen.lt.md ? '125%' : '100%',
        top: $q.screen.lt.md ? '-30px' : '',
      }">
          <WebCrousel :height="$q.screen.gt.sm ? '100%' : '200px'" :rounded="$q.screen.gt.sm" :duration="2500" />
        </q-card-section>
        <q-card-section class="col q-col-gutter-lg">
          <div class="row justify-between items-center">
            <NuxtLink :to="{
        path: routes.home,
        query: { tab: service?.serviceCategory?.id },
      }"><q-btn flat icon="mail" class="q-px-xs normalcase" :label="service?.serviceCategory?.name"
                v-if="service?.serviceCategory">
              </q-btn>
            </NuxtLink>

            <div class="row items-center justify-end q-gutter-sm text-h5 text-muted">
              <NuxtLink class="text-muted underline" to="/"><q-btn left flat icon="share" label="Share"></q-btn>
              </NuxtLink>
              <NuxtLink class="text-muted underline" to="/"><q-btn left outline icon="favorite" color="muted"
                  label="Add to Wishlist" class="icon-pink">
                </q-btn>
              </NuxtLink>
            </div>
          </div>
          <div class="row justify-between items-center">
            <h1 class="text-h4" style="max-width: 700px">
              {{ service?.name }}
            </h1>
          </div>
          <div class="row q-gutter-x-sm items-center">
            <q-icon name="star" color="yellow-9" size="36px"></q-icon>
            <span class="text-h6">{{ service?.avg_rating || 0 }}</span>
            <span class="text-muted"> (14 Reviews) </span>
          </div>
          <div class="q-gutter-xl row items-start">
            <WebSelectVariant v-for="variant in service?.variants" :variant="variant"
              @variant-selection="(variant) => (selectedVariant = variant)" :selected-id="selectedVariant?.id || 0" />
          </div>
          <div>
            <WebPriceCard :selected-variant="selectedVariant!" />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <br>
    <br>
    <div class="row">
      <div class="col-12 col-md-8">
        <p class="text-h6">
          {{ service?.short_desc }}
        </p>
        <br>
        <br>
        <p class="text-h6">
          {{ service?.long_desc }}
        </p>
        <br>
        <br>
        <div class="row q-col-gutter-sm text-subtitle1">
          <div class=" col-12 col-sm-6">
            <q-card flat class="shado">
              <q-card-section class="q-pb-none">
                <p class="text-h6 text-bold">Included</p>
              </q-card-section>

              <q-card-section class="">
                <ul class="list-style-none column q-gutter-sm">
                  <li v-for="inc, i in selectedVariant?.included" :key="i" class="q-pa-sm bg-grey-2 "
                    style="border-radius: 10px;">
                    <q-btn outline round size="xs" icon="done" color="positive">
                    </q-btn>
                    &nbsp;
                    <span>
                      {{ inc }} Lorem ipsum dolor, sit amet co
                    </span>
                  </li>
                </ul>
              </q-card-section>
            </q-card>
          </div>
          <div class="col-12 col-sm-6">

            <q-card flat class="shado">
              <q-card-section class="q-pb-none">
                <p class="text-h6 text-bold">Excluded</p>
              </q-card-section>

              <q-card-section class="">
                <ul class="list-style-none column q-gutter-sm">
                  <li v-for="inc, i in selectedVariant?.excluded" :key="i" class="q-pa-sm bg-grey-2 "
                    style="border-radius: 10px;">
                    <q-btn outline round size="xs" icon="close" color="red">
                    </q-btn>
                    &nbsp;
                    <span>
                      {{ inc }} Lorem ipsum dolor, sit amet
                    </span>
                  </li>
                </ul>
              </q-card-section>
            </q-card>
          </div>
        </div>
        <br>
        <br>
        <div class="row jjustify-between full-width">
          <div class="row items-center q-gutter-md">
            <ProfileAvatar :image="getImageUrl(
        service?.vendorUser?.profile?.avatar?.url,
        '/images/sample-dp.png'
      )
        " />
            <div>
              Listed by {{ service?.vendorUser?.first_name }}
              {{ service?.vendorUser?.last_name }}
              <br />
              <NuxtLink :to="routes.view_business(service?.vendorUser.id!)" class="underline">
                {{ service?.vendorUser?.business_name }}</NuxtLink>
            </div>
          </div>
        </div>
        <br>
        <br>
      </div>
      <q-card flat class="col-12 col-md-4 border q-pa-md">
        <div class="row justify-between text-h6">
          <p>You may also like</p>
          <NuxtLink :to="routes.home">View All</NuxtLink>
        </div>
        <br>
        <div v-for="s in similarServices?.data.data" v-if="$q.screen.gt.sm">
          <WebServiceCard2 :service="s" />
          <br>
        </div>
        <div v-else>
          <q-carousel animated swipeable v-model="slide" :arrows="true" :controls="true" :autoplay="2500"
            :navigation="true" infinite transition-prev="slide-right" transition-next="slide-left" :height="'200px'"
            control-type="unelevated" control-color="primary">
            <template v-slot:navigation-icon="{ active, btnProps, onClick }">
              <q-btn size="xs" color="white" flat round dense @click.stop="onClick">
                <q-icon :name="btnProps.icon" :color="active ? 'primary' : 'grey-6'"></q-icon>
              </q-btn>
            </template>
            <q-carousel-slide v-for="s in similarServices?.data.data" :name="s.id" class="cursor-pointer">
              <WebServiceCard2 :service="s" />
            </q-carousel-slide>
          </q-carousel>
        </div>
      </q-card>
    </div>

    <br>
    <br>
    <q-separator />
    <br>
    <br>
    <div class="q-gutter-md">
      <div style="max-width: 700px;">
        <h5>Reviews & Rating</h5>
        <br>

        <div>
          <RatingComponent :rating="service?.avg_rating || 0" /><span class="text-h5">{{ service?.avg_rating || 0 }}
            out
            of 5 | 28 Reviews</span>
        </div>
        <br>

        <q-btn color="primary" @click="() => {
        if (user) {
          modal.togel('WebAddReview', {
            type: 'service',
            serviceId: service?.id,
            onSuccess: refreshReviews,
          });
        } else {
          navigateTo(routes.auth.login + `?next=${route.path}`);
        }
      }
        ">Write a Review</q-btn>

      </div>


      <div class="row justify-start">
        <q-btn right flat color="primary" class="normalcase text-h6">View all Reviews</q-btn>
      </div>

    </div>
    <div class=" col-12 col-md-8">
      <div v-if="reviewsPending">
        <SkeletonBase type="list" v-for="i in 5" />
      </div>
      <div v-if="reviews?.data.length! < 1" class="text-subtitle1">
        <q-icon name="info" class="text-primary" size="20px" /> This Service
        dont have any reviews yet
      </div>
      <div v-for="review in reviews?.data" class="row q-gutter-md">
        <CustomerReview :review="review" />
        <CustomerReview :review="review" />
        <CustomerReview :review="review" />
        <CustomerReview :review="review" />
        <CustomerReview :review="review" />
        <CustomerReview :review="review" />
        <CustomerReview :review="review" />
        <CustomerReview :review="review" />
      </div>
      <br>
      <br>
      <br>
    </div>
  </div>

</template>
