<script setup lang="ts">
import type { QTableProps } from "quasar";
import type { AdditionalParams } from "@/types/QueryParamsTypes";
import { onMounted, reactive, ref } from "vue";
import { LanguageApi, blogCategoryApi } from "@/utils/BaseApiService";

const modal = modalStore();
const customFetch = useCustomFetch()

const filter = reactive<AdditionalParams>({
  populate: {
    language: {},
    category: {},
  },
  search: {
    title: "",
  },
  filter: {
    languageId: null,
    isPublished: null,
  },
  relationFilter: {
    category: {
      field: "blog_category_id",
      value: "",
    },
  },
});

const { data: categories } = await customFetch("api/blog-categories");

const { data: languages } = await customFetch("/api/language");

const tableRef = ref();

const pagination = ref({
  sortBy: "id",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
});

const { onRequest, loading, rows } = onTableRequest("/api/blogs", pagination, {
  populate: {
    category: {
      fields: ["name", "id"],
    },
    language: {
      fields: ["name", "id"],
    },
  },
});

const colomns: QTableProps["columns"] = [
  { name: "id", field: "id", label: "ID", align: "left" },
  {
    name: "title",
    field: "title",
    label: "Title",
    align: "left",
    style: "height:auto;",
  },
  {
    name: "language",
    field: (row: any) => row?.language?.name,
    label: "Language",
    align: "left",
  },
  {
    name: "category",
    field: (row: any) => (row?.category ? row?.category[0]?.name : ""),
    label: "Category",
    align: "center",
  },
  { name: "created_at", field: "date", label: "Date", align: "center" },
  {
    name: "is_published",
    field: (row: any) => (row?.is_published === 1 ? "Published" : "Draft"),
    label: "Status",
    align: "center",
  },
  {
    name: "option",
    field: (row: any) => row?.id,
    label: "Options",
    align: "center",
  },
];

onMounted(() => {
  tableRef.value && tableRef.value.requestServerInteraction();
});
</script>

<template>
  <q-page class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <FormsSearchInput @search="(val) => {
            //@ts-ignore
            filter.search.title = val;
            //@ts-ignore
          }
          " />

        <div class="row q-gutter-sm">
          <q-select v-model="filter.relationFilter!.category.value" v-if="categories?.data" dense options-dense
            emit-value map-options outlined :options="[{ label: 'All', value: null }, ...categories?.data.map((r: any) => ({
          label: r.name,
          value: r.id,
        }))]" label="Category" class="col-auto" style="min-width: 8rem" />
          <q-select dense v-model="filter.filter!.languageId" v-if="languages?.data" options-dense emit-value
            map-options outlined :options="[{ label: 'All', value: null }, ...languages?.data.map((r: any) => ({
          label: r.name,
          value: r.id,
        }))]" label="Language" class="col-auto" style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.filter!.isPublished" :options="[
          { label: 'All', value: null },
          { label: 'Published', value: 1 },
          { label: 'Draft', value: 0 },
        ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <ImportExcel type="blogs" />
          <ExportExcel type="blogs" />
          <q-btn color="primary" @click="() => {
            navigateTo(routes.admin.blogs.posts_create);
          }
          ">+ Add blog</q-btn>
        </div>
      </div>
      <q-table ref="tableRef" flat bordered title="Blog Posts" :loading="loading" :rows="rows" :columns="colomns"
        class="zebra-table" v-model:pagination="pagination" :filter="filter" @request="onRequest" row-key="id">
        <template v-slot:body-cell-title="props">
          <q-td :props="props" class="row q-gutter-x-xs items-center">
            <div class="row items-center" style="flex-wrap: nowrap; max-width: 100%; min-width: 300px">
              <div style="
                  max-width: 110px;
                  min-width: 110px;
                  max-height: 70px;
                  display: flex;
                  padding: 5px;
                ">
                <img :src="props.row?.thumbnail
            ? $config.public.baseApi + props.row?.thumbnail?.url
            : '/images/dummy-thumb.jpg'
          " style="width: 100%; object-fit: cover" />
              </div>
              <div class="ellipsis-2-lines" style="text-overflow: ellipsis">
                {{ props.row.title }}
              </div>
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-is_published="props">
          <q-td :props="props">
            <div>
              <q-badge v-if="props.row.is_published == 1" color="positive" outline :label="props.value" />
              <q-badge v-if="props.row.is_published == 0" color="secondary" outline :label="props.value" />
            </div>
          </q-td>
        </template>

        <template v-slot:body-cell-option="props">
          <q-td :props="props">
            <div class="">
              <q-btn-dropdown size="sm" color="primary" label="Options">
                <q-list dense>
                  <q-item clickable v-close-popup @click="() => {
            navigateTo(routes.admin.blogs.posts_show(props.row.id));
          }
          ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="visibility" /> View Blog</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="() => {
            navigateTo(routes.admin.blogs.posts_edit(props.row.id));
          }
          ">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="edit" /> Edit Blog</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="
          modal.togel('deleteRecord', {
            url: '/api/blogs/' + props.row.id,
            tableRef,
            title: 'Delete Blog?',
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
