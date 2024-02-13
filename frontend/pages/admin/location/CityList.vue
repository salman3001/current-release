<script setup lang="ts">
import { QTableProps } from 'quasar';
import SearchInput from 'src/components/forms/SearchInput.vue';
import { AdditionalParams } from 'src/type';
import { onMounted, reactive, ref } from 'vue';
import modalStore from 'src/stores/modalStore';
import useAddressStore from 'src/stores/addressStore';
import ImportExcel from 'src/components/ImportExcel.vue';
import ExportExcel from 'src/components/ExportExcel.vue';
import { onTableRequest } from 'src/utils/onTableRequest';
import { CityApi } from 'src/utils/BaseApiService';

const modal = modalStore();
const address = useAddressStore();

const filter = reactive<AdditionalParams>({
  search: {
    name: '',
  },
  filter: {
    is_active: null,
  },
  relationFilter: {
    state: {
      field: 'id',
      value: '',
      filter: {
        country: {
          field: 'id',
          value: '',
          filter: {
            continent: {
              field: 'id',
              value: '',
            },
          },
        },
      },

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


const { onRequest, loading, rows } = onTableRequest(CityApi, pagination, {
  populate: {
    state: {
      fields: ['name', 'id', 'country_id'],
      populate: {
        country: {
          fields: ['name', 'id', 'continent_id'],
          populate: {
            continent: {
              fields: ['name', 'id'],
            },
          },
        },
      }
    }
  },
},)


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
    name: 'continent',
    field: (row: any) => row?.state?.country?.continent?.name,
    label: 'Continent',
    align: 'left',
    style: 'height:auto;',
  },
  {
    name: 'country',
    field: (row: any) => row?.state?.country?.name,
    label: 'Country',
    align: 'left',
    style: 'height:auto;',
  },
  {
    name: 'state',
    field: (row: any) => row?.state?.name,
    label: 'state',
    align: 'left',
    style: 'height:auto;',
  },
  {
    name: 'is_active',
    field: (row: any) => (row?.is_active == 1 ? 'Active' : 'Inactive'),
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
  address.getCountinents();
  tableRef.value && tableRef.value.requestServerInteraction();
});
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
          <q-select outlined dense options-dense emit-value map-options
            v-model="filter.relationFilter!.state.filter!.country.filter!.continent.value"
            :options="[{ label: 'All', value: null }, ...address.selectContinents]" @update:model-value="(value) => {
              filter!.relationFilter!.state.filter!.country.value = null;
              filter!.relationFilter!.state.value = null;
              address.getCountries(value);
            }
              " label="Continent" class="col-auto" style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options
            v-model="filter!.relationFilter!.state.filter!.country.value"
            :options="[{ label: 'All', value: null }, ...address.selectContries]" label="Country" class="col-auto"
            style="min-width: 8rem" @update:model-value="(value) => {
              filter.relationFilter.state.value = null;
              address.getstates(value);
            }" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter!.relationFilter!.state.value"
            :options="[{ label: 'All', value: null }, ...address.selectStates]" label="state" class="col-auto"
            style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter!.filter!.is_active" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <ImportExcel type="city" />
          <ExportExcel type="city" />
          <q-btn color="primary" @click="() => {
            modal.togel('addCity', { tableRef });
          }
            ">+ Add City</q-btn>
        </div>
      </div>

      <q-table ref="tableRef" flat bordered title="Cities" :loading="loading" :rows="rows" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" :filter="filter" @request="onRequest" row-key="id">
        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <div>
              <q-badge v-if="props.row.is_active == 1" color="positive" outline :label="props.value" />
              <q-badge v-if="props.row.is_active == 0" color="secondary" outline :label="props.value" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <q-item clickable v-close-popup @click="
                    modal.togel('editCity', {
                      id: props.row?.id,
                      tableRef,
                    })
                    ">
                    <q-item-section>
                      <q-item-label> <q-icon name="edit" /> Edit</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: '/address/cities/' + props.row.id,
                      tableRef,
                      title: 'Delete City?',
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
