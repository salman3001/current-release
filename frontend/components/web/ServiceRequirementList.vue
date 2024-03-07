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
  <div class="q-gutter-y-md">
    <div v-for="n in 5">
      <q-card flat bordered class="q-gutter-y-none full-width">
        <q-card-section>
          <p class="text-muted flex gap-100">
            Posted Yesterday
            <q-badge color="primary" outline>Active</q-badge>
          </p>
          <p class="text-h5">Needed a pest control service</p>
          <div>Hourly: &#x20B9;50 to &#x20B9;60</div>
          <p>Category: <NuxtLink class="underline">Pest Control</NuxtLink></p>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <p class="text-subtitle1 text-muted">
            Needed a pest control service . Lorem ipsum dolor sit amet
            consectetur adipisicing elit. Animi illo atque incidunt nesciunt id,
            eligendi quaerat corrupti quibusdam deserunt accusamus?
          </p>
        </q-card-section>

        <q-card-section class="row justify-between q-gutter-y-md">
          <div class="column">
            <div>Avg. Proposal Price : &#x20B9;70</div>
            <div>
              50+ Proposals |
              <q-icon name="location_on" size="20px" color="primary"></q-icon
              >Jarkhand, India
            </div>
          </div>
          <NuxtLink :to="routes.view_service_requirement(1)">
            <q-btn color="primary"> View Detail </q-btn>
          </NuxtLink>
        </q-card-section>
      </q-card>
    </div>
  </div>
  <PaginateComponet />
</template>
