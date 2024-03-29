<script setup lang="ts">
const color = ref("grey-4");

defineProps<{ service: IService }>();
</script>

<template>
  <q-card class="my-card relative-position shadow-10 border" style="height: 13  0px;">
    <q-card-section horizontal>
      <q-card-section class="row full-width q-gutter-sm q-pa-xs">
        <div class="col">
          <NuxtLink :to="routes.view_service(service?.slug)">
            <q-img src="/images/sample-cover.jpg" width="100%" height="100%" class="rounded-borders" />
          </NuxtLink>
        </div>
        <div class="col q-gutter-sm">
          <div class="row items-center q-gutter-xs">
            <q-icon name="star" color="yellow-9" size="20px"></q-icon><span class="subtitle1">{{
            service.avg_rating }} |
              15 Reviews</span>
          </div>
          <div class="row justify-between items-center">
            <NuxtLink :to="routes.view_service(service?.slug)">
              <div class="col text-subtitle-1 text-bold ellipsis text-nutral ellipsis-2-lines"
                style="text-wrap:  wrap;">
                {{ service?.name }}
              </div>
            </NuxtLink>
          </div>
          <div class="row justify-between">
            <div class="">
              <span>
                {{ service.variants?.length ? 1 && "Starting From" : "" }}</span><span class="text-bold text-">
                &#x20B9;{{
            service.variants?.length > 1
              ? service?.meta?.starting_from
              : service?.variants[0]?.price
                }}</span>
            </div>

          </div>
        </div>
      </q-card-section>


    </q-card-section>


  </q-card>
</template>
