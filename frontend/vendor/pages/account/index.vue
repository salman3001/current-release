<script setup lang="ts">
import { ref } from "vue";

const query = useRoute().query;
</script>

<template>
  <br />
  <NavTabs :links="[{
    label: 'Account',
    url: routes.vendor.account
  }, {
    label: 'Settings',
    url: routes.vendor.settings
  }, {
    label: 'Security',
    url: routes.vendor.security
  }]">
    <br />

    <div class="column gap-50">
      <h6 class="text-bold q-pb-none">Account Information</h6>
      <VendorAccountEdit />
    </div>
    <q-separator />
    <div class="column gap-50">
      <h6 class="text-bold q-pb-none">Profile Information</h6>
      <VendorProfileEdit />
    </div>
  </NavTabs>
</template>
