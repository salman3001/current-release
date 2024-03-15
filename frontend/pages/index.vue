<script setup lang="ts">
const customFetch = useCustomFetch();

const page = ref(1);
const route = useRoute();
const tab = ref(route.query?.tab ? Number(route.query?.tab) : null);
const sortBy = ref(route.query?.sortBy || null);
const modal = modalStore();

const isFilterEmpty = () => {
  if (
    ![undefined, null, ""].includes(route.query?.whereILike as string) ||
    ![undefined, null, ""].includes(route.query?.sortBy as string) ||
    ![undefined, null, ""].includes(route.query?.tab as string)
  ) {
    return false;
  } else {
    return true;
  }
};

const resetFilters = () => {
  tab.value = null;
  navigateTo(routes.home);
};

const isFilterApplied = ref(isFilterEmpty() ? false : true);

const { data, error } = await useAsyncData("web-home", async () => {
  const [categories] = await Promise.all([
    customFetch<IResType<IServiceCategory[]>>(apiRoutes.service_categories, {}),
  ]);

  return {
    categories: categories?.data || [],
  };
});

const {
  data: services,
  refresh,
  pending: servicesPending,
} = await useAsyncData(() =>
  customFetch<IPageRes<IService[]>>(apiRoutes.services, {
    query: {
      page: page.value,
      preload: [
        {
          variants: {
            select: ["id", "price"],
          },
          reviews: {
            select: ["rating"],
          },
        },
      ],
      withAggregate: [
        {
          aggregator: "min",
          field: "price",
          relation: "variants",
          as: "starting_from",
        },
      ],
      where: tab.value
        ? {
            service_category_id: tab.value,
          }
        : {},
      sortBy: sortBy.value || "created_at",
      whereILike: route.query.whereILike
        ? { name: route.query.whereILike as string }
        : {},
    } as AdditionalParams,
  })
);

watch(
  () => route.query,
  (newQuery) => {
    sortBy.value = newQuery.sortBy || null;

    if (isFilterEmpty()) {
      isFilterApplied.value = false;
    } else {
      isFilterApplied.value = true;
    }
    refresh();
  }
);
</script>

<template>
  <div class="" style="max-width: 90vw">
    <q-tabs
      dense
      v-model="tab"
      active-color="primary"
      indicator-color="primary"
      align="left"
      @update:model-value="(v:number)=>navigateTo({
        path:routes.home,
        query:{
          ...route.query,
          tab:v
        }
      })"
    >
      <q-tab
        class="normalcase"
        v-for="c in data?.categories"
        :name="c.id"
        :label="c.name"
        icon="mail"
        style="font-size: 0.1rem"
      ></q-tab>
    </q-tabs>
  </div>
  <q-separator />
  <div class="q-pa-md q-pa-md-lg q-pa-lg-xl q-gutter-y-lg">
    <div class="row justify-end gap-50">
      <q-btn
        icon="tune"
        rounded
        @click="
          modal.togel('WebSearchFilter', {
            sortBy: sortBy,
            atApply: (v: any) => {
              navigateTo({
                path: routes.home,
                query: { ...route.query, ...v },
              });
            },
          })
        "
        color="primary"
        label="Filters"
      />
      <q-btn
        color="secondary"
        icon="close"
        @click="resetFilters"
        v-if="isFilterApplied"
        >Clear Filters</q-btn
      >
    </div>

    <div>
      <!-- <h2 class="text-h6 text-bold q-my-none">Top Rated Services</h2>
      <p class="text-muted">A list of top rated services</p> -->
      <div class="row q-col-gutter-lg q-mt-sm">
        <div
          v-if="servicesPending"
          v-for="s in 10"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <SkeletonBase type="card" />
        </div>
        <div
          v-else
          v-for="s in services?.data.data"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <WebServiceCard :service="s" />
        </div>
      </div>
      <PaginateComponet
        :page="page"
        :meta="services?.data.meta"
        @update:model-value="(v: number) => { page = v; refresh() }"
      />
    </div>
  </div>
</template>
