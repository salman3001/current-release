<script setup lang="ts">
import qs from "qs";
import { date } from "quasar";
import { useBidBookingApi } from "~/composables/api/useBidBookingApi";


const { query, mylist } = useBidBookingApi.mylist({ page: 1 })
const {
  data: bookings,
  pending,
  refresh,
} = useAsyncData("bookings", async () => {
  const data = await mylist()
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
    name: "title",
    required: true,
    label: "Title",
    align: "left",
    field: (row: IBidBooking) => row?.booking_detail?.serviceRequirement.title,
  },
  {
    name: "created_at",
    align: "center",
    label: "Order Date",
    field: (row: IBooking) =>
      date.formatDate(row.created_at, "DD/MM/YYYY hh:mmA"),
  },
  { name: "status", label: "Status", field: "status", sortable: true },
  {
    name: "payment",
    label: "Payment",
    field: (row: IBooking) => row?.payment_detail?.paymentStatus,
  },
  { name: "More", label: "More", field: "More", align: "center" },
];
</script>

<template>
  <div class="">
    <ScrollArea width="100%" height="400px">
      <div class="q-py-md" v-if="pending">
        <SkeletonBase type="list" v-for="i in 2" />
      </div>
      <q-table :pagination="{
        rowsPerPage: 100,
      }" bordered v-else :rows="bookings!.data" :columns="columns" row-key="id" hide-pagination color="green"
        class="table-zebra full-hieght shadow-6 q-ma-sm">
        <template v-slot:body-cell-payment="props">
          <q-td :props="props">
            <q-badge class="normalcase q-badge-positive"
              v-if="props.row?.payment_detail?.paymentStatus === 'paid'"><q-icon name="done"></q-icon> &nbsp;{{
        props.row?.payment_detail?.paymentStatus
      }}</q-badge>
            <q-badge class="normalcase q-badge-warning"
              v-if="props.row?.payment_detail?.paymentStatus === 'pending'"><q-icon name="done"></q-icon> &nbsp;{{
        props.row?.payment_detail?.paymentStatus
      }}</q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge class="normalcase q-badge-warning" v-if="props.row.status === 'placed'"><q-icon
                name="done"></q-icon> &nbsp;{{
        props.row.status
      }}</q-badge>
            <q-badge class="normalcase q-badge-info" v-if="props.row.status === 'confirmed'"><q-icon
                name="done"></q-icon> &nbsp;{{
        props.row.status
      }}</q-badge>
            <q-badge class="normalcase q-badge-positive" v-if="props.row.status === 'completed'"><q-icon
                name="done"></q-icon> &nbsp;{{
        props.row.status
      }}</q-badge>
            <q-badge class="normalcase q-badge-negative" v-if="props.row.status === 'cancled'"><q-icon
                name="done"></q-icon> &nbsp;{{
        props.row.status
      }}</q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-More="props">
          <q-td :props="props">
            <NuxtLink :to="routes.view_custom_booking(props.row.id)">
              <q-btn size="sm" color="primary">Review</q-btn>
            </NuxtLink>
          </q-td>
        </template>
      </q-table>
      <PaginateComponet :page="query.page || 1" :meta="bookings?.meta" @update:model-value="(v) => {
          query.page = v;
          refresh();
        }
        " />
    </ScrollArea>
  </div>
</template>
