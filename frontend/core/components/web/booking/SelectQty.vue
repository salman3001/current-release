<script setup lang="ts">
import BigNumber from "bignumber.js";

const route = useRoute();
const props = defineProps<{
  variant: IServiceVariant;
}>();

const emit = defineEmits<{
  (e: "proceed"): void;
}>();

const qty = ref(route.query?.qty ? Number(route.query?.qty) : 1);
const couponId = ref(0);
const bookingStore = useBookingStore();

let discount = new BigNumber(0);

if (props.variant.discount_type === DiscountType.FLAT) {
  discount = discount.plus(props.variant.discount_flat);
} else if (props.variant.discount_type === DiscountType.PERCENATAGE) {
  discount = new BigNumber(props.variant.discount_percentage)
    .div(100)
    .times(props.variant.price);
}

const incrementQty = () => {
  qty.value += 1;
};

const decrementQty = () => {
  if (qty.value > 1) {
    qty.value -= 1;
  }
};

const getSummary = async () => {
  bookingStore.getSummary(props.variant.id, qty.value, () => {
    emit("proceed");
  });
};
</script>

<template>
  <div>
    <q-item :class="$q.screen.lt.sm ? 'column items-start q-gutter-sm' : 'row'">
      <q-item-section top thumbnail class="q-ml-none">
        <img
          :src="
            variant?.image?.url || '/images/service-category-placeholder.jpg'
          "
        />
      </q-item-section>

      <q-item-section>
        <div
          v-if="discount.gt(0) && variant.discount_type === DiscountType.FLAT"
        >
          <q-badge color="negative"
            >&#x20B9;{{ variant.discount_flat }} off</q-badge
          >
        </div>
        <div
          v-if="
            discount.gt(0) && variant.discount_type === DiscountType.PERCENATAGE
          "
        >
          <q-badge color="negative"
            >{{ new BigNumber(variant.discount_percentage).toFixed() }}%
            off</q-badge
          >
        </div>
        <q-item-label>{{ variant?.name }}</q-item-label>
        <q-item-label caption>{{ variant?.service.name }}</q-item-label>
        <div class="q-mt-xs q-gutter-xs row items-center">
          <q-btn
            size="xs"
            outline
            icon="remove"
            round
            color="primary"
            @click="decrementQty"
          ></q-btn>
          <span>{{ qty }}</span>
          <q-btn
            size="xs"
            outline
            icon="add"
            round
            color="primary"
            @click="incrementQty"
          ></q-btn>
        </div>
      </q-item-section>

      <div
        class="column justify-start"
        :class="$q.screen.lt.sm ? 'items-start' : 'items-end'"
      >
        <div class="q-mt-xs row">
          <q-btn
            size="xs"
            outline
            icon="bookmarks"
            round
            color="primary"
          ></q-btn>
        </div>
        <br />
        <span class="q-ma-none text-muted text-end text-bold"
          >&#x20B9;{{ variant?.price }}</span
        >
      </div>
    </q-item>
  </div>
  <q-separator />
  <div class="row justify-end q-pt-lg text-bold text-h6">
    Discount: &#x20B9;{{ discount.toFixed() }}
  </div>
  <div class="row justify-end text-bold text-h6">
    Total: &#x20B9;{{
      new BigNumber(variant.price).minus(discount).times(qty).toFixed()
    }}
  </div>
  <div class="row justify-end text-bold text-h6">
    <q-btn
      color="primary"
      @click="getSummary"
      :disabled="bookingStore.loadingSummary"
    >
      <LoadingIndicator v-if="bookingStore.loadingSummary" /> Proceed to
      checkout
    </q-btn>
  </div>
</template>
