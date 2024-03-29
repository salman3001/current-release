<script setup lang="ts">
import { Notify } from 'quasar';
import { ref } from 'vue';

const modal = modalStore()
const selectRole = ref(modal?.meta?.selectedRole)
const loading = ref(false)
const update = async () => {
  try {
    loading.value = true
    await api.get('admin-users/change-role/' + modal.meta.id, {
      params: {
        roleId: selectRole.value
      }
    })
    loading.value = false
    modal.meta.tableRef.setPagination({}, true)
    modal.show = !modal.show
    Notify.create({
      message: 'Status Changed',
      color: 'positive',
    });
  } catch (error: any) {
    loading.value = false;
    if (error?.response) {
      Notify.create({
        message: error?.response?.data?.message,
        color: 'negative',
      });
    } else if (error?.request) {
      Notify.create({ message: 'Server Not Reachable!', color: 'negative' });
      console.log(error.request);
    } else {
      Notify.create({ message: error.message, color: 'negative' });
    }
  }

}
</script>

<template>
  <q-card>
    <q-toolbar style="background-color:#EBEAE4;">
      <q-toolbar-title><span class="text-weight-bold">Change Role</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="row wrap">
      <div v-for="role in modal?.meta?.roles" :key="role.id" class="q-pa-md col-auto">
        <q-radio v-model="selectRole" :label="role.name" :val="role.id" />
      </div>
    </q-card-section>
    <q-card-section class="row justify-end">
      <div class="q-gutter-sm">
        <q-btn flat style="background-color: #F2F0DC;" @click="modal.show = !modal.show">Cancle</q-btn>
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" />
        </q-btn>
        <q-btn v-else color="primary" @click="update" :disable="loading"> Change</q-btn>
      </div>
    </q-card-section>

  </q-card>
</template>
