<script setup lang="ts">
import { ref } from "vue";

const query = useRoute().query;

const tab = ref(query?.tab || "Profile");
</script>

<template>
  <div class="q-pa-md q-pa-md-lg q-pa-lg-xl" style="max-width: 98vw">
    <q-tabs
      dense
      v-model="tab"
      active-color="white"
      indicator-color="secondary"
      active-bg-color="primary"
      align="left"
    >
      <q-tab name="Profile" label="Profile" />
      <q-tab name="Bookings" label="Bookings" />
      <q-tab name="Custom Bookings" label="Custom Bookings" />
      <q-tab name="Settings" label="Settings" />
      <q-tab name="Security" label="Security" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="bg-nutral">
      <q-tab-panel name="Profile" class="q-gutter-y-md">
        <div class="column gap-50">
          <h6 class="text-bold q-pb-none">Account Information</h6>
          <WebAccountEdit />
        </div>
        <q-separator />
        <div class="column gap-50">
          <h6 class="text-bold q-pb-none">Profile Information</h6>
          <WebProfileEdit />
        </div>
      </q-tab-panel>

      <q-tab-panel name="Bookings">
        <div class="text-h6">Bookings</div>
        <WebBookingList />
      </q-tab-panel>

      <q-tab-panel name="Custom Bookings">
        <div class="text-h6">Custom Bookings</div>
        <WebCustomBookingList />
      </q-tab-panel>

      <q-tab-panel name="Settings"> setting </q-tab-panel>

      <q-tab-panel name="Security">
        <WebSecurityEdit />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
