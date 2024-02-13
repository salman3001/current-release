<script setup lang="ts">
import type { QTableProps } from 'quasar';
import type { AdditionalParams } from '@/types/QueryParamsTypes';
import { RoleApi } from '@/utils/BaseApiService';
import { onTableRequest } from '@/utils/onTableRequest';
import { onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const modal = modalStore();
const router = useRouter();

definePageMeta({
  layout: 'admin-layout'
})

const filter = reactive<AdditionalParams>({
  filter: {
    is_active: null,
  },
});

const colomns: QTableProps['columns'] = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  {
    name: 'name',
    field: 'name',
    label: 'Role Name',
    align: 'left',
    sortable: true,
  },
  {
    name: 'permissions',
    field: (row) => row?.permission?.name,
    label: 'Permissions',
    align: 'left',
  },

  {
    name: 'is_active',
    field: (row) => row?.is_active == 1 ? 'Active' : 'Inactive',
    label: 'Status',
    align: 'left',
  },
  {
    name: 'option',
    field: (row: any) => row?.id,
    label: 'Options',
    align: 'center',
  },
];

const tableRef = ref();

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});


const { onRequest, loading, rows } = onTableRequest(baseApiUrl + '/roles', pagination, {
  populate: {
    permissions: {
      fields: ['*'],
    },
  },
})

onMounted(() => {
  tableRef.value && tableRef.value.requestServerInteraction();
});

</script>

<template>
  <q-page class="row q-ma-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <div>
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            navigateTo(routes.admin.roles);
          }
            " />
        </div>
        <div class="row q-gutter-sm">
          <q-select outlined dense options-dense emit-value map-options v-model="filter.filter!.is_active" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <q-btn color="primary" @click="() => {
            modal.togel('addRole', {
              tableRef
            })
          }
            ">+ Add Role</q-btn>
        </div>
      </div>
      <q-table flat bordered ref="tableRef" title="Roles" :rows="rows" :columns="colomns" :loading="loading"
        class="zebra-table" row-key="id" :pagination="pagination" @request="onRequest" :filter="filter">
        <template v-slot:body-cell-is_active="props">
          <q-td :props="props">
            <div>
              <q-badge v-if="props.row.is_active" color="positive" outline :label="props.value" />
              <q-badge v-if="!props.row.is_active" color="secondary" outline :label="props.value" />
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-permissions="props">
          <q-td :props="props" class="row items-center" style="min-height: auto; min-width: 400px">
            <div class="flex q-gutter-xs">
              <q-badge v-if="props.row.name === 'Super Admin'" color="positive" size="30px">All Permissions</q-badge>
              <q-badge v-else color="positive" size="30px" v-for="p in props.row.permissions" :key="p.id">
                {{ p.name }}
              </q-badge>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <q-item clickable v-close-popup @click="() => {
                    navigateTo(routes.admin.roles_edit(props.row.id))
                  }
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="edit" /> Edit Role</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: baseApiUrl + '/roles/' + props.row.id,
                      tableRef,
                      title: 'Delete Role?',
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
