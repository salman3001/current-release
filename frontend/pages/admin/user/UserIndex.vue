<script setup lang="ts">
import { QTableProps, date } from 'quasar';
import SearchInput from 'src/components/forms/SearchInput.vue';
import { AdditionalParams } from 'src/type';
import { onMounted, reactive, ref } from 'vue';
import modalStore from 'src/stores/modalStore';
import { useRouter } from 'vue-router';
import { CountriesApi, userApi } from 'src/utils/BaseApiService';
import ImportExcel from 'src/components/ImportExcel.vue';
import ExportExcel from 'src/components/ExportExcel.vue';
import { onTableRequest } from 'src/utils/onTableRequest';

const modal = modalStore();
const router = useRouter();
const uploads = ref('');

const { formatDate } = date

const filter = reactive<AdditionalParams>({
  search: {
    first_name: '',
    last_name: '',
  },
  filter: {
    is_active: null,
  },
  relationFilter: {
    address: {
      field: 'country_id',
      value: '',
      // filter: {
      //   country: {
      //     field: 'id',
      //     value: ''
      //   }
      // }
    }
  }
});


const countries = ref<null | any[]>(null)
CountriesApi.index({
  fields: ['name', 'id']
}).then(({ data }) => {
  countries.value = data.value
})

const tableRef = ref();

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

const { onRequest, loading, rows } = onTableRequest(userApi, pagination, {
  populate: {
    address: {
      fields: ['country_id'],
      populate: {
        country: {
          fields: ['name']
        }
      }
    },
  },
})

onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
  tableRef.value && tableRef.value.requestServerInteraction();
});


const colomns: QTableProps['columns'] = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  {
    name: 'first_name',
    field: (row: any) => row?.first_name + ' ' + row?.last_name,
    label: 'Name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'email',
    field: 'email',
    label: 'Email',
    align: 'left',
  },
  {
    name: 'country',
    field: (row: any) => row?.address?.country?.name,
    label: 'Country',
    align: 'center',
  },
  { name: 'phone', field: 'phone', label: 'Phone', align: 'center' },
  {
    name: 'created_at',
    field: (row: any) => formatDate(row?.created_at, 'DD-MM-YYYY'),
    label: 'Joined',
    align: 'center',
    sortable: true,

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

</script>

<template>
  <q-page class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <SearchInput @search="(val) => {
          //@ts-ignore
          filter.search.first_name = val;
          //@ts-ignore
          filter.search.last_name = val;
        }
          " />

        <div class="row q-gutter-sm">
          <q-select v-model="filter.relationFilter!.address.value" v-if="countries" dense options-dense emit-value
            map-options outlined :options="[{ name: 'All', id: '' }, ...countries]" label="Country" class="col-auto"
            style="min-width: 8rem" option-label="name" option-value="id" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.filter!.is_active" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <ImportExcel type="users" />
          <ExportExcel type="users" />
          <q-btn color="primary" @click="() => {
            router.push({ name: 'admin.user.create' });
          }
            ">+ Add User</q-btn>
        </div>
      </div>
      <q-table ref="tableRef" flat bordered title="Users" :loading="loading" :rows="rows" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" :filter="filter" @request="onRequest" row-key="id">
        <template v-slot:body-cell-first_name="props">
          <q-td :props="props" class="row q-gutter-x-xs items-center" style="flex-wrap: nowrap;">
            <q-avatar size="30px">
              <img :src="props.row?.avatar
                ? uploads + props.row?.avatar?.url
                : '/images/sample-dp.png'
                " :style="{
    border:
      props.row.is_active === 1
        ? '2px green solid'
        : '2px red solid',
  }" />
            </q-avatar>
            <div>
              {{ props.row.first_name + ' ' + props.row.last_name }}
            </div>
          </q-td>
        </template>
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
                    router.push({
                      name: 'admin.user.show',
                      params: {
                        id: props.row.id
                      }
                    })
                  }">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="visibility" /> View User</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    modal.togel('changeUserStatus', {
                      id: props.row.id,
                      tableRef,
                    })
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="highlight_off" /> Ban User</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="() => {
                    router.push({
                      name: 'admin.user.edit',
                      params: { id: props.row.id },
                    });
                  }
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="edit" /> Edit User</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: '/users/' + props.row.id,
                      tableRef,
                      title: 'Delete User?',
                    })
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="delete" /> Delete User</q-item-label>
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
