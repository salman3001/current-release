<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";
const props = defineProps<{
  accepted: boolean;
  bid?: IBid;
}>();

const customFetch = useCustomFetch();

const {
  data: vendorRating,
  pending,
  refresh,
} = useAsyncData(
  "vendor-rating" + props.bid?.vendorUser?.id,
  async () => {
    const data = await customFetch<IResType<{ rating: number }>>(
      apiRoutes.vendor_user_get_rating(props.bid?.vendorUser?.id as number)
    );

    return data.data.rating;
  },
  {
    server: false,
    lazy: true,
    immediate: false,
  }
);
</script>

<template>
  <q-card flat bordered class="q-gutter-y-none full-width">
    <q-card-section>
      <p class="text-h5" v-if="accepted">Accpted Proposal</p>
      <div class="row justify-between q-gutter-y-md">
        <div class="row items-start q-gutter-sm">
          <q-avatar v-if="accepted">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div class="q-gutter-sm">
            <span v-if="accepted"
              >{{ bid?.vendorUser.first_name }}
              {{ bid?.vendorUser.last_name }} |
              <NuxtLink :to="routes.home" class="underline">{{
                bid?.vendorUser?.business?.name
              }}</NuxtLink></span
            >
            <div>
              <div class="text-bold">Service Providers Rating</div>
              <div class="row gap-50 items-center">
                <q-btn
                  outline
                  color="primary"
                  size="sm"
                  v-if="pending"
                  @click="refresh()"
                >
                  Load Vendors Rating</q-btn
                >
                <div v-else>
                  <RatingComponent :rating="vendorRating || 0" size="1.1rem" />
                  <span v-if="vendorRating">{{ vendorRating.toFixed(1) }}</span>
                  <span v-else="vendorRating">0</span>
                </div>
              </div>
            </div>
            <div v-if="accepted">
              <q-btn color="primary" size="sm">Chat</q-btn>
            </div>
          </div>
        </div>
        <div>
          <p class="text-muted flex gap-100">
            {{ date.formatDate(bid?.created_at, "DD/MM/YYYY hh:mmA") }}
          </p>
          <div class="text-bold text-subtitle1">
            Offered Price: &#x20B9;{{ bid?.offered_price }}
          </div>
        </div>
      </div>
    </q-card-section>
    <q-separator vertical />
    <q-card-section :horizontal="$q.screen.gt.xs">
      <q-card-section>
        <div class="text-bold text-subtitle1">Included</div>
        <ul class="list-style-none text-muted">
          <li v-for="(f, i) in bid?.features_included" :key="i">{{ f }}</li>
        </ul>
      </q-card-section>
      <q-separator inset :vertical="$q.screen.gt.xs"></q-separator>
      <q-card-section>
        <div class="text-bold text-subtitle1">Excluded</div>
        <ul class="list-style-none text-muted">
          <li v-for="(f, i) in bid?.features_excluded" :key="i">{{ f }}</li>
        </ul>
      </q-card-section>
    </q-card-section>

    <q-card-actions class="justify-end q-pa-md q-gutter-sm">
      <NuxtLink :to="routes.book_Service(1)" v-if="!accepted">
        <q-btn color="primary"> Acccept</q-btn>
      </NuxtLink>
    </q-card-actions>
  </q-card>
</template>
