<script setup lang="ts">
import { ref } from "vue";
import qs from 'qs'

const variantId = useRoute().params.variantId
const customFetch = useCustomFetch()
const step = ref(1);
const paymentOptions = ref("Net Banking");
const qty = ref(1)
const loadingSummary = ref(false)
const couponId = ref<number | null>(null)



const incrementQty = () => {
  qty.value += 1
}

const decrementQty = () => {
  if (qty.value > 1) {
    qty.value -= 1
  }
}

const variantQuery = {
  populate: {
    service: {
      fields: ['name']
    }
  }
} as AdditionalParams

const { data: variant } = await useAsyncData('variant' + variantId, async () => {
  const data = await customFetch<IResType<IServiceVariant>>(apiRoutes.view_service_variant(variantId as string, qs.stringify(variantQuery)))

  return data.data
})

const getSummary = async () => {
  loadingSummary.value = true
  try {
    const data = await customFetch<IResType<any>>(apiRoutes.booking_summary, {
      method: 'post',
      body: {
        serviceVariantId: variant.value?.id,
        qty: qty.value,
        couponId: couponId.value
      }
    })

    if (data.success == true) {
      step.value = 2
    }
  } catch (error) {
    console.log(error);

  }
  loadingSummary.value = false

}

</script>

<template>
  <div>
    <q-stepper v-model="step" vertical color="primary" flat animated class="q-px-none">
      <q-step :name="1" title="Book Service" icon="shopping_cart" done-icon="shopping_cart" :done="step > 1">
        <h6 class="q-ma-none q-mb-md text-bold">Select Quantity</h6>

        <div>
          <q-item>
            <q-item-section top thumbnail class="q-ml-none">
              <img :src="variant?.image?.url || '/images/service-category-placeholder.jpg'" />
            </q-item-section>

            <q-item-section>
              <q-item-label>{{ variant?.name }}</q-item-label>
              <q-item-label caption>{{ variant?.service.name }}</q-item-label>
              <div class="q-mt-xs q-gutter-xs row items-center">
                <q-btn size="xs" outline icon="remove" round color="primary" @click="decrementQty"></q-btn>
                <span>{{ qty }}</span>
                <q-btn size="xs" outline icon="add" round color="primary" @click="incrementQty"></q-btn>
              </div>
            </q-item-section>

            <div class="column justify-start items-end">
              <!-- <p class="q-ma-none">Price</p> -->
              <span class="q-ma-none text-muted text-end text-bold">&#x20B9;{{ variant?.price }}</span>
              <div class="q-mt-xs q-gutter-xs row items-center">
                <q-btn size="xs" outline icon="bookmarks" round color="primary"></q-btn>
                <q-btn size="xs" outline icon="delete" round color="primary"></q-btn>
              </div>
            </div>
          </q-item>
        </div>
        <div class="row justify-end q-pt-lg text-bold text-h6">
          Total: &#x20B9;{{ qty * Number(variant?.price) }}
        </div>
        <div class="row justify-end q-pt-lg text-bold text-h6">
          <q-btn color="primary" @click="getSummary" :disabled="loadingSummary">
            <LoadingIndicator v-if="loadingSummary" /> Proceed to checkout
          </q-btn>
        </div>
      </q-step>
      <q-step :name="2" title="Summary" icon="summarize" done-icon="summarize" :done="step > 2">
        <h6 class="q-ma-none q-mb-md text-bold">Order Summary</h6>

        <div>
          <q-item>
            <q-item-section top thumbnail class="q-ml-none">
              <img src="https://cdn.quasar.dev/img/mountains.jpg" />
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-bold">Single line item</q-item-label>
              <q-item-label caption>sit amet, consectetur adipiscit elit.</q-item-label>
            </q-item-section>

            <div class="column justify-start items-end">
              <!-- <p class="q-ma-none">Price</p> -->
              <span class="q-ma-none text-muted text-end text-bold">&#x20B9;200.00</span>
              <div class="q-mt-xs q-gutter-xs row items-center">Qty : 2</div>
            </div>
          </q-item>
        </div>
        <div class="row justify-end text-bold text-h6">Total : &#x20B9;800</div>

        <div class="q-pt-md">
          <div class="row justify-end text-bold text-h6">
            Disount: &#x20B9;0
          </div>
          <div class="row justify-end text-bold text-h6">
            Coupon Disount : &#x20B9;20
          </div>
          <div class="row justify-end text-bold text-h6">
            Grand Total : &#x20B9;780
          </div>
        </div>

        <div class="row justify-end q-pt-lg text-bold text-h6 q-gutter-sm">
          <q-btn color="primary" outline>Apply Coupon</q-btn>
          <q-btn color="primary" @click="step = 3">Confirm and proceed</q-btn>
        </div>
      </q-step>
      <q-step :name="3" title="Address" icon="address" :done="step > 3">
        <h6>Select Your address</h6>

        <div class="row q-gutter-md">
          <q-btn color="primary" @click="step = 4">Proceed to Payment</q-btn>
        </div>
      </q-step>

      <q-step :name="4" title="Payment
      " icon="payments" :done="step > 4">
        <div class="">
          <div class="q-gutter-y-md">
            <q-option-group v-model="paymentOptions" inline :options="[
      { label: 'Net Banking', value: 'Net Banking' },
      { label: 'Credit Card', value: 'Credit Card' },
      { label: 'UPI', value: 'UPI' },
      { label: 'Cash on delivery', value: 'Cash on delivery' },
    ]" />

            <q-tab-panels v-model="paymentOptions" animated class="srounded-borders">
              <q-tab-panel name="Net Banking">
                <div class="text-h6">Net Banking</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>

              <q-tab-panel name="Credit Card">
                <div class="text-h6">Credit Card</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>

              <q-tab-panel name="UPI">
                <div class="text-h6">UPI</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>

              <q-tab-panel name="Cash on delivery">
                <div class="text-h6">Cash on delivery</div>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </q-tab-panel>
            </q-tab-panels>
            <div class="row justify-end q-pt-lg text-bold text-h6 q-gutter-sm">
              <q-btn color="primary" @click="step = 5">Complete Payment</q-btn>
            </div>
          </div>
        </div>
      </q-step>

      <q-step :name="5" title="Order Placed" icon="check_circle" :done="step > 5">
        <h6>
          <q-icon name="done" color="primary" size="50px"></q-icon> Thank you!
          Your order has been placed
        </h6>

        <div class="row q-gutter-md">
          <NuxtLink :to="routes.home">
            <q-btn color="primary">Go Home</q-btn>
          </NuxtLink>
          <NuxtLink :to="routes.account + '?tab=Bookings'">
            <q-btn color="primary">My Orders</q-btn>
          </NuxtLink>
        </div>
      </q-step>
    </q-stepper>
  </div>
</template>
