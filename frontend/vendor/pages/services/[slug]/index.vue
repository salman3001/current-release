<script setup lang="ts">
const route = useRoute();
const getImageUrl = useGetImageUrl();

const selectedVariant = ref<IServiceVariant | null>(null);

const { show } = useServiceApi.showBySlug()

const {
  data: service,
  pending: servicePending,
  refresh: refreshService,
} = await useAsyncData(("service-" + route.params.slug) as string, async () => {
  const data = await show(route.params.slug as string)
  return data.data;
});
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
          <WebCrousel :height="$q.screen.gt.sm ? '100%' : '200px'" :rounded="$q.screen.gt.sm" :duration="2500"
            :image-urls="service?.images?.length > 0
          ? service?.images?.map((img) => getImageUrl(img?.file?.url))
          : ['/images/No-image-found.jpg', '/images/No-image-found.jpg']
        " />
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
          </div>
          <div class="row justify-between items-center">
            <h1 class="text-h4" style="max-width: 700px">
              {{ service?.name }}
            </h1>
          </div>
          <div class="row q-gutter-x-sm items-center">
            <q-icon name="star" color="yellow-9" size="36px"></q-icon>
            <span class="text-h6">{{ service?.avg_rating || 0 }}</span>
            <span class="text-muted">
              ({{ service?.meta?.reviews_count }} Reviews)
            </span>
          </div>
          <div class="q-gutter-xl row items-start">
            <WebSelectVariant v-for="variant in service?.variants" :variant="variant"
              @variant-selection="(variant: any) => (selectedVariant = variant)"
              :selected-id="selectedVariant?.id || 0" />
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
    <br />
    <br />
    <div>
      <p class="text-h6">
        {{ service?.short_desc }}
      </p>
      <br />
      <div>
        <h6>Variant Description</h6>
        <p class="text-subtitle1 text-muted">{{ selectedVariant?.desc }}</p>
      </div>
      <br />
      <div>
        <h6>Service Description</h6>
        <p class="text-subtitle1 text-muted">{{ service?.long_desc }}</p>
      </div>
      <br />
      <div v-if="service?.faq">
        <h6>Frequently Asked Question</h6>
        <br />
        <Accordian :items="service?.faq?.map((f) => ({ title: f.quest, desc: f.ans })) || []
        " />
      </div>
    </div>
    <br />
    <q-separator />
    <br />
    <div class="q-gutter-md">
      <div style="max-width: 700px">
        <h5>Reviews & Rating</h5>
        <br />

        <div>
          <RatingComponent :rating="service?.avg_rating ? Number(service?.avg_rating) : 0" /><span class="text-h5">{{
        service?.avg_rating || 0 }} out of 5 |
            {{ service?.meta?.reviews_count }} Reviews</span>
        </div>
        <br />
      </div>

      <div class="row justify-start">
        <q-btn right flat color="primary" class="normalcase text-h6">View all Reviews</q-btn>
      </div>
    </div>
    <div class="col-12 col-md-8">
      <div v-if="servicePending">
        <SkeletonBase type="list" v-for="i in 5" />
      </div>
      <div v-if="service?.reviews?.length! < 1" class="text-subtitle1">
        <q-icon name="info" class="text-primary" size="20px" /> This Service
        dont have any reviews yet
      </div>
      <div v-for="review in service?.reviews" class="row q-gutter-md">
        <CustomerReview :review="review" />
      </div>
      <br />
      <br />
    </div>
  </div>
</template>
