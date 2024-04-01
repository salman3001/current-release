<script setup lang="ts">
import { date, type QTableProps } from "quasar";

const modal = modalStore();
const { formatDate } = date;

const customFetch = useCustomFetch();
const route = useRoute();
const getImageUrl = useGetImageUrl();
const { loading: changingStatus, fetch: postFetch } = usePostFetch()

const filter = reactive({
  page: (route.query.page as unknown as number) || 1,
  orderBy: (route.query.orderBy as string) || "created_at:desc",
  search: (route.query.search as string) || "",
  field__is_active: "",
  where_service_category_id: "",
  where_service_subcategory_id: "",
});

const {
  data: services,
  refresh,
  pending: servicesPending,
} = await useAsyncData(
  async () => {
    const data = await customFetch<IPageRes<IService[]>>(
      apiRoutes.services.my_list,
      {
        query: filter,
      }
    );
    return data.data;
  },
  { watch: [filter] }
);

const { data, pending: dataPending } = await useAsyncData(async () => {
  const [serviceCategories, serviceSubcategories] = await Promise.all([
    customFetch<IResType<IServiceCategory[]>>(
      apiRoutes.service_categories.list
    ),
    customFetch<IResType<IServiceSubcategory[]>>(
      apiRoutes.service_subcategories.list
    ),
  ]);

  return {
    serviceCategories: serviceCategories.data,
    serviceSubcategories: serviceSubcategories.data,
  };
});

const changeStatus = async (serviceId: number, status: boolean) => {
  const res = await postFetch<IResType<any>>(apiRoutes.services.update((serviceId)), {
    method: 'put',
    body: {
      service: {
        isActive: status
      }
    }
  })

  if (res.success == true) {
    refresh()
  }
}

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
    name: "serviceCategory",
    field: (row: IService) => row?.serviceCategory?.name,
    label: "Service Category",
    align: "left",
    style: "height:auto;",
  },
  {
    name: "serviceSubcategory",
    field: (row: IService) => row?.serviceSubcategory?.name,
    label: "Service Subcategory",
    align: "left",
    style: "height:auto;",
  },
  {
    name: "tags",
    field: (row: IService) => row?.tags,
    label: "Tags",
    align: "left",
    style: "height:auto;min-width:15rem",
  },
  {
    name: "created_at",
    field: (row: any) => formatDate(row?.created_at, "DD-MM-YYYY HH:mm"),
    label: "Listed on",
    align: "center",
    style: "min-width:150px",
    sortable: true,
  },
  {
    name: "is_active",
    field: (row: IService) => (row?.is_active == true ? "Active" : "Inactive"),
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
</script>

<template>
  <div class="">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-sm">
        <FormsSearchInput @search="(val) => {
          //@ts-ignore
          filter.search = `%${val}%`;
          //@ts-ignore
        }
          " />
        <div class="row q-gutter-sm">
          <q-select v-if="data?.serviceCategories" outlined dense options-dense emit-value map-options
            option-label="name" option-value="id" :options="[{ name: 'All', id: '' }, ...data?.serviceCategories]"
            v-model="filter.where_service_category_id" label="Category" class="col-auto" style="min-width: 8rem" />
          <q-select v-if="data?.serviceSubcategories" outlined dense options-dense emit-value map-options
            option-label="name" option-value="id" :options="[{ name: 'All', id: '' }, ...data?.serviceSubcategories]"
            v-model="filter.where_service_subcategory_id" label="Subcategory" class="col-auto"
            style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.field__is_active" :options="[
          { label: 'All', value: '' },
          { label: 'Active', value: 1 },
          { label: 'Inactive', value: 0 },
        ]" label="Status" class="col-auto" style="min-width: 8rem" />
          <!-- <ImportExcel type="service" />
          <ExportExcel type="service" /> -->
          <q-btn color="primary" @click="() => {
          navigateTo(routes.vendor.services.create);
        }
          ">+ Add Service</q-btn>
        </div>
      </div>
      <ScrollArea width="94vw" height="80vh">
        <div class="q-pa-sm">
          <q-table bordered title="Services" :loading="servicesPending" :rows="services?.data" :columns="colomns"
            class="table-zebra shadow-9" :pagination="{
          rowsPerPage: 100,
        }" :rowNumber="filter.page" hide-pagination>
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
                    <img :src="getImageUrl((props.row as IService).thumbnail?.breakpoints?.thumbnail?.url, '/images/dummy-thumb.jpg')
          " style="width: 100%; object-fit: cover" />
                  </div>
                  <div class="ellipsis-2-lines" style="text-overflow: ellipsis">
                    {{ props.row.name }}
                  </div>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-is_active="props">
              <q-td :props="props">
                <div>
                  <q-badge v-if="props.row.is_active == 1" :label="props.value"
                    class="q-pa-sm q-badge-positive cursor-pointer" @click="modal.togel('confirm', {
          title: 'Deactivate Service',
          message: 'Deactvate this service, Are you sure?',
          iconName: 'question_mark',
          onAccept: () => {
            changeStatus(props.row.id, false)
          }
        })" />
                  <q-badge v-if="props.row.is_active == 0" :label="props.value"
                    class="q-pa-sm q-badge-negative cursor-pointer" @click="modal.togel('confirm', {
          title: 'Activate Service',
          message: 'Activate this service, Are you sure?',
          iconName: 'question_mark',
          onAccept: () => {
            changeStatus(props.row.id, true)
          }
        })" />
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-tags="props">
              <q-td :props="props">
                <div class="row full-width q-gutter-xs">
                  <q-badge v-for="tag in props.row?.tags" :label="tag?.name" class="q-badge-secondary" />
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-option="props">
              <q-td :props="props">
                <div class="">
                  <q-btn-dropdown size="sm" rounded flat dropdown-icon="more_vert">
                    <q-list dense>
                      <q-item clickable v-close-popup @click="() => {
          navigateTo(
            routes.vendor.services.view(props.row?.slug)
          );
        }
          ">
                        <q-item-section>
                          <q-item-label>
                            <q-icon name="visibility" /> View</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="() => {
          navigateTo(
            routes.vendor.services.edit(props.row.slug)
          );
        }
          ">
                        <q-item-section>
                          <q-item-label>
                            <q-icon name="edit" /> Edit</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="
          modal.togel('deleteRecord', {
            url: '/api/service/' + props.row.id,
            title: 'Delete Service?',
            onSuccess: () => {
              refresh();
            },
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

          <PaginateComponet :page="filter.page" @update:model-value="(p) => {
          filter.page = p;
        }
          " :meta="services?.meta" />
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
