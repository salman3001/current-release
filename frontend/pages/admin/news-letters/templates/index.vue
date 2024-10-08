<script setup lang="ts">
import type { QTableProps } from "quasar";
import type { AdditionalParams } from "@/types/QueryParamsTypes";

const modal = modalStore();

const filter = reactive<AdditionalParams>({
  search: {
    name: "",
  },
});

const tableRef = ref();

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

const { onRequest, loading, rows } = onTableRequest(
  "/api/template",
  pagination
);

onMounted(() => {
  tableRef.value && tableRef.value.requestServerInteraction();
});

const colomns: QTableProps["columns"] = [
  { name: "id", field: "id", label: "ID", align: "left" },
  {
    name: "name",
    field: "name",
    label: "Name",
    align: "left",
    style: "height:auto;",
  },
  {
    name: "option",
    field: (row: any) => row?.id,
    label: "Options",
    align: "center",
  },
];
</script>

<template>
  <q-page class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <FormsSearchInput
          @search="
            (val) => {
              //@ts-ignore
              filter.search.name = val;
              //@ts-ignore
            }
          "
        />
        <div class="row q-gutter-sm">
          <ImportExcel type="template" />
          <ExportExcel type="template" />
          <q-btn
            color="primary"
            @click="
              () => {
                navigateTo(routes.admin.templates.create);
              }
            "
            >+ Add Template</q-btn
          >
        </div>
      </div>

      <q-table
        ref="tableRef"
        flat
        bordered
        title="Templates"
        :loading="loading"
        :rows="rows"
        :columns="colomns"
        class="zebra-table"
        v-model:pagination="pagination"
        :filter="filter"
        @request="onRequest"
        row-key="id"
      >
        <template v-slot:body-cell-name="props">
          <q-td :props="props" class="row q-gutter-x-xs items-center">
            <div
              class="row items-center"
              style="flex-wrap: nowrap; max-width: 100%; min-width: 300px"
            >
              <div
                style="
                  max-width: 110px;
                  min-width: 110px;
                  max-height: 70px;
                  display: flex;
                  padding: 5px;
                "
              >
                <img
                  :src="
                    props.row?.thumbnail?.url
                      ? $config.public.baseApi + props.row?.thumbnail?.url
                      : '/images/dummy-thumb.jpg'
                  "
                  style="width: 100%; object-fit: cover"
                />
              </div>
              <div class="ellipsis-2-lines" style="text-overflow: ellipsis">
                {{ props.row.name }}
              </div>
            </div>
          </q-td>
        </template>
        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <q-item
                    clickable
                    v-close-popup
                    @click="
                      () => {
                        navigateTo(routes.admin.templates.show(props.row.id));
                      }
                    "
                  >
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="visibility" /> View</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="
                      () => {
                        navigateTo(routes.admin.templates.edit(props.row.id));
                      }
                    "
                  >
                    <q-item-section>
                      <q-item-label> <q-icon name="edit" /> Edit</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    v-close-popup
                    @click="
                      modal.togel('deleteRecord', {
                        url: '/api/template/' + props.row.id,
                        tableRef,
                        title: 'Delete Template?',
                      })
                    "
                  >
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="delete" />Delete</q-item-label
                      >
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
