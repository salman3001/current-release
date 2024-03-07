<script setup lang="ts">
defineProps<{
  variant: IServiceVariant
}>()
</script>

<template>
  <div @click="$emit('variant-selection', variant)">
    <q-img src="/images/service-category-placeholder.jpg" style="width: 150px; height: 100px"
      class="cols-2 cols-sm-3 cols-md-4 cols-lg-5">
    </q-img>
    <div class="">{{ variant?.name }}</div>
    <div class="">&#x20B9;{{ variant?.price }}</div>
  </div>
</template>
