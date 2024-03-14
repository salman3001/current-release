<script setup lang="ts">
const customFetch = useCustomFetch();
const categroySlug = useRoute().params.slug as string;

const page = ref(1);

const { data: category } = await useAsyncData(
  "service-category-" + categroySlug,
  async () => {
    const data = await customFetch<IResType<IServiceCategory>>(
      apiRoutes.service_category_view_by_slug(categroySlug)
    );

    return data.data;
  }
);

const {
  data: services,
  refresh,
  pending: servicesPending,
} = await useAsyncData(() =>
  customFetch<IPageRes<IService[]>>(apiRoutes.services, {
    query: {
      page: page.value,
      where: {
        service_category_id: ["=", category.value!.id as unknown as string],
      },
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
    } as AdditionalParams,
  })
);
</script>

<template>
  <div
    class="row q-col-gutter-lg q-mt-sm q-pa-sm q-pa-sm-md q-pa-md-lg q-pa-lg-xl"
  >
    <div
      v-if="servicesPending"
      v-for="i in 6"
      class="col-12 col-sm-6 col-md-4 col-lg-3"
      :key="i"
    >
      <SkeletonBase type="card" />
    </div>
    <div
      v-for="s in services?.data.data"
      v-else
      class="col-12 col-sm-6 col-md-4 col-lg-3"
      :key="s.id"
    >
      <WebServiceCard :service="s" />
    </div>
    <div class="col-12">
      <PaginateComponet
        :page="page"
        :meta="services?.data.meta"
        @update:model-value="(v: number) => { page = v; refresh() }"
      />
    </div>
  </div>
</template>
