<script setup lang="ts">
import { ref } from "vue";

const query = useRoute().query;

const tab = ref("Profile");

watch(
  query,
  (newVal) => {
    if (query.tab) {
      tab.value = query.tab as string;
    }
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div class="q-pa-md q-pa-md-lg q-pa-lg-xl" style="max-width: 98vw">
    <q-tabs
      dense
      v-model="tab"
      active-color="white"
      indicator-color="secondary"
      active-bg-color="primary"
      align="start"
    >
      <q-tab name="Profile" label="Profile" />
      <q-tab name="Bookings" label="Bookings" />
      <q-tab name="Custom Bookings" label="Custom Bookings" />
      <q-tab name="Settings" label="Settings" />
      <q-tab name="Security" label="Security" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="bg-nutral">
      <q-tab-panel name="Profile">
        <WebProfileEdit />
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
