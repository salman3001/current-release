<script setup lang="ts">
import type { QTableProps } from 'quasar';
import type { AdditionalParams } from '@/types/QueryParamsTypes';
import { onMounted, reactive, ref } from 'vue';
import modalStore from '@/stores/modalStore';
import { LanguageApi } from '@/utils/BaseApiService';
import { onTableRequest } from '@/utils/onTableRequest';

definePageMeta({
  layout: 'admin-layout'
})

const modal = modalStore()

const filter = reactive<AdditionalParams>({
  search: {
    name: '',
  },
  filter: {
    is_active: null,
    language_id: null,
  },
});


const tableRef = ref();

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

const { onRequest, loading, rows } = onTableRequest('/api/help-center/categories', pagination, {
  populate: {
    language: {
      fields: ['name', 'id'],
    },
  },
})


const { data: languages } = LanguageApi.index({
  fields: ['name', 'id'],
})

const colomns: QTableProps['columns'] = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
    style: 'min-width:500px;',
  },
  {
    name: 'language',
    field: (row) => row?.language?.name,
    label: 'Language',
    align: 'left',
  },
  {
    name: 'is_active',
    field: (row: any) => (row?.is_active === 1 ? 'Active' : 'Inactive'),
    label: 'Status',
    align: 'center',
  },
  {
    name: 'option',
    field: (row: any) => row?.id,
    label: 'Options',
    align: 'center',
  },
];

onMounted(() => {
  tableRef.value && tableRef.value.requestServerInteraction();
})
</script>

<template>
  <q-page class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <FormsSearchInput @search="(val) => {
          //@ts-ignore
          filter.search.name = val;
        }
          " />

        <div class="row q-gutter-sm">
          <q-select v-model="filter.filter!.language_id" v-if="languages" dense options-dense emit-value map-options
            outlined :options="[{ label: 'All', value: null }, ...languages.map((r: any) => ({
              label: r.name,
              value: r.id,
            }))]" label="Languages" class="col-auto" style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.filter!.is_active" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <ImportExcel type="helpcenter-category" />
          <ExportExcel type="helpcenter-category" />
          <q-btn color="primary" @click="() => {
            navigateTo(routes.admin.knowlegdebase.category_create)
          }
            ">+ Add Category</q-btn>
        </div>
      </div>
      <q-table ref="tableRef" flat bordered title="Categories" :loading="loading" :rows="rows" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" :filter="filter" @request="onRequest" row-key="id" wrap-cells>
        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <div>
              <q-badge v-if="props.row.is_active" color="positive" outline :label="props.value" />
              <q-badge v-if="!props.row.is_active" color="secondary" outline :label="props.value" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <q-item clickable v-close-popup @click="() => {
                    navigateTo(routes.admin.knowlegdebase.category_show(props.row.id))

                  }
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="visibility" /> View
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="() => {
                    navigateTo(routes.admin.knowlegdebase.category_edit(props.row.id))

                  }
                    ">
                    <q-item-section>
                      <q-item-label> <q-icon name="edit" /> Edit </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: '/help-center/categories/' + props.row.id,
                      tableRef,
                      title: 'Delete Category?',
                    })
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="delete" /> Delete</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
