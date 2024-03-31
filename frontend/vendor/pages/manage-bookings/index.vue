<script setup lang="ts">
import { ref } from "vue";

const query = useRoute().query;

const tab = ref(query?.tab || "Bookings");
</script>

<template>
  <br />
  <div>
    <q-tabs
      dense
      v-model="tab"
      active-color="white"
      indicator-color="secondary"
      active-bg-color="secondary"
      align="left"
    >
      <q-tab name="Bookings" label="Bookings" />
      <q-tab name="Custom Bookings" label="Custom Bookings" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="bg-nutral">
      <q-tab-panel name="Bookings" class="q-gutter-y-md">
        <div class="column gap-50">
          <h6 class="text-bold q-pb-none">Bookings</h6>
          <VendorBookingList />
        </div>
      </q-tab-panel>

      <q-tab-panel name="Custom Bookings">
        <div class="text-h6">Custom Bookings</div>
        <br />
        <VendorCustomBookingList />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
