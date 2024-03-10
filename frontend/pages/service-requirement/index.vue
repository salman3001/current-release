<script setup lang="ts">
const tab = ref("All");
const modal = modalStore()
</script>

<template>
  <div class="q-pa-sm q-pa-sm-md q-pa-lg-xl q-gutter-y-xl">
    <div class="q-gutter-y-md">
      <div class="row justify-between q-gutter-md">
        <h1 class="text-h5">Cutsom Service Requirement</h1>
        <q-btn color="primary" @click="modal.togel('webPostRequirement', {
          onSuccess: () => {
            tab = tab === 'All' ? 'Active' : 'All'
          }
        })">+ Post A Requirement</q-btn>
      </div>
      <p class="text-muted text-subtitle1" style="max-width: 500px">
        Post service requirments accroding to your needs and recieve proposals
        from service providers. Please follow the
        <NuxtLink :to="routes.home" class="underline text-secondary">guidelines</NuxtLink>
        when posting a new service requirement.
      </p>
    </div>
    <q-separator> </q-separator>
    <div class="q-gutter-lg">
      <div class="row justify-between">
        <h5 class="text-h5">Service Requirements posted by you</h5>
      </div>
      <div style="max-width: 95vw">
        <q-tabs dense v-model="tab" active-color="white" indicator-color="secondary" active-bg-color="primary"
          align="start">
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
