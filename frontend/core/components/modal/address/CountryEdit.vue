<script setup lang="ts">
import { ref } from 'vue';
import { CountriesApi } from '~/utils/BaseApiService';

const modal = modalStore();

const form = ref({
  name: '',
  isActive: false,
});

const country = ref<null | Record<string, any>>(null);

CountriesApi.show(modal.meta?.id).then(({ data }) => {
  country.value = data.value;
  form.value.name = (data.value as any)?.name;
  form.value.isActive = (data.value as any)?.is_active == 1 ? true : false;
});

const { execute, loading } = CountriesApi.put();
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar color="primary">
      <q-toolbar-title><span class="text-weight-bold">Edit Country</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column q-px-md-sm">
      <q-form @submit="async () => {
        await execute(modal.meta?.id, form);
        modal.show = !modal.show;
        modal.meta.tableRef.setPagination({}, true);
      }
        ">
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
