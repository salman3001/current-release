<script setup lang="ts">
import { ref } from 'vue';

const modal = modalStore();
const address = addressStore();

const form = ref({
  name: '',
  isActive: false,
  continentId: '',
  countryId: '',
  stateId: '',
});

await address.getCountinents();

const { execute, loading } = CityApi.post();
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar color="primary">
      <q-toolbar-title><span class="text-weight-bold">Add City</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column q-px-md-sm">
      <q-form @submit="async () => {
        await execute(form);
        modal.show = !modal.show;
        modal.meta.tableRef.setPagination({}, true);
      }
        ">
        <q-select outlined emit-value map-options :options="address.selectContinents" label="Continet"
          class="col-12 col-sm-6 col-md-3" v-model="form.continentId" @update:model-value="(value) => {
        form.countryId = '';
        form.stateId = ''
        address.getCountries(value);
      }
        " :rules="[rules.required('required')]" />
        <q-select outlined emit-value map-options v-model="form.countryId" label="Country"
          class="col-12 col-sm-6 col-md-3" :options="address.selectContries" @update:model-value="(value) => {
        form.stateId = ''
        address.getstates(value);
      }
        " :rules="[rules.required('required')]" />
        <q-select outlined emit-value map-options v-model="form.stateId" label="State" class="col-12 col-sm-6 col-md-3"
          :options="address.selectStates" :rules="[rules.required('required')]" />
        <q-input outlined v-model="form.name" label="Name" :rules="[rules.required('required')]" />
        <q-toggle v-model="form.isActive" label="Activate" class="col-12 col-sm-6 col-md-3" />
        <div class="row q-gutter-sm justify-end q-pt-lg">
          <q-btn flat style="background-color: #f2f0dc; min-width: 6rem" @click="modal.show = !modal.show">No</q-btn>
          <q-btn color="primary" v-if="loading">
            <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
              track-color="orange-2" />
          </q-btn>
          <q-btn color="primary" type="submit" :disable="loading" v-else style="min-width: 6rem">Yes</q-btn>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
