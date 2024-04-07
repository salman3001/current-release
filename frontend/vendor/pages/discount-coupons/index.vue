<script setup lang="ts">
import { date, type QTableProps } from "quasar";

const { formatDate } = date;

const route = useRoute();
const selectedCoupon = ref<null | ICoupon>(null);
const deleteModal = ref(false);

const { query: filter, list: getCouponlist } = useCouponApi.list({
  page: (route.query.page as unknown as number) || 1,
  orderBy: (route.query.orderBy as string) || "created_at:desc",
  search: (route.query.search as string) || "",
  field__is_active: null,
  field__coupon_type: "vendor",
});

const {
  data: coupons,
  refresh,
  pending: couponPending,
} = await useAsyncData(
  async () => {
    const data = await getCouponlist();
    return data.data;
  },
  { watch: [filter] }
);

const {
  form: changeStatusForm,
  loading,
  updateStatus,
} = useCouponApi.updateStatus({
  status: selectedCoupon.value?.is_active || false,
});

const changeStatus = async (couponId: number, status: boolean) => {
  changeStatusForm.status = status;
  await updateStatus(couponId, {
    onSuccess: () => {
      refresh();
    },
  });
};

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
        <FormsSearchInput
          @search="
            (val) => {
              //@ts-ignore
              filter.search = `%${val}%`;
              //@ts-ignore
            }
          "
        />
        <div class="row q-gutter-sm">
          <!-- <q-select v-if="data?.serviceCategories" outlined dense options-dense emit-value map-options
            option-label="name" option-value="id" :options="[{ name: 'All', id: '' }, ...data?.serviceCategories]"
            v-model="filter.field__service_category_id" label="Category" class="col-auto" style="min-width: 8rem" />
          <q-select v-if="data?.serviceSubcategories" outlined dense options-dense emit-value map-options
            option-label="name" option-value="id" :options="[{ name: 'All', id: '' }, ...data?.serviceSubcategories]"
            v-model="filter.field__service_subcategory_id" label="Subcategory" class="col-auto"
            style="min-width: 8rem" />
          <q-select outlined dense options-dense emit-value map-options v-model="filter.field__is_active" :options="[
          { label: 'All', value: '' },
          { label: 'Active', value: 1 },
          { label: 'Inactive', value: 0 },
        ]" label="Status" class="col-auto" style="min-width: 8rem" /> -->
          <q-btn
            color="primary"
            @click="
              () => {
                navigateTo(routes.vendor.coupons.create);
              }
            "
            >+ Add Coupon</q-btn
          >
        </div>
      </div>
      <ScrollArea width="94vw" height="80vh">
        <div class="q-pa-sm">
          <q-table
            bordered
            title="Services"
            :loading="couponPending"
            :rows="coupons?.data"
            :columns="colomns"
            class="table-zebra shadow-9"
            :pagination="{
              rowsPerPage: 100,
            }"
            :rowNumber="filter.page"
            hide-pagination
          >
            <template v-slot:body-cell-is_active="props">
              <q-td :props="props">
                <div>
                  <q-badge
                    v-if="props.row.is_active == 1"
                    :label="props.value"
                    class="q-pa-sm q-badge-positive cursor-pointer"
                    @click="() => {}"
                  />
                  <q-badge
                    v-if="props.row.is_active == 0"
                    :label="props.value"
                    class="q-pa-sm q-badge-negative cursor-pointer"
                    @click="() => {}"
                  />
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-option="props">
              <q-td :props="props">
                <div class="">
                  <q-btn-dropdown
                    size="sm"
                    rounded
                    flat
                    dropdown-icon="more_vert"
                  >
                    <q-list dense>
                      <q-item
                        clickable
                        v-close-popup
                        @click="
                          () => {
                            navigateTo(
                              routes.vendor.coupons.view(props.row?.id)
                            );
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
                            navigateTo(
                              routes.vendor.coupons.edit(props.row?.id)
                            );
                          }
                        "
                      >
                        <q-item-section>
                          <q-item-label>
                            <q-icon name="edit" /> Edit</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                      <q-item
                        clickable
                        v-close-popup
                        @click="deleteModal = true"
                      >
                        <q-item-section>
                          <q-item-label>
                            <q-icon name="delete" /> Delete</q-item-label
                          >
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </q-td>
            </template>
          </q-table>

          <PaginateComponet
            :page="filter.page"
            @update:model-value="
              (p) => {
                filter.page = p;
              }
            "
            :meta="coupons?.meta"
          />
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
