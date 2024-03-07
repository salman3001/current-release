<script setup lang="ts">
import type { AdditionalParams } from "~/types/QueryParamsTypes";
import qs from 'qs'
const customFetch = useCustomFetch();

const page = ref(1);



const { data, error } = await useAsyncData("web-home", async () => {
  const [categories] = await Promise.all([
    customFetch<IResType<IServiceCategory[]>>(apiRoutes.service_categories,),
  ]);

  return {
    categories: categories?.data || [],
  };
});

const query = {
  populate: {
    variants: {
      fields: ['id', 'price']
    },
    reviews: {
      fields: ['rating']
    },

  }
} as AdditionalParams

const {
  data: services,
  refresh,
  pending: servicesPending,
} = useAsyncData(() =>
  customFetch<IPageRes<IService[]>>(apiRoutes.services + `?${qs.stringify(query)}`, {
    params: { page: page.value } as AdditionalParams,
  })
);
</script>

<template>
  <div class="row q-px-sm q-px-sm-md items-center q-gutter-sm" style="border-bottom: 1px solid lightgrey">
    <ScrollArea height="100px" width="100%" class="col">
      <div class="row no-wrap q-py-md q-gutter-x-xl no-scroll">
        <WebCategoryIcon" v-if="!error" v-for="c in data?.categories" :category="c" />
      </div>
    </ScrollArea>
  </div>
  <div class="q-pa-md">
    <div>
      <h2 class="text-h6 text-bold q-my-none">Popular Categories</h2>
      <p class="text-muted">A list of most popular categories</p>
      <div>
        <WebCategoryCrousel v-if="!error" :category="data?.categories" />
      </div>
    </div>
  </div>

  <div class="q-pa-md">
    <div>
      <h2 class="text-h6 text-bold q-my-none">Top Rated Services</h2>
      <p class="text-muted">A list of top rated services</p>
      <div class="row q-col-gutter-lg q-mt-sm">
        <div v-if="servicesPending" v-for="s in 10" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <CardSekeleton />
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
