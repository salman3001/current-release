<script setup lang="ts">
const route = useRoute();
const getImageUrl = useGetImageUrl();
const user = useCookie("user");
const modal = modalStore();


const { show } = useVendorApi.show()
const {
  data: vendor,
  refresh: refreshVendor,
  pending,
} = await useAsyncData("vendor-profile-" + route.params.id, async () => {
  const data = await show(route.params.id as any)
  return data.data;
});

const { list: serviceList, query: serviceQuery } = useServiceApi.list({
  page: 1,
  field__vendor_user_id: vendor.value!.id,
})
const {
  data: services,
  refresh,
  pending: servicesPending,
} = await useAsyncData(async () => {
  const data = await serviceList()
  return data;
});
</script>

<template>
  <br />

  <div class="q-gutter-y-lg">
    <div class="row q-gutter-md">
      <q-avatar size="156px" text-color="white" class="shadow-2 rounded-borders shadow-12" square>
        <img :src="getImageUrl(vendor?.profile?.avatar?.url, '/images/sample-dp.png')
          " />
      </q-avatar>
      <div>
        <p class="text-h6 text-primary text-bold">
          {{ vendor?.first_name + " " + vendor?.last_name }}
        </p>
        <p class="text-subtitle1 text-bold">
          {{ vendor?.business_name }}
        </p>
        <div class="row items-center gap-100 text-h6">
          <RatingComponent :rating="vendor?.avg_rating ? Number(vendor?.avg_rating) : 0" size="2rem" />
          {{ vendor?.avg_rating || 0 }}
        </div>
        <p>{{ vendor?.meta?.reviews_count }} Reviews</p>
      </div>
    </div>

    <q-card bordered class="column shadow-9">
      <q-card-section>
        <p class="text-bold text-subtitle1">
          About {{ vendor?.first_name + " " + vendor?.last_name }}
        </p>
        <br />
        <p class="text-body1" style="max-width: 500px">
          {{ vendor?.profile?.short_desc }}
        </p>
        <br />
        <p class="text-body1" style="max-width: 500px">
          {{ vendor?.profile?.long_desc }}
        </p>
      </q-card-section>
    </q-card>

    <h6 class="text-bold">
      Services Listed By {{ vendor?.first_name + " " + vendor?.last_name }}
    </h6>
    <div class="row q-col-gutter-lg q-mt-sm">
      <div v-if="servicesPending" v-for="s in 10" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <SkeletonBase type="card" />
      </div>
      <div v-else v-for="s in services?.data.data" class="col-12 col-sm-6 col-md-4 col-lg-3">
        <WebServiceCard :service="s" />
      </div>
    </div>
    <div class="row col-12">
      <PaginateComponet :page="serviceQuery.page" :meta="services?.data.meta"
        @update:model-value="(v: number) => { serviceQuery.page = v; refresh() }" />
    </div>
    <div class="q-gutter-md">
      <div style="max-width: 700px">
        <h5>Reviews & Rating</h5>

        <div>
          <RatingComponent :rating="vendor?.avg_rating ? Number(vendor?.avg_rating) : 0" /><span class="text-h5">{{
          vendor?.avg_rating || 0 }} out of 5 |
            {{ vendor?.meta?.reviews_count }} Reviews</span>
        </div>
        <br />
        <q-btn color="primary" @click="() => {
          if (user) {
            modal.togel('WebAddReview', {
              type: 'vendor',
              vendorId: vendor?.id,
              onSuccess: refreshVendor,
            });
          } else {
            navigateTo(routes.auth.login + `?next=${route.path}`);
          }
        }
          ">Write a Review</q-btn>
      </div>
      <br />

      <div class="row justify-start">
        <q-btn right flat color="primary" class="normalcase text-h6">View all Reviews</q-btn>
      </div>
    </div>
    <div class="col-12 col-md-8">
      <div v-if="pending">
        <SkeletonBase type="list" v-for="i in 5" />
      </div>
      <div v-if="vendor?.reviews.length! < 1" class="text-subtitle1">
        <q-icon name="info" class="text-primary" size="20px" /> This Service
        dont have any reviews yet
      </div>
      <div v-for="review in vendor?.reviews" class="row q-gutter-md">
        <CustomerReview :review="review" />
      </div>
      <br />
      <br />
      <br />
    </div>
  </div>
</template>
