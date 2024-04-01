<script setup lang="ts">
const modal = modalStore();
const form = reactive({
  sortBy: modal.meta?.sortBy || "created_at:desc",
});
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar color="primary">
      <q-toolbar-title><span class="text-weight-bold">Filter Services</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column q-pa-lg">
      <div>
        <h6>Sorty By</h6>
        <div class="q-gutter-sm">
          <q-radio v-model="form.sortBy" val="created_at:desc" label="Latest" />
          <q-radio v-model="form.sortBy" val="avg_rating:desc" label="Highest Rating" />
          <q-radio v-model="form.sortBy" val="starting_from" label="Lowest Price" />
        </div>
      </div>
      <div class="row justify-end">
        <q-btn label="Apply" color="primary" @click="modal.meta?.atApply && modal.meta?.atApply(form)" />
      </div>
    </q-card-section>
  </q-card>
</template>
