<script setup lang="ts">
const tab = ref("All");
const modal = modalStore();
</script>

<template>
  <div class="q-gutter-y-xl">
    <br>
    <div class="row justify-end q-gutter-md">
      <NuxtLink :to="routes.service_requirement_post">
        <q-btn color="primary">+ Post A Requirement</q-btn>
      </NuxtLink>
    </div>
    <div class="q-gutter-lg">
      <div class="row justify-between">
        <h5 class="text-h5">Service Requirements posted by you</h5>
      </div>
      <div style="max-width: 95vw">
        <q-tabs dense v-model="tab" active-color="white" indicator-color="secondary" active-bg-color="primary"
          align="left">
          <q-tab name="All" label="All" />
          <q-tab name="Active" label="Active" />
          <q-tab name="Completed" label="Completed" />
          <q-tab name="Expired" label="Expired" />
        </q-tabs>
        <q-separator />

        <q-tab-panels class="q-pa-0 bg-nutral" v-model="tab" animated>
          <q-tab-panel name="All">
            <WebServiceRequirementList />
          </q-tab-panel>

          <q-tab-panel name="Active">
            <WebServiceRequirementList type="active" />
          </q-tab-panel>

          <q-tab-panel name="Completed">
            <WebServiceRequirementList type="completed" />
          </q-tab-panel>

          <q-tab-panel name="Expired">
            <WebServiceRequirementList type="expired" />
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </div>
</template>
