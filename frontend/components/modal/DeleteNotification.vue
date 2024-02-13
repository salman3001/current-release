<script setup lang="ts">
import { ref } from 'vue';

const modal = modalStore();
const notifications = notificationStore()
const loading = ref(false);

const handeler = async () => {
  loading.value = true;
  if (modal?.meta?.type == 'all') {
    await notifications.deleteNotifcations('all')
  }

  if (modal?.meta?.type == 'read') {
    await notifications.deleteNotifcations('read')
  }

  if (modal?.meta?.type == 'one') {
    await notifications.deleteOneNotifcation(modal?.meta?.id)
  }

  loading.value = false;
  modal.meta.tableRef && modal.meta.tableRef.setPagination({}, true);
  modal.show = !modal.show;
};
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar style="background-color: #ebeae4">
      <q-toolbar-title><span class="text-weight-bold">{{
        modal.meta.title
      }}</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column items-center text-center q-px-md-sm">
      <q-icon name="block" class="col-4" size="5rem" />
      <p>Are you sure, You want to delete this Notification?</p>
    </q-card-section>
    <q-card-section class="row justify-end">
      <div class="q-gutter-sm">
        <q-btn flat style="background-color: #f2f0dc" @click="modal.show = !modal.show">Cancle</q-btn>
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" />
        </q-btn>
        <q-btn color="primary" @click="handeler" :disable="loading" v-else>Delete</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
