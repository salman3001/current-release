<script setup lang="ts">
import { ref } from "vue";

const query = useRoute().query;

const tab = ref(query?.tab || "Profile");
</script>

<template>
  <br />
  <div>
    <q-tabs dense v-model="tab" active-color="white" indicator-color="secondary" active-bg-color="secondary"
      align="left">
      <q-tab name="Profile" label="Profile" />
      <q-tab name="Settings" label="Settings" />
      <q-tab name="Security" label="Security" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated class="bg-nutral">
      <q-tab-panel name="Profile" class="q-gutter-y-md">
        <div class="column gap-50">
          <h6 class="text-bold q-pb-none">Account Information</h6>
          <VendorAccountEdit />
        </div>
        <q-separator />
        <div class="column gap-50">
          <h6 class="text-bold q-pb-none">Profile Information</h6>
          <VendorProfileEdit />
        </div>
      </q-tab-panel>

      <q-tab-panel name="Settings"> Settings </q-tab-panel>

      <q-tab-panel name="Security">
        <VendorSecurityEdit />
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>
