<script setup lang="ts">
import { type QTableProps, date } from 'quasar';
import { ContactMessageApi } from '@/utils/BaseApiService';
import { onTableRequest } from '@/utils/onTableRequest';
import { onMounted, ref } from 'vue';

const modal = modalStore();
const { formatDate } = date

const tableRef = ref();

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});


const { onRequest, loading, rows } = onTableRequest('/api/contact-message', pagination,)


const colomns: QTableProps['columns'] = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left',
  },
  {
    name: 'email',
    field: 'email',
    label: 'Email',
    align: 'left',
    style: 'width:8rem;',
  },
  {
    name: 'message',
    field: 'message',
    label: 'Message',
    align: 'left',
    style: 'min-width:250px'
  },
  {
    name: 'created_at',
    field: (row: any) => formatDate(row?.created_at, 'DD-MM-YYYY HH:mm'),
    label: 'Date',
    align: 'center',
    style: 'min-width:150px',
    sortable: true
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
        <div></div>

        <div class="row q-gutter-sm">
          <export-excel type="contact-message" />
        </div>
      </div>
      <q-table ref="tableRef" flat bordered title="Contact Messages" :loading="loading" :rows="rows" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" @request="onRequest" row-key="id" wrap-cells>
        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <!-- <q-item
                    clickable
                    v-close-popup
                    @click="
                      () => {
                        router.push({
                          name: 'admin.knowlegebase.content.show',
                          params: { id: props.row.id },
                        });
                      }
                    "
                  >
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="visibility" /> View
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="
                      () => {
                        router.push({
                          name: 'admin.knowlegebase.content.edit',
                          params: { id: props.row.id },
                        });
                      }
                    "
                  >
                    <q-item-section>
                      <q-item-label> <q-icon name="edit" /> Edit </q-item-label>
                    </q-item-section>
                  </q-item> -->
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: '/help-center/contact-message/' + props.row.id,
                      tableRef,
                      title: 'Delete Contact Message?',
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
