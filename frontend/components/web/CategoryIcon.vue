<script setup lang="ts">
const props = defineProps<{
  category: IServiceCategory;
}>();

const iconUrl = props.category?.thumbnail?.url
  ? `img:${props.category?.thumbnail?.url}`
  : "category";
</script>

<template>
  <NuxtLink :to="routes.services_by_category(category.name)">
    <div
      class="row justify-center items-center text-center cursor-pointer text-muted"
    >
      <div class="col-12 row justify-center">
        <q-icon :name="iconUrl" size="40px"></q-icon>
      </div>
      <div class="col-12">
        <p>{{ category?.name }}</p>
      </div>
    </div>
  </NuxtLink>
</template>
