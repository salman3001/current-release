<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ContinentsApi, CountriesApi } from '~/utils/BaseApiService';

const modal = modalStore();

const form = ref({
  name: '',
  isActive: false,
  continentId: '',
});

const continents = ref<null | any[]>(null);

onMounted(() => {
  ContinentsApi.index({
    fields: ['name', 'id'],
  }).then(({ data }) => {
    continents.value = data.value;
  });
});

const { execute, loading } = CountriesApi.post();
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar style="background-color: #ebeae4">
      <q-toolbar-title><span class="text-weight-bold">Add Country</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column q-px-md-sm">
      <q-form @submit="async () => {
        await execute(form);
        modal.show = !modal.show;
        modal.meta.tableRef.setPagination({}, true);
      }
        ">
        <q-select v-if="continents" outlined options-dense emit-value map-options v-model="form.continentId" :options="[
          { label: 'All', value: '' },
          ...continents.map((c) => ({
            label: c?.name,
            value: c?.id,
          })),
        ]" :rules="[rules.required('required')]" label="Continent" class="col-auto" style="min-width: 8rem" />
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
