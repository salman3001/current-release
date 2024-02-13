<script setup lang="ts">
import { QTableProps } from 'quasar';
import SearchInput from 'src/components/forms/SearchInput.vue';
import { useGetTableData } from 'src/composables/useGetTableData';
import { AdditionalParams } from 'src/type';
import { exportCSV } from 'src/utils/exportCSV';
import { computed, onMounted, reactive, ref } from 'vue';
import modalStore from 'src/stores/modalStore';
import { useRouter } from 'vue-router';
import { LanguageApi, blogCategoryApi } from 'src/utils/BaseApiService';
import ImportExcel from 'src/components/ImportExcel.vue';
import ExportExcel from 'src/components/ExportExcel.vue';
import { onTableRequest } from 'src/utils/onTableRequest';

const modal = modalStore();
const router = useRouter();
const uploads = ref('');

const filter = reactive<AdditionalParams>({
  populate: {
    language: {},
  },
  search: {
    name: '',
  },
  filter: {
    languageId: null,
    status: null,
  },
});

const languages = ref<null | Record<string, any>>(null);
LanguageApi.index().then(({ data }) => {
  languages.value = data.value;
});

const tableRef = ref();

const pagination = ref({
  sortBy: 'id',
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

const { onRequest, loading, rows } = onTableRequest(blogCategoryApi, pagination, {
  populate: {
    language: {
      fields: ['name', 'id'],
    },
  },
})


const colomns: QTableProps['columns'] = [
  { name: 'id', field: 'id', label: 'ID', align: 'left' },
  {
    name: 'name',
    field: 'name',
    label: 'Name',
    align: 'left',
    style: 'height:auto;',
    sortable: true
  },
  {
    name: 'language',
    field: (row: any) => row?.language?.name,
    label: 'Language',
    align: 'left',
  },
  { name: 'order', field: 'order', label: 'Order', align: 'center' },
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

onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
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
          <q-select dense v-model="filter.filter!.languageId" v-if="languages" options-dense emit-value map-options
            outlined :options="[{ label: 'All', value: null }, ...languages.map((r: any) => ({
              label: r.name,
              value: r.id,
            }))]" label="Language" class="col-auto" style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.filter!.status" :options="[
            { label: 'All', value: null },
            { label: 'Active', value: 1 },
            { label: 'Inactive', value: 0 },
          ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <ImportExcel type="blogs-category" />
          <ExportExcel type="blogs-category" />
          <q-btn color="primary" @click="() => {
            router.push({ name: 'admin.blogs.category.create' });
          }
            ">+ Add category</q-btn>
        </div>
      </div>

      <q-table ref="tableRef" flat bordered title="Blog Categories" :loading="loading" :rows="rows" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" :filter="filter" @request="onRequest" row-key="id">
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
                      name: 'admin.blogs.category.show',
                      params: { id: props.row.id },
                    });
                  }
                    ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="visibility" /> View
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="() => {
                    router.push({
                      name: 'admin.blogs.category.edit',
                      params: { id: props.row.id },
                    });
                  }
                    ">
                    <q-item-section>
                      <q-item-label> <q-icon name="edit" /> Edit</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
                    modal.togel('deleteRecord', {
                      url: '/blog-categories/' + props.row.id,
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
