<script setup lang="ts">
import { Notify } from 'quasar';
import { ref } from 'vue';

const modal = modalStore();
const loading = ref(false);
const customFetch = useCustomFetch()

const handeler = async () => {
  try {
    loading.value = true;
    await customFetch(modal?.meta?.url, {
      method: 'delete'
    })
    loading.value = false;
    Notify.create({ message: 'Record Deleted!', color: 'positive', icon: 'check' });
    modal.meta.tableRef && modal.meta.tableRef.setPagination({}, true);
    modal.show = !modal.show;
  } catch (error: any) {
    loading.value = false;
    modal.show = !modal.show;
    Notify.create({
      message: 'Failed to delete record',
      color: 'negative',
      icon: 'error'
    });
  }
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

    <q-card-section class="column items-center q-px-md-sm">
      <q-icon name="block" class="col-4" size="5rem" />
      <p>Are you sure, You want to delete this record?</p>
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
