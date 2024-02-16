<script setup lang="ts">
import type { QTableProps } from 'quasar';
import type { AdditionalParams } from '@/types/QueryParamsTypes';
import { permissions } from '@/utils/enums';
import { onTableRequest } from '@/utils/onTableRequest'


const modal = modalStore();
const tableRef = ref();


const filter = reactive<AdditionalParams>({
  populate: {
    role: {
      fields: ['*'],
    },
  },
  search: {
    first_name: '',
    last_name: '',
  },
  filter: {
    roleId: null,
    is_active: null,
  },
});


const { data: roles, pending: rolesLoading } = RoleApi.index()

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

const { onRequest, loading, rows } = onTableRequest('/api/admin-users', pagination, {
})

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
    sortable: true,

  },
  {
    name: 'role',
    field: (row: any) => row?.role?.name,
    label: 'Role',
    align: 'center',
  },
  { name: 'phone', field: 'phone', label: 'Phone', align: 'center' },
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
});
</script>

<template>
  <div class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <FormsSearchInput @search="(val) => {
          //@ts-ignore
          filter.search.first_name = val;
          //@ts-ignore
          filter.search.last_name = val;
        }
          " />

        <div class="row q-gutter-sm">
          <q-select v-model="filter.filter!.roleId" v-if="!rolesLoading" dense options-dense emit-value map-options
            outlined :options="[{ label: 'All', value: null }, ...roles.map((r: any) => ({
              label: r.name,
              value: r.id,
            }))]" label="Role" class="col-auto" style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.filter!.is_active" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <ImportExcel type="admin-users" />
          <ExportExcel type="admin-users" />
          <NuxtLink :to="routes.admin.admin_users_create">
            <q-btn color="primary" >+ Add User</q-btn>
          </NuxtLink>


        </div>
      </div>
      <!-- <MyQTable :colomns="colomns" :url="'admin-users'" /> -->
      <q-table ref="tableRef" flat bordered title="Admin Users" :loading="loading" :rows="rows"  :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" :filter="filter" @request="onRequest" row-key="id">
        <template v-slot:body-cell-first_name="props">
          <q-td :props="props" class="row q-gutter-x-xs items-center" style="flex-wrap: nowrap;">
            <q-avatar size=" 30px">
              <img :src="props.row?.avatar
                ? $config.public.baseApi + props.row?.avatar?.url
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
                    navigateTo(routes.admin.admin_users_show(props.row.id))
                  }
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="visibility" /> View</q-item-label>
                    </q-item-section>
                  </q-item>
                  <!-- <q-item v-if="auth.hasPermission(permissions.MANAGE_ROLES)" clickable v-close-popup @click="
                    modal.togel('changeRole', {
                      roles: roles,
                      id: props.row.id,
                      selectedRole: props?.row?.role?.id,
                      tableRef,
                    })
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="published_with_changes" /> Change
                        Role</q-item-label>
                    </q-item-section>
                  </q-item> -->

                  <q-item v-if="props.row?.role?.name != 'Super Admin'" clickable v-close-popup @click="
                    modal.togel('changeAdminStatus', {
                      url: `/admin-users/ban/${props.row.id}`,
                      tableRef,
                    })
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="highlight_off" /> Ban User</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="props.row?.role?.name != 'Super Admin'" clickable v-close-popup @click="() => {
                    navigateTo(routes.admin.admin_users_edit(props.row.id))

                  }
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="edit" /> Edit User</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item v-if="props.row?.role?.name != 'Super Admin'" clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: '/admin-users/' + props.row.id,
                      tableRef,
                      title: 'Delete User?',
                    })
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="delete" /> Delete User</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup @click="() => {
                    navigateTo(routes.admin.admin_users_activity_log(props.row.id))
                  }">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="rowing" /> Activity log</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-btn-dropdown>
            </div>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>
