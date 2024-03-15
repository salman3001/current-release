<script setup lang="ts">
const modal = modalStore();

</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar color="primary">
      <q-toolbar-title><span class="text-weight-bold">{{
        modal.meta.title
      }}</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column items-center text-center q-px-md-sm">
      <q-icon :name="modal.meta?.iconName || 'block'" color="secondary" class="col-4" size="5rem" />
      <p>{{ modal.meta.message }}</p>
    </q-card-section>
    <q-card-section class="row justify-end">
      <div class="q-gutter-sm">
        <q-btn color="secondary" @click="() => { modal.show = !modal.show; modal.meta?.onReject() }">Cancle</q-btn>
        <q-btn color="primary" @click="() => { modal.show = !modal.show; modal.meta?.onAccept() }">Continue</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
