<script setup lang="ts">
import { ref } from "vue";

const tab = ref("Booking Detail");
</script>

<template>
  <div class="q-pa-md q-pa-md-lg q-pa-lg-xl">
    <NuxtLink :to="routes.account + '?tab=Bookings'">
      <q-icon name="keyboard_backspace" size="30px"></q-icon> Go Back
    </NuxtLink>
    <br />
    <br />

    <h1 class="text-h6 text-bold q-sm">Booking #1234</h1>
    <div class="q-col-gutter-y-md">
      <div>
        <p class="text-bold">Address</p>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div>
        <p class="text-bold">Date and time</p>
        <p>12/03/2024 03:13pm</p>
      </div>
      <div class="row q-gutter-md">
        <p class="text-bold">Booking Status</p>
        <q-badge color="yellow-10">Placed</q-badge>
      </div>
      <div class="row q-gutter-sm">
        <NuxtLink to="/">
          <q-icon name="download"></q-icon> Download Invoice</NuxtLink
        >
      </div>
      <div class="q-mt-md">
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          active-color="primary"
          indicator-color="primary"
          align=""
          narrow-indicator
        >
          <q-tab
            name="Booking Detail"
            label="Booking Detail"
            class="q-pl-none"
          />
          <q-tab name="Payment Detail" label="Payment Detail" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="Booking Detail">
            <div>
              <div>
                <q-item>
                  <q-item-section top thumbnail class="q-ml-none">
                    <img src="https://cdn.quasar.dev/img/mountains.jpg" />
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-bold"
                      >Single line item</q-item-label
                    >
                    <q-item-label caption
                      >sit amet, consectetur adipiscit elit.</q-item-label
                    >
                  </q-item-section>

                  <div class="column justify-start items-end">
                    <!-- <p class="q-ma-none">Price</p> -->
                    <span class="q-ma-none text-muted text-end text-bold"
                      >&#x20B9;200.00</span
                    >
                    <div class="q-mt-xs q-gutter-xs row items-center">
                      Qty : 2
                    </div>
                  </div>
                </q-item>
              </div>
              <q-separator></q-separator>
              <div class="row justify-end text-bold text-h6">
                Total : &#x20B9;800
              </div>
            </div>

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
          </q-tab-panel>

          <q-tab-panel name="Payment Detail">
            <div class="text-h6">Payment Detail</div>
            pay
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
