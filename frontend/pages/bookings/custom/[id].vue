<script setup lang="ts">
import { ref } from "vue";
import { date } from "quasar";

const tab = ref("Booking Detail");
const customFetch = useCustomFetch();
const route = useRoute();

const { data: booking, pending } = useAsyncData(
  "booking" + route.params.id,
  async () => {
    const data = await customFetch<IResType<IBidBooking>>(
      apiRoutes.bid_booking_show(route.params.id as unknown as number)
    );
    return data.data;
  }
);
</script>

<template>
  <div class="q-pa-md q-pa-md-lg q-pa-lg-xl">
    <NuxtLink :to="routes.account + '?tab=Custom Bookings'">
      <q-icon name="keyboard_backspace" size="30px"></q-icon> Go Back
    </NuxtLink>
    <br />
    <br />
    <div v-if="pending">
      <SkeletonBase type="page" />
    </div>
    <div v-else>
      <h1 class="text-h6 text-bold q-sm">Booking #{{ booking?.id }}</h1>
      <div class="q-col-gutter-y-md">
        <div>
          <p class="text-bold">Date and time</p>
          <p>{{ date.formatDate(booking?.created_at, "DD/MM/YYYY hh:mmA") }}</p>
        </div>
        <div class="row q-gutter-md">
          <p class="text-bold">Booking Status</p>
          <q-badge
            color="yellow-10"
            class="normalcase"
            v-if="booking?.status === OrderStatus.PLACED"
            >{{ booking?.status }}</q-badge
          >
          <q-badge
            color="red"
            class="normalcase"
            v-if="booking?.status === OrderStatus.REJECTED"
            >{{ booking?.status }}</q-badge
          >
          <q-badge
            color="info"
            class="normalcase"
            v-if="booking?.status === OrderStatus.CONFIRMED"
            >{{ booking?.status }}</q-badge
          >
          <q-badge
            color="green"
            class="normalcase"
            v-if="booking?.status === OrderStatus.DELIVERED"
            >{{ booking?.status }}</q-badge
          >
        </div>
        <div class="row q-gutter-sm">
          <NuxtLink to="/">
            <q-icon name="download"></q-icon> Download Invoice</NuxtLink
          >
        </div>
        <div class="q-mt-md">
          <q-tabs
            dense
            v-model="tab"
            active-color="white"
            indicator-color="secondary"
            active-bg-color="primary"
            align="left"
          >
            <q-tab name="Booking Detail" label="Booking Detail" />
            <q-tab name="Payment Detail" label="Payment Detail" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="Booking Detail">
              <div>
                <div>
                  <q-item>
                    <q-item-section>
                      <q-item-label class="text-bold">{{
                        booking?.booking_detail.serviceRequirement.title
                      }}</q-item-label>
                      <q-item-label caption>{{
                        booking?.booking_detail.serviceRequirement.desc
                      }}</q-item-label>
                    </q-item-section>

                    <div class="column justify-start items-end">
                      <!-- <p class="q-ma-none">Price</p> -->
                      <span class="q-ma-none text-muted text-end text-bold"
                        >&#x20B9;{{
                          booking?.booking_detail.acceptedBid.offeredPrice
                        }}</span
                      >
                      <div class="q-mt-xs q-gutter-xs row items-center">
                        Qty :{{ booking?.qty }}
                      </div>
                    </div>
                  </q-item>
                </div>
                <q-separator></q-separator>
              </div>

              <div class="q-pt-md">
                <div class="row justify-end text-bold text-h6">
                  Grand Total : &#x20B9;{{ booking?.price }}
                </div>
              </div>
            </q-tab-panel>

            <q-tab-panel name="Payment Detail">
              <div class="text-h6">Payment Detail</div>
              payment detail here
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </div>
    </div>
  </div>
</template>
