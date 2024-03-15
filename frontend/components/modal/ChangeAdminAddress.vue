<script setup lang="ts">
import { Notify } from 'quasar';
import { ref } from 'vue';

const modal = modalStore();
const selectRole = ref(modal?.meta?.selectedRole);
const loading = ref(false);
const update = async () => {
  try {
    loading.value = true;
    await api.get('admin-users/change-role/' + modal.meta.id, {
      params: {
        roleId: selectRole.value,
      },
    });
    loading.value = false;
    modal.meta.tableRef.setPagination({}, true);
    modal.show = !modal.show;
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
};
</script>

<template>
  <q-card>
    <q-toolbar color="primary">
      <q-toolbar-title><span class="text-weight-bold">Change Role</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="row wrap">
      <div class="column q-gutter-y-md">
        <p class="text-subtitle1">Location Information</p>
        <div class="row q-col-gutter-md">
          <q-input outlined v-model="form.address.address" class="col-12 col-md-9" label="Address" />
          <q-select outlined emit-value map-options v-model="form.address.continentId"
            :options="address.selectContinents" label="Continet" class="col-12 col-sm-6 col-md-3" @update:model-value="(value) => {
            address.getCountries(value);
          }
            " />
          <q-select outlined emit-value map-options v-model="form.address.countryId" label="Country"
            class="col-12 col-sm-6 col-md-3" :options="address.selectContries" @update:model-value="(value) => {
            address.getstates(value);
          }
            " />
          <q-select outlined emit-value map-options v-model="form.address.stateId" label="State"
            class="col-12 col-sm-6 col-md-3" :options="address.selectStates" @update:model-value="(value) => {
            address.getCities(value);
          }
            " />
          <q-select outlined emit-value map-options v-model="form.address.cityId" label="City"
            class="col-12 col-sm-6 col-md-3" :options="address.selectCities" @update:model-value="(value) => {
            address.getStreets(value);
          }
            " />
          <q-select outlined emit-value map-options v-model="form.address.streetId" label="Street"
            class="col-12 col-sm-6 col-md-3" :options="address.selectStreets" />
          <q-input outlined v-model="form.address.zip" class="col-12 col-sm-6 col-md-3" label="Post Code" />
        </div>
      </div>
    </q-card-section>
    <q-card-section class="row justify-end">
      <div class="q-gutter-sm">
        <q-btn flat style="background-color: #f2f0dc" @click="modal.show = !modal.show">Cancle</q-btn>
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" />
        </q-btn>
        <q-btn v-else color="primary" @click="update" :disable="loading">
          Change</q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>
