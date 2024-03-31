<script setup lang="ts">
const getImageUrl = useGetImageUrl();

defineProps<{ service: IService }>();
</script>

<template>
  <q-card
    class="my-card relative-position shadow-10 border"
    style="height: 13 0px"
  >
    <q-card-section horizontal>
      <q-card-section class="row full-width q-gutter-sm q-pa-xs">
        <div class="col-4">
          <NuxtLink :to="routes.view_service(service?.slug)">
            <q-img
              :src="
                getImageUrl(
                  service.images?.[0]?.file?.breakpoints?.thumbnail?.url
                )
              "
              width="100%"
              height="100%"
              style="max-width: 150px"
              class="rounded-borders"
            />
          </NuxtLink>
        </div>
        <div class="col-7 q-gutter-sm">
          <div class="row items-center q-gutter-xs">
            <q-icon name="star" color="yellow-9" size="20px"></q-icon
            ><span class="subtitle1"
              >{{ service.avg_rating }} | 15 Reviews</span
            >
          </div>
          <div class="row justify-between items-center">
            <NuxtLink :to="routes.view_service(service?.slug)">
              <div
                class="col text-h6 text-bold ellipsis text-nutral ellipsis-2-lines"
                style="text-wrap: wrap"
              >
                {{ service?.name }}
              </div>
            </NuxtLink>
          </div>
          <div class="row justify-between">
            <div class="">
              <span>
                {{ service.variants?.length ? 1 && "Starting From" : "" }}</span
              ><span class="text-bold text-h6">
                &#x20B9;{{
                  service.variants?.length > 1
                    ? service?.meta?.starting_from
                    : service?.variants[0]?.price
                }}</span
              >
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
