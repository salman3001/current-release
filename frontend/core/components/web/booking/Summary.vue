<script setup lang="ts">
const bookingStore = useBookingStore();
const modal = modalStore();

const emit = defineEmits<{
  (e: "success"): void;
}>();
</script>

<template>
  <div>
    <q-item>
      <q-item-section top thumbnail class="q-ml-none">
        <img src="https://cdn.quasar.dev/img/mountains.jpg" />
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-bold">{{
          bookingStore.summary?.service_variant.name
        }}</q-item-label>
        <q-item-label caption>{{
          bookingStore.summary?.service_variant?.service.name
        }}</q-item-label>
      </q-item-section>

      <div class="column justify-start items-end">
        <!-- <p class="q-ma-none">Price</p> -->
        <span class="q-ma-none text-muted text-end text-bold"
          >&#x20B9;{{ bookingStore.summary?.service_variant?.price }}</span
        >
        <div class="q-mt-xs q-gutter-xs row items-center">
          Qty : {{ bookingStore.summary?.qty }}
        </div>
      </div>
    </q-item>
  </div>
  <div class="row justify-end text-bold text-h6">
    Total : &#x20B9;{{ bookingStore.summary?.total_without_discount }}
  </div>

  <div class="q-pt-md">
    <div class="row justify-end text-bold text-h6">
      Discount : &#x20B9;{{ bookingStore.summary?.vendor_discount }}
    </div>
    <div class="row justify-end text-bold text-h6">
      Coupon Disount : &#x20B9;{{ bookingStore.summary?.coupon_discount }}
    </div>
    <div class="row justify-end text-bold text-h6">
      Grand Total : &#x20B9;{{ bookingStore.summary?.grand_total }}
    </div>
  </div>
  <div class="row justify-end q-pt-lg text-bold text-h6 q-gutter-sm">
    <q-btn
      color="primary"
      outline
      @click="
        modal.togel('webApplyCoupon', {
          variantId: bookingStore.summary?.service_variant?.id,
          onSuccess: () => {
            bookingStore.getSummary(
              bookingStore.summary?.service_variant?.id,
              bookingStore.summary?.qty
            );
          },
        })
      "
      >Apply Coupon</q-btn
    >
    <q-btn color="primary" @click="emit('success')">Confirm and proceed</q-btn>
  </div>
</template>
