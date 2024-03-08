<script setup lang="ts">
defineProps<{
  variant: IServiceVariant,
  selectedId: number
}>()
</script>

<template>
  <div @click="$emit('variant-selection', variant)" class="rounded-borders q-pa-sm cursor-pointer"
    :class="selectedId == variant.id ? 'border-primary border-2' : 'border'">
    <q-img src="/images/service-category-placeholder.jpg" style="width: 150px; height: 100px"
      class="cols-2 cols-sm-3 cols-md-4 cols-lg-5 rounded-borders ">
    </q-img>
    <div class="">{{ variant?.name }}</div>
    <div class="text-bold">&#x20B9;{{ variant?.price }}</div>
  </div>
</template>
