<script setup lang="ts">


const route = useRoute();
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

const { list: getCategoryList } = useServiceCategoryApi.list({});
const { data } = await useAsyncData(async () => {
  const categories = await getCategoryList();
  return {
    categories: categories?.data || [],
  };
});

const { query, list } = useServiceApi.list({
  page: (route.query?.page as unknown as number) || 1,
  field__is_active: true,
  orderBy: (route.query?.sortBy as string) || "created_at:desc",
  field__service_category_id: (route.query.tab as unknown as number) || null,
  search: (route.query.whereILike as string) || null,
});

const {
  data: services,
  refresh,
  pending: servicesPending,
} = await useAsyncData(() => list(), {
  watch: [query],
  deep: true,
});

watch(
  () => route.query,
  (newQuery) => {
    query.orderBy = (newQuery.sortBy as string) || "";
    query.page = (newQuery.page as unknown as number) || 1;
    query.search = (newQuery.whereILike as unknown as string) || "";
    query.field__service_category_id = (newQuery.tab as unknown as number) || 1;

    if (isFilterEmpty()) {
      isFilterApplied.value = false;
    } else {
      isFilterApplied.value = true;
    }
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
          :selected="(route.query.tab as unknown as number) == c.id ? true : false" @select="(v: number) => {
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
          sortBy: query.orderBy,
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
      <PaginateComponet :page="query.page" :meta="services?.data.meta"
        @update:model-value="(v: number) => { query.page = v; refresh() }" />
    </div>
  </div>
</template>
wizreck
