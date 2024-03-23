<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const props = defineProps<{
  accepted: boolean;
  bid: IBid;
}>();

const emit = defineEmits<{
  (e: "review", bid: IBid): void;
  (e: "create-chat"): void
}>();

const getImageUrl = useGetImageUrl();
</script>

<template>
  <q-card bordered class="shadow-16 full-width" :class="accepted ? 'border-primary border-2' : ''"
    style="max-width: 450px; height: max-content">
    <q-card-section>
      <div class="row q-gutter-md wrap justify-between">
        <div class="row gap-50">
          <q-avatar size="72px">
            <img :src="getImageUrl(
    bid?.vendorUser?.profile?.avatar?.url,
    '/images/sample-dp.png'
  )
    " />
          </q-avatar>
          <div>
            <p v-if="accepted" class="text-bold text-subtitle1">
              {{ bid?.vendorUser.first_name }}
              {{ bid?.vendorUser.last_name }}
              <q-btn size="xs" color="secondary" @click="emit('create-chat')">chat</q-btn>
            </p>
            <p v-else class="text-bold text-subtitle1">Anonymous</p>
            <div>
              <NuxtLink :to="routes.view_business(bid.vendorUser.id)" class="underline">{{
    bid?.vendorUser?.business_name }}</NuxtLink>
            </div>
            <div>
              <RatingComponent :rating="bid?.vendorUser?.avg_rating || 0" size="1.25rem" />
            </div>
          </div>
        </div>
        <div>
          <p class="text-muted" style="width: max-content">
            {{ date.formatDate(bid?.created_at, "DD/MM/YYYY hh:mmA") }}
          </p>
          <q-badge v-if="accepted" outline class="q-badge-positive q-py-sm q-px-md justify-center">
            Accepted</q-badge>
        </div>
      </div>
      <br />
      <div class="q-gutter-sm">
        <q-badge class="q-badge-primary justify-center" style="width: 120px">
          <span class="text-bold text-body1">&#x20B9;{{
    new BigNumber(bid?.offered_price || 0).toFixed(2)
  }}</span>
          / Qty</q-badge>
        <q-badge class="q-badge-primary justify-center" style="width: 120px">
          <span class="text-bold text-body1">3</span>
          Hrs</q-badge>
      </div>
      <br />
      <div>
        <p class="text-body-1 ellipsis-3-lines">
          {{ bid?.message }}
        </p>
      </div>
    </q-card-section>
    <q-card-action class="row q-px-sm justify-end">
      <q-btn color="primary" @click="emit('review', bid)">Review</q-btn>
    </q-card-action>
    <br />
  </q-card>
</template>
