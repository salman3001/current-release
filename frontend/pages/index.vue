<script setup lang="ts">
const customFetch = useCustomFetch();

const page = ref(1);
const route = useRoute();
// const tab = ref(route.query?.tab ? Number(route.query?.tab) : null);
const sortBy = ref(route.query?.sortBy || null);
const modal = modalStore();
const scrollPosition = ref(0);

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
  navigateTo(routes.home);
};

const isFilterApplied = ref(isFilterEmpty() ? false : true);

const { data, error } = await useAsyncData("web-home", async () => {
  const [categories] = await Promise.all([
    customFetch<IResType<IServiceCategory[]>>(
      apiRoutes.service_categories.list,
      {}
    ),
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
  customFetch<IPageRes<IService[]>>(apiRoutes.services.list, {
    query: {
      page: page.value,
      orderBy: sortBy.value || "created_at",
      ...route.query.tab ? { where_service_category_id: route.query.tab } : {},
      search: route.query.whereILike || null
    } as IQs
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
  <br />
  <div class="row justify-between items-center q-col-gutter-md">
    <div class="row gap-50 col-12 col-sm-1 gt-sm" style="flex-wrap: nowrap">
      <q-btn round icon="arrow_back_ios" size="sm" flat class="btn-grey" rounded @click="scrollPosition -= 300" />
      <q-btn round icon="arrow_forward_ios" size="sm" flat class="btn-grey" rounded @click="scrollPosition += 300" />
    </div>
    <ScrollArea height="90px" class="col-12 col-sm-10" :scroll-position="scrollPosition" :duration="300">
      <div class="row gap-50 justify-center" style="width: max-content; flex-wrap: nowrap">
        <WebCategoryIcon v-for="c in data?.categories" :category="c"
          :selected="(route.query.tab as number) == c.id ? true : false" @select="(v: number) => {
        navigateTo({
          path: routes.home,
          query: { ...route.query, tab: v }
        })

      }" />
      </div>
    </ScrollArea>

    <div class="row justify-end gap-50 col-12 col-sm-1" style="flex-wrap: nowrap">
      <q-btn round icon="tune" size="sm" flat class="btn-grey" rounded @click="
        modal.togel('WebSearchFilter', {
          sortBy: sortBy,
          atApply: (v: any) => {
            navigateTo({
              path: routes.home,
              query: { ...route.query, ...v },
            });
          },
        })
        ">
        <q-tooltip class="bg-primary"> Fliters </q-tooltip>
      </q-btn>

      <q-btn round icon="close" size="sm" flat class="btn-grey" @click="resetFilters" v-if="isFilterApplied">
        <q-tooltip class="bg-primary"> Clear Filters </q-tooltip>
      </q-btn>
    </div>
  </div>
  <div class="q-gutter-y-lg q-pt-nonex">
    <div>
      <!-- <h2 class="text-h6 text-bold q-my-none">Top Rated Services</h2>
      <p class="text-muted">A list of top rated services</p> -->
      <div class="row q-col-gutter-lg">
        <div v-if="servicesPending" v-for="s in 10" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <SkeletonBase type="card" />
        </div>
        <div v-else v-for="s in services?.data.data" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <WebServiceCard :service="s" />
        </div>
      </div>
      <PaginateComponet :page="page" :meta="services?.data.meta"
        @update:model-value="(v: number) => { page = v; refresh() }" />
    </div>
  </div>
</template>
wizreck
