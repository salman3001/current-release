<script setup lang="ts">
import { ref } from 'vue';
import { TicketStatus } from '@/utils/enums';
import { SupportTickeApi } from '~/utils/BaseApiService';

const modal = modalStore();
const loading = ref(false);
const status = ref(modal?.meta?.status)


const handeler = async () => {
  loading.value = true;
  await SupportTickeApi.changeStatus().execute(modal?.meta?.id, { status: status.value })
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
    <q-card-section class="row wrap">
      <div class="q-pa-md col-auto">
        <q-radio v-model="status" label="Open" :val="TicketStatus.OPEN" />
        <q-radio v-model="status" label="Responded" :val="TicketStatus.RESPONDED" />
        <q-radio v-model="status" label="Closed" :val="TicketStatus.CLOSED" />
      </div>
    </q-card-section>
    <q-card-section class="row justify-end">
      <div class="q-gutter-sm">
        <q-btn flat style="background-color: #f2f0dc" @click="modal.show = !modal.show">Cancle</q-btn>
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" />
        </q-btn>
        <q-btn color="primary" @click="handeler" :disable="loading" v-else>Change</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
