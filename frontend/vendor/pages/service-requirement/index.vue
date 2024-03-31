<script setup lang="ts">
const customFetch = useCustomFetch();
const page = ref(1);
const filterModal = ref(false);
const filter = ref(null);

const {
  data: serviceRequirements,
  pending,
  refresh,
} = await useAsyncData(async () => {
  const data = await customFetch<IPageRes<IServiceRequirement[]>>(
    apiRoutes.service_requirements.list,
    {
      query: {
        page: page.value,
        orderBy: "created_at:desc",
        where_accepted_bid_id: "",
      } as IQs,
    }
  );

  return data.data;
});
</script>

<template>
  <br />
  <div class="row items-center justify-end q-gutter-x-md">
    <q-btn
      v-if="filter"
      flat
      round
      size="sm"
      class="btn-grey"
      icon="close"
      @click="
        () => {
          filter = null;
          refresh();
        }
      "
    ></q-btn>
    <q-btn
      round
      icon="tune"
      size="sm"
      flat
      class="btn-grey"
      rounded
      @click="filterModal = true"
    >
      <q-tooltip class="bg-primary"> Fliters </q-tooltip>
    </q-btn>
  </div>
  <br />
  <div>
    <div v-if="pending" v-for="n in 5">
      <SkeletonBase type="list" />
    </div>
    <div
      v-else
      v-for="requirement in serviceRequirements?.data"
      class="row q-col-gutter-md"
    >
      <div class="col-12 col-sm-6 col-md-4">
        <VendorRequirementCard :requirement="requirement" />
      </div>
    </div>
    <PaginateComponet
      :page="page"
      :meta="serviceRequirements?.meta"
      @update:model-value="refresh"
    />
    <q-dialog v-model="filterModal">
      <q-card style="width: 100%">
        <q-toolbar color="primary">
          <q-toolbar-title
            ><span class="text-weight-bold"
              >Apply Filters
            </span></q-toolbar-title
          >
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="column q-pa-lg">
          <div>
            <h6>Sorty By</h6>
            <div class="q-gutter-sm">
              <q-radio v-model="filter" val="created_at:desc" label="Active" />
            </div>
          </div>
          <div class="row justify-end">
            <q-btn
              label="Apply"
              color="primary"
              @click="
                () => {
                  refresh();
                  filterModal = false;
                }
              "
            />
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
