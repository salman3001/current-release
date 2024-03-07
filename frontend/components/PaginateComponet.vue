<script setup lang="ts">
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 3,
  // rowsNumber: xx if getting data from a server
});

const rows = [1, 2, 3, 5, 5, 7, 8, 9];

const pagesNumber = computed(() =>
  Math.ceil(rows.length / pagination.value.rowsPerPage)
);
</script>

<template>
  <div class="row justify-start q-pa-md">
    <q-pagination
      v-model="pagination.page"
      color="primary"
      :max="pagesNumber"
      size="md"
    />
  </div>
</template>
