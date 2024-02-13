<script setup lang="ts">
import { QTableProps, date } from 'quasar';
import SearchInput from 'src/components/forms/SearchInput.vue';
import { AdditionalParams } from 'src/type';
import { onMounted, reactive, ref } from 'vue';
import modalStore from 'src/stores/modalStore';
import { serviceApi, serviceCategoryApi, serviceSubCategoryApi } from 'src/utils/BaseApiService';
import { useRouter } from 'vue-router';
import ImportExcel from 'src/components/ImportExcel.vue';
import ExportExcel from 'src/components/ExportExcel.vue';
import { onTableRequest } from 'src/utils/onTableRequest';

const modal = modalStore();
const { formatDate } = date
const router = useRouter()
const uploads = ref('');


const filter = reactive<AdditionalParams>({
  search: {
    name: '',
  },
  filter: {
    status: null,
  },
  relationFilter: {
    serviceCategory: {
      field: 'service_category_id',
      value: '',
    },
    serviceSubcategory: {
      field: 'service_subcategory_id',
      value: '',
    },
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


const { onRequest, loading, rows } = onTableRequest(serviceApi, pagination, {
  populate: {
    serviceCategory: {
      fields: ['name', 'id'],
    },
    serviceSubcategory: {
      fields: ['name', 'id'],
    },
  },
})

onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
  tableRef.value && tableRef.value.requestServerInteraction();
});


const serviceCategories = ref<null | any[]>(null)
const { } = serviceCategoryApi.index({
  fields: ['name', 'id'],
}).then(({ data }) => {
  serviceCategories.value = data.value as unknown as []
})

const serviceSubcategories = ref<null | any[]>(null)
const { } = serviceSubCategoryApi.index({
  fields: ['name', 'id'],
}).then(({ data }) => {
  serviceSubcategories.value = data.value as unknown as []
})

const colomns: QTableProps['columns'] = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left',
    style: 'height:auto;',
  },
  {
    name: 'serviceCategory',
    field: (row: any) => row?.serviceCategory?.name,
    label: 'Service Category',
    align: 'left',
    style: 'height:auto;',
  },
  {
    name: 'serviceSubcategory',
    field: (row: any) => row?.serviceSubcategory?.name,
    label: 'Service Subcategory',
    align: 'left',
    style: 'height:auto;',
  },
  {
    name: 'companyName',
    field: 'company_name',
    label: 'Company Name',
    align: 'left',
    style: 'height:auto;',
  },
  {
    name: 'created_at',
    field: (row: any) => formatDate(row?.created_at, 'DD-MM-YYYY HH:mm'),
    label: 'Listed',
    align: 'center',
    style: 'min-width:150px',
    sortable: true

  },
  {
    name: 'status',
    field: (row: any) => (row?.status == 1 ? 'Active' : 'Inactive'),
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

</script>

<template>
  <q-page class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <SearchInput @search="(val) => {
          //@ts-ignore
          filter.search.name = val;
          //@ts-ignore
        }
          " />
        <div class="row q-gutter-sm">
          <q-select v-if="serviceCategories" outlined dense options-dense emit-value map-options
            v-model="filter.relationFilter!.serviceCategory.value" :options="[
              { label: 'All', value: null },
              ...serviceCategories.map((c) => ({
                label: c?.name,
                value: c?.id,
              })),
            ]" label="Category" class="col-auto" style="min-width: 8rem" />
          <q-select v-if="serviceSubcategories" outlined dense options-dense emit-value map-options
            v-model="filter.relationFilter!.serviceSubcategory.value" :options="[
              { label: 'All', value: null },
              ...serviceSubcategories.map((c) => ({
                label: c?.name,
                value: c?.id,
              })),
            ]" label="Subcategory" class="col-auto" style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.filter!.status" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <ImportExcel type="service" />
          <ExportExcel type="service" />
          <q-btn color="primary" @click="() => {
            router.push({
              name: 'admin.service.create',
            })
          }
            ">+ Add Service</q-btn>
        </div>
      </div>

      <q-table ref="tableRef" flat bordered title="Services" :loading="loading" :rows="rows" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" :filter="filter" @request="onRequest" row-key="id">
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="row q-gutter-x-xs items-center">
            <div class="row items-center" style="flex-wrap: nowrap; max-width: 100%; min-width: 300px">
              <div style="
                  max-width: 110px;
                  min-width: 110px;
                  max-height: 70px;
                  display: flex;
                  padding: 5px;
                ">
                <img :src="props.row?.logo?.url
                  ? uploads + props.row?.logo?.url
                  : '/images/dummy-thumb.jpg'
                  " style="width: 100%; object-fit: cover" />
              </div>
              <div class="ellipsis-2-lines" style="text-overflow: ellipsis">
                {{ props.row.name }}
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <div>
              <q-badge v-if="props.row.status == 1" color="positive" outline :label="props.value" />
              <q-badge v-if="props.row.status == 0" color="secondary" outline :label="props.value" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <q-item clickable v-close-popup @click="() => {
                    router.push({
                      name: 'admin.service.show',
                      params: { id: props.row.id }
                    })
                  }
                    ">
                    <q-item-section>
                      <q-item-label> <q-icon name="visibility" /> View</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="() => {
                    router.push({
                      name: 'admin.service.edit',
                      params: { id: props.row.id }
                    })
                  }
                    ">
                    <q-item-section>
                      <q-item-label> <q-icon name="edit" /> Edit</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: '/service/' + props.row.id,
                      tableRef,
                      title: 'Delete Service?',
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
