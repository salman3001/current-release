<script setup lang="ts">
const route = useRoute();
const customFetch = useCustomFetch();
const modal = modalStore();
const user = useCookie("user");
const getImageUrl = useGetImageUrl();

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
  <div class="q-gutter-y-lg">
    <q-card class="shadow-18 q-py-lg">
      <q-card-section
        :horizontal="$q.screen.gt.sm"
        class=""
        style="min-width;: 400px"
      >
        <q-card-section
          class="col q-pb-md justify-center items-center"
          :style="{
            scale: $q.screen.lt.md ? '125%' : '100%',
            translate: $q.screen.lt.md ? '0% -10%' : '',
          }"
        >
          <WebCrousel
            height="100%"
            :rounded="$q.screen.gt.sm"
            :duration="2500"
          />
        </q-card-section>
        <q-card-section class="col q-col-gutter-md">
          <div class="row justify-between items-center">
            <NuxtLink
              :to="{
                path: routes.home,
                query: { tab: service?.serviceCategory?.id },
              }"
              ><q-btn
                flat
                icon="mail"
                class="q-px-xs normalcase"
                :label="service?.serviceCategory?.name"
                v-if="service?.serviceCategory"
              >
              </q-btn>
            </NuxtLink>

            <div class="row items-center q-gutter-sm text-h5 text-muted">
              <NuxtLink class="text-muted underline" to="/"
                ><q-btn left flat icon="share" label="Share"></q-btn
              ></NuxtLink>
              <NuxtLink class="text-muted underline" to="/"
                ><q-btn
                  left
                  outline
                  icon="favorite"
                  color="muted"
                  label="Add to Wishlist"
                  class="icon-pink"
                >
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
          <div class="q-gutter-md row items-start">
            <WebSelectVariant
              v-for="variant in service?.variants"
              :variant="variant"
              @variant-selection="(variant) => (selectedVariant = variant)"
              :selected-id="selectedVariant?.id || 0"
            />
          </div>
          <div>
            <WebPriceCard :selected-variant="selectedVariant!" />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>

    <p class="text-h6">
      {{ service?.short_desc }}
    </p>
    <p class="text-h6">
      {{ service?.long_desc }}
    </p>
    <div class="row jjustify-between full-width">
      <div class="row items-center q-gutter-md">
        <ProfileAvatar
          :image="
            getImageUrl(
              service?.vendorUser?.profile?.avatar?.url,
              '/images/sample-dp.png'
            )
          "
        />
        <div>
          Listed by {{ service?.vendorUser?.first_name }}
          {{ service?.vendorUser?.last_name }}
          <br />
          <NuxtLink
            :to="routes.view_business(service?.vendorUser.id!)"
            class="underline"
          >
            {{ service?.vendorUser?.business_name }}</NuxtLink
          >
        </div>
      </div>
    </div>
    <WebPriceCardFooter :selected-variant="selectedVariant!" />

    <q-separator />
    <div class="q-gutter-md">
      <h5>Cutomer Reviews</h5>
      <div class="row gap-100">
        <div class="q-gutter-lg col-12 col-md-4" style="">
          <RatingComponent :rating="service?.avg_rating || 0" /><span
            class="text-h5"
            >{{ service?.avg_rating || 0 }} out of 5</span
          >
          <q-separator />
          <div class="q-gutter-y-sm">
            <h6>Rate this service</h6>
            <p>Share your throught about this service</p>
            <q-btn
              color="primary"
              @click="
                () => {
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
              "
              >Write a Review</q-btn
            >
          </div>
          <q-separator />
        </div>
        <div style="max-width: 500px" class="q-gutter-xl col-12 col-md-8">
          <div v-if="reviewsPending">
            <SkeletonBase type="list" v-for="i in 5" />
          </div>
          <div v-if="reviews?.data.length! < 1" class="text-subtitle1">
            <q-icon name="info" class="text-primary" size="20px" /> This Service
            dont have any reviews yet
          </div>
          <div v-for="review in reviews?.data" class="q-gutter-sm">
            <CustomerReview :review="review" />
          </div>
          <q-btn color="primary" v-if="reviews?.meta.next_page_url"
            >View More</q-btn
          >
        </div>
      </div>
    </div>
  </div>
</template>
