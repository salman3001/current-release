<script setup lang="ts">
import BigNumber from 'bignumber.js';

const customFetch = useCustomFetch();
const bookingStore = useBookingStore()
const selectedCouponId = ref(bookingStore.couponId)

const modal = modalStore();

const { data, pending } = useAsyncData(
  async () => {
    const data = await customFetch<IResType<ICoupon[]>>(
      apiRoutes.bookings.get_coupons(Number(modal.meta?.variantId))
    );
    return data.data
  },
  { server: false, lazy: true }
);
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar color="primary">
      <q-toolbar-title><span class="text-weight-bold">Apply Coupon</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column q-px-md-sm">

      <div v-if="pending">
        <SkeletonBase type="list" v-for="i in 5" />
      </div>
      <div v-else>
        <div v-if="data?.length < 1">
          No Coupons available
        </div>
        <div class="row justify-center q-gutter-sm text-center normalcase">
          <p class="col-12 text-subtitle1">
            Please Select A Coupon
          </p>
          <div v-for="c, i in data" :key="i" class="border q-pa-md bg-yellow-2 rounded-borders border-2 cursor-pointer"
            @click="selectedCouponId = c.id" :class="selectedCouponId == c.id ? 'border-primary' : ''">
            <p>{{ c.name }}</p>
            <p v-if="c.discount_type == 'percentage'" class="text-h6">{{ new
        BigNumber(c.discount_percentage).toFixed()
              }}% off</p>
            <p v-if="c.discount_type == 'flat'" class="text-h6">&#8377;{{ c.discount_flat }} flat off</p>
          </div>

        </div>
      </div>
      <div>
        <div class="row q-gutter-sm justify-end q-pt-lg">
          <q-btn color="secondary" style="min-width: 6rem" @click="modal.show = !modal.show"
            :disabled="pending">Cancle</q-btn>
          <q-btn color="primary" v-if="pending" disabled>
            <LoadingIndicator /> Processing
          </q-btn>
          <q-btn color="primary" type="submit" :disabled="pending || selectedCouponId == 0" v-else
            style="min-width: 6rem" @click="() => {
        bookingStore.couponId = selectedCouponId
        modal.meta?.onSuccess()
        modal.show = false
      }">Apply</q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>
