<script setup lang="ts">
import BigNumber from "bignumber.js";

defineProps<{
  requirement: IServiceRequirement;
  acceptedBid: IBid;
}>();

const emit = defineEmits<{
  (e: "proceed"): void;
}>();

const customBookingStore = useCustomBookingStore();
</script>

<template>
  <div>
    <q-item :class="$q.screen.lt.sm ? 'column items-start q-gutter-sm' : 'row'">
      <q-item-section>
        <q-item-label>{{ requirement?.title }}</q-item-label>
        <q-item-label caption>{{
      requirement?.serviceCategory.name
    }}</q-item-label>
        <div class="q-mt-xs q-gutter-xs row items-center">
          <q-btn size="xs" outline icon="remove" round color="primary" @click="customBookingStore.decrementQty"></q-btn>
          <span>{{ customBookingStore.qty }}</span>
          <q-btn size="xs" outline icon="add" round color="primary" @click="customBookingStore.incrementQty"></q-btn>
        </div>
      </q-item-section>

      <div class="column justify-start" :class="$q.screen.lt.sm ? 'items-start' : 'items-end'">
        <div class="q-mt-xs row">
          <q-btn size="xs" outline icon="bookmarks" round color="primary"></q-btn>
        </div>
        <br />
        <span class="q-ma-none text-muted text-end text-bold">&#x20B9;{{ acceptedBid.offered_price }}</span>
      </div>
    </q-item>
  </div>
  <q-separator />
  <div class="row justify-end text-bold text-h6">
    Total: &#x20B9;{{
      new BigNumber(acceptedBid.offered_price)
        .times(customBookingStore.qty)
        .toFixed(2)
    }}
  </div>
  <div class="row justify-end text-bold text-h6">
    <q-btn color="primary" @click="emit('proceed')">
      Proceed to checkout
    </q-btn>
  </div>
</template>
