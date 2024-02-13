<script setup lang="ts">
import { QTableProps, date } from 'quasar';
import { useGetTableData } from 'src/composables/useGetTableData';
import modalStore from 'src/stores/modalStore';
import notificationStore from 'src/stores/notificationStore';
import { AdditionalParams } from 'src/type';
import { notifcationApi } from 'src/utils/BaseApiService';
import { reactive, ref } from 'vue';

const modal = modalStore();
const notification = notificationStore()
const { formatDate } = date
const sortBy = ref('all')


const filter = reactive<AdditionalParams>({
  whereNotNull: null,
  whereNull: null
});


const { data, loading, onRequest, pagination, tableRef } = useGetTableData(
  '/notifications'
);

const colomns: QTableProps['columns'] = [
  {
    name: 'data',
    field: (row: any) => row?.data?.message,
    label: 'Message',
    align: 'left',
    style: 'min-width:300px'
  },
  {
    name: 'created_at',
    field: (row: any) => formatDate(row?.created_at, ' HH:mma DD-MMM-YY'),
    label: 'Date',
    align: 'center',
    style: 'min-width:150px;'

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
        <div></div>

        <div class="row q-gutter-sm">
          <q-select dense v-model="sortBy" options-dense emit-value map-options outlined
            :options="[{ label: 'All', value: 'all' }, { label: 'Read', value: 'read' }, { label: 'Unread', value: 'unread' }]"
            label="Sort by" class="col-auto" style="min-width: 8rem" @update:model-value="(v) => {
              if (v == 'read') {
                filter.whereNotNull = 'read_at'
                filter.whereNull = null
              }

              if (v == 'unread') {
                filter.whereNotNull = null
                filter.whereNull = 'read_at'
              }

              if (v == 'all') {
                filter.whereNotNull = null
                filter.whereNull = null
              }
            }" />
          <q-btn color="primary" @click="() => {
            modal.togel('deleteNotification', {
              type: 'read',
              tableRef,
              title: 'Delete Read Notifications?',
            })
          }">Delete Read</q-btn>
          <q-btn color="primary" @click="() => {
            modal.togel('deleteNotification', {
              type: 'all',
              tableRef,
              title: 'Delete All Notifications?',
            })
          }">Delete All</q-btn>
          <!-- <q-select outlined dense options-dense emit-value map-options v-model="filter.filter.status" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" /> -->
        </div>
      </div>
      <q-table ref="tableRef" flat bordered title="Notifications" :loading="loading" :rows="data" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" @request="onRequest" :filter="filter" row-key="id" wrap-cells>
        <template v-slot:body-cell-data="props">
          <div class="q-pa-sm" style="min-width: 300px;">
            {{ props?.row?.data?.message }} <q-badge v-if="props?.row?.read_at == null" color="secondary">new</q-badge>
          </div>
        </template>
        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteNotification', {
                      type: 'one',
                      id: props.row.id,
                      tableRef,
                      title: 'Delete Notification?',
                    })
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="delete" /> Delete</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    notifcationApi.markAsRead({}, {
                      onSuccess: () => {
                        tableRef.setPagination({}, true);
                        notification.getMenuNotifications()
                      }
                    }).execute(props.row.id)
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="check" /> Mark As Read</q-item-label>
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
