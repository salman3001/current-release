<script setup lang="ts">
import { date } from "quasar";

const customFetch = useCustomFetch();
const route = useRoute();
const getImageUrl = useGetImageUrl();

const { data: booking, pending } = useAsyncData(
  "booking" + route.params.id,
  async () => {
    const data = await customFetch<IResType<IBooking>>(
      apiRoutes.bookings.view(route.params.id as unknown as number)
    );
    return data.data;
  }
);
</script>

<template>
  <br />
  <br />
  <div v-if="pending">
    <SkeletonBase type="page" />
  </div>
  <div v-else>
    <div class="row q-gutter-md justify-between">
      <div>
        <h1 class="text-h6 text-bold q-sm">Booking ID: {{ booking?.id }}</h1>
        <div>
          <q-badge class="normalcase q-badge-warning q-py-sm  q-px-md" v-if="booking?.status === 'placed'"><q-icon
              name="done"></q-icon>
            &nbsp;{{ booking?.status }}</q-badge>
          <q-badge class="normalcase q-badge-info q-py-sm  q-px-md" v-if="booking?.status === 'confirmed'"><q-icon
              name="done"></q-icon>
            &nbsp;{{ booking?.status }}</q-badge>
          <q-badge class="normalcase q-badge-positive q-py-sm  q-px-md" v-if="booking?.status === 'completed'"><q-icon
              name="done"></q-icon> &nbsp;{{ booking?.status }}</q-badge>
          <q-badge class="normalcase q-badge-negative q-py-sm  q-px-md" v-if="booking?.status === 'cancled'"><q-icon
              name="done"></q-icon> &nbsp;{{ booking?.status }}</q-badge>
        </div>
      </div>
      <div>
        <q-btn-dropdown color="primary" label="Quick Actions">
          <q-list dense style="">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon color="primary" name="download" />
              </q-item-section>

              <q-item-section> Download Invoice</q-item-section>
            </q-item>
            <q-separator inset />
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon color="primary" name="payment" />
              </q-item-section>

              <q-item-section>Make Payment</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </div>
    <br />

    <q-img width="150px" height="150px" class="rounded-borders shadow-12 border" :src="getImageUrl(
    booking?.booking_detail?.service_variant?.image?.url
  )
    " />
    <br />
    <br />
    <q-card class="shadow-12">
      <q-card-section>
        <h6 class="text-subtitle1 text-bold">Order Detail</h6>
        <br />
        <div class="" :class="$q.screen.gt.sm ? 'row' : 'column'">
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Booking date
            </div>
            <div class="q-pl-sm q-py-sm">
              {{ date.formatDate(booking?.created_at, "DD/MM/YYYY hh:mmA") }}
            </div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Service Name
            </div>
            <div class="q-pl-sm q-py-sm">
              {{ booking?.booking_detail.service_variant.name }}
            </div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Service Price
            </div>
            <div class="q-pl-sm q-py-sm">
              &#x20B9;{{ booking?.booking_detail.service_variant.price }}
            </div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Qty
            </div>
            <div class="q-pl-sm q-py-sm">
              {{ booking?.booking_detail.service_variant.qty }}
            </div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              dsocunt
            </div>
            <div class="q-pl-sm q-py-sm">
              {{ booking?.booking_detail.vendor_discount }}
            </div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Coupon Discount
            </div>
            <div class="q-pl-sm q-py-sm">
              {{ booking?.booking_detail.coupon_discount }}
            </div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Grand Total
            </div>
            <div class="q-pl-sm q-py-sm">
              {{ booking?.booking_detail.grand_total }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-section class="text-muted"> </q-card-section>
    </q-card>
    <br />
    <br />
    <q-card class="shadow-12">
      <q-card-section>
        <h6 class="text-subtitle1 text-bold">Payment Detail</h6>
        <br />
        <div class="" :class="$q.screen.gt.sm ? 'row' : 'column'">
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Payment Mode
            </div>
            <div class="q-pl-sm q-py-sm">Card</div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Payment Status
            </div>
            <div class="q-pl-sm q-py-sm">
              <q-badge class="normalcase q-badge-positive q-py-sm q-px-md"><q-icon name="done"></q-icon>
                &nbsp;Paid</q-badge>
            </div>
          </div>
          <div style="flex-wrap: nowrap" :class="$q.screen.gt.sm ? 'col' : 'row justify-between'">
            <div class="q-pl-sm q-py-sm">
              Options
            </div>
            <div class="q-pl-sm q-py-sm">
              <q-badge class="normalcase q-badge-primary q-py-sm q-px-md"><q-icon name="download"></q-icon>
                &nbsp;Download
                Reciept</q-badge>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>
    <br />
    <br />
    <q-card class="shadow-12">
      <q-card-section>
        <h6 class="text-subtitle1 text-bold">Status History</h6>
        <br />
        <div class="">
          <BookingHistory :booking="booking" />
        </div>
      </q-card-section>
      <q-card-section class="text-muted"> </q-card-section>
    </q-card>
    <br />
    <br />
  </div>
</template>
