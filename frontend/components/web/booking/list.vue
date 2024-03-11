<script setup lang="ts">
import qs from "qs";
import { date } from "quasar";

const customFetch = useCustomFetch();
const page = ref(1);

const {
  data: bookings,
  pending,
  refresh,
} = useAsyncData("bookings", async () => {
  const data = await customFetch<IPageRes<IBooking>>(
    apiRoutes.booking_list_customer,
    {
      query: {
        page: page.value,
      } as AdditionalParams,
    }
  );
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
    name: "created_at",
    align: "center",
    label: "Order Date",
    field: (row: IBooking) =>
      date.formatDate(row.created_at, "DD/MM/YYYY hh:mmA"),
  },
  { name: "status", label: "Status", field: "status", sortable: true },
  { name: "More", label: "More", field: "More", align: "center" },
];
</script>

<template>
  <div class="">
    <ScrollArea width="100%" height="400px">
      <div class="q-py-md" v-if="pending">
        <SkeletonBase type="list" v-for="i in 2" />
      </div>
      <q-table
        flat
        v-else
        :rows="bookings!.data"
        :columns="columns"
        row-key="id"
        hide-pagination
        color="green"
        class="full-hieght"
      >
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge color="warning" outline class="normalcase">{{
              props.row.status
            }}</q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-More="props">
          <q-td :props="props">
            <NuxtLink :to="routes.view_booking(props.row.id)">
              <q-btn size="sm" color="primary">View Detail</q-btn>
            </NuxtLink>
          </q-td>
        </template>
      </q-table>
      <PaginateComponet
        :page="page"
        :meta="bookings?.meta"
        @update:model-value="
          (v) => {
            page = v;
            refresh();
          }
        "
      />
    </ScrollArea>
  </div>
</template>
