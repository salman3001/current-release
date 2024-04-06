<script setup lang="ts">
import { date } from "quasar";
import { useBookingApi } from "~/composables";

const selectedBooking = ref<IBooking | null>(null)
const statusModal = ref(false)

const { query, vendorBookings } = useBookingApi.vendorBookings({
  page: 1
})

const {
  data: bookings,
  pending,
  refresh,
} = useAsyncData("bookings", async () => {
  const data = await vendorBookings()
  return data.data;
});

const columns = [
  {
    name: "id",
    required: true,
    label: "Booking No.",
    align: "left",
    field: (row: IBooking) => row.id,
  },
  {
    name: "service_name",
    required: true,
    label: "Service Name",
    align: "left",
    field: (row: IBooking) => row?.booking_detail?.service_variant.service_name,
  },
  {
    name: "created_at",
    align: "center",
    label: "Order Date",
    field: (row: IBooking) =>
      date.formatDate(row.created_at, "DD/MM/YYYY hh:mmA"),
  },
  { name: "status", label: "Status", field: "status" },
  {
    name: "payment",
    label: "Payment",
    field: (row: IBooking) => row?.payment_detail?.paymentStatus,
  },
  { name: "More", label: "More", field: "More", align: "center" },
];
</script>

<template>
  <div>
    <ScrollArea width="100vw" height="400px">
      <div class="" v-if="pending">
        <SkeletonBase type="list" v-for="i in 2" />
      </div>
      <q-table bordered v-else :rows="bookings!.data" :columns="columns" row-key="id" hide-pagination
        class="table-zebra full-hieght shadow-6 q-ma-sm">
        <template v-slot:body-cell-payment="props">
          <q-td :props="props">
            <q-badge class="normalcase q-pa-sm q-badge-positive"
              v-if="props.row?.payment_detail?.paymentStatus === 'paid'">&nbsp;{{
        props.row?.payment_detail?.paymentStatus
      }}</q-badge>
            <q-badge class="normalcase q-pa-sm q-badge-warning"
              v-if="props.row?.payment_detail?.paymentStatus === 'pending'">&nbsp;{{
        props.row?.payment_detail?.paymentStatus
      }}</q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">

          <q-td :props="props">
            <div class="cursor-pointer" @click="() => {
        selectedBooking = props.row
        statusModal = true
      }">
              <q-badge class="normalcase q-pa-sm q-badge-warning" v-if="props.row.status === 'placed'">
                &nbsp;{{
        props.row.status
      }}</q-badge>
              <q-badge class="normalcase q-pa-sm q-badge-info" v-if="props.row.status === 'confirmed'">
                &nbsp;{{
        props.row.status
      }}</q-badge>
              <q-badge class="normalcase q-pa-sm q-badge-positive" v-if="props.row.status === 'delivered'">
                &nbsp;{{
        props.row.status
      }}</q-badge>
              <q-badge class="normalcase q-pa-sm q-badge-negative" v-if="props.row.status === 'rejected'">
                &nbsp;{{
        props.row.status
      }}</q-badge>

            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-More="props">
          <q-td :props="props">
            <NuxtLink :to="routes.vendor.bookings.view(props.row.id)">
              <q-btn size="sm" color="primary">Review</q-btn>
            </NuxtLink>
          </q-td>
        </template>
      </q-table>
      <PaginateComponet :page="query.page as number" :meta="bookings?.meta" @update:model-value="(v) => {
        query.page = v;
        refresh();
      }
        " />
    </ScrollArea>
  </div>
  <Modal2VendorBookingStatus v-model="statusModal" title="Update Booking Status" :bookingtype="'normal'"
    :selected-booking="selectedBooking!" @success="()=>{
    refresh()
    statusModal=false
  }" />
</template>
