<script setup lang="ts">
import { ref } from "vue";

const requirementId = useRoute().params.requirementId;
const customFetch = useCustomFetch();
const step = ref(1);
const paymentOptions = ref("Net Banking");
const customBookingStore = useCustomBookingStore();

const { data } = await useAsyncData(async () => {
  const [requirement, acceptedBid] = await Promise.all([
    customFetch<IResType<IServiceRequirement>>(
      apiRoutes.service_requirements_view(requirementId as unknown as number),
      {
        query: {
          preload: [
            {
              serviceCategory: {
                select: ["name"],
              },
            },
          ],
        } as AdditionalParams,
      }
    ),
    customFetch<IResType<IBid>>(
      apiRoutes.service_requirement_show_accepted_bid(
        requirementId as unknown as number
      ),
      {
        query: {
          select: ["id", "offered_price"],
        } as AdditionalParams,
      }
    ),
  ]);

  return { requirement: requirement.data, acceptedBid: acceptedBid.data };
});
</script>

<template>
  <div>
    <q-stepper
      v-model="step"
      vertical
      color="primary"
      flat
      animated
      class="q-px-none"
    >
      <q-step
        :name="1"
        title="Book Service"
        icon="shopping_cart"
        done-icon="shopping_cart"
        :done="step > 1"
      >
        <h6 class="q-ma-none q-mb-md text-bold">Select Quantity</h6>

        <WebCustomBookingSelectQty
          :requirement="data?.requirement!"
          :accepted-bid="data?.acceptedBid!"
          @proceed="step = 2"
        />
      </q-step>
      <q-step :name="2" title="Address" icon="address" :done="step > 2">
        <h6>Select Your address</h6>

        <div class="row q-gutter-md">
          <q-btn color="primary" @click="step = 3">Proceed to Payment</q-btn>
        </div>
      </q-step>

      <q-step
        :name="3"
        title="Payment
      "
        icon="payments"
        :done="step > 3"
      >
        <div class="">
          <div class="q-gutter-y-md">
            <q-option-group
              v-model="paymentOptions"
              inline
              :options="[
                { label: 'Net Banking', value: 'Net Banking' },
                { label: 'Credit Card', value: 'Credit Card' },
                { label: 'UPI', value: 'UPI' },
                { label: 'Cash on delivery', value: 'Cash on delivery' },
              ]"
            />

            <q-tab-panels
              v-model="paymentOptions"
              animated
              class="srounded-borders"
            >
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
              <q-btn
                color="primary"
                @click="
                  customBookingStore.create_custom_booking(
                    {
                      paymentdetail: {
                        paymentMode: 'cod',
                        paymentStatus: 'paid',
                      },
                      qty: customBookingStore.qty!,
                      serviceRequirementId: requirementId as unknown as number,
                    },
                    () => {
                      step = 4;
                    }
                  )
                "
              >
                <LoadingIndicator v-if="customBookingStore.creatingBooking" />
                Pay & Book
              </q-btn>
            </div>
          </div>
        </div>
      </q-step>

      <q-step
        :name="4"
        title="Order Placed"
        icon="check_circle"
        :done="step > 4"
      >
        <h6>
          <q-icon name="done" color="primary" size="50px"></q-icon> Thank you!
          Your order has been placed
        </h6>

        <div class="row q-gutter-md">
          <NuxtLink :to="routes.home">
            <q-btn color="primary">Go Home</q-btn>
          </NuxtLink>
          <NuxtLink :to="routes.account + '?tab=Custom Bookings'">
            <q-btn color="primary">My Orders</q-btn>
          </NuxtLink>
        </div>
      </q-step>
    </q-stepper>
  </div>
</template>
