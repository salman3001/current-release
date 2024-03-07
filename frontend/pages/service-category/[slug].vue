<script setup lang="ts">
const slug = useRoute().params.slug;

console.log(slug);
</script>

<template>
  <div class="row q-col-gutter-lg q-mt-sm">
    <div v-for="s in 20" class="col-12 col-sm-6 col-md-4 col-lg-3">
      <WebServiceCard />
    </div>
  </div>
</template>
