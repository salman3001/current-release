<script setup lang="ts">
const props = defineProps<{
  category: IServiceCategory;
}>();

const iconUrl = props.category?.thumbnail?.url
  ? `img:${props.category?.thumbnail?.url}`
  : "category";
</script>

<template>
  <NuxtLink :to="routes.services_by_category(category.slug)">
    <div
      class="row justify-center items-center text-center cursor-pointer text-muted text-caption"
      style="max-width: 100px"
    >
      <div class="col-12 row justify-center">
        <q-icon :name="iconUrl" size="30px"></q-icon>
      </div>
      <div class="col-12">
        <span>{{ category?.name }}</span>
      </div>
    </div>
  </NuxtLink>
</template>
