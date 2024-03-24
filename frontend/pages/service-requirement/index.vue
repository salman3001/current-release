<script setup lang="ts">
import { date } from "quasar";

const customFetch = useCustomFetch();
const page = ref(1);
const filterModal = ref(false);
const modal = modalStore();
const filter = ref(null);

const query = computed(() =>
  filter.value === "active"
    ? {
      where_accepted_bid_id: 0,
    }
    : filter.value === "accepted"
      ? {
        where_accepted_bid_id: 1,
      }
      : filter.value === "expired"
        ? {
          where_expires_at_lt: date.formatDate(Date.now(), "YYYY/MM/DD hh:mm:ss")
        }
        : {}
);

const {
  data: serviceRequirements,
  pending,
  refresh,
} = await useAsyncData(async () => {
  const data = await customFetch<IPageRes<IServiceRequirement[]>>(
    apiRoutes.service_requirements.my_list,
    {
      query: {
        page: page.value,
        orderBy: 'created_at:desc',
        descending: "false",
        ...query.value,
      } as IQs,
    }
  );

  return data.data;
});
</script>

<template>
  <div class="q-gutter-y-xl">
    <br />
    <div class="row justify-between q-gutter-md">
      <h4>Service Requirements</h4>
      <div class="q-gutter-x-sm">
        <q-btn flat icon="filter_alt" class="btn-grey" @click="filterModal = true" />
        <q-btn color="primary" @click="
          modal.togel('webPostRequirement', {
            onSuccess: () => {
              refresh();
            },
          })
          ">+ Post A Requirement</q-btn>
      </div>
    </div>
    <div class="q-gutter-lg">
      <div class="row items-center q-gutter-x-md">
        <q-badge v-if="filter" icon="filter_alt" class="btn-grey q-badge-primary q-pa-md normalcase text-subtitle1"
          :label="'filtering by ' + filter" /><q-btn v-if="filter" flat round size="sm" class="btn-grey" icon="close"
          @click="() => {
          filter = null;
          refresh();
        }
          "></q-btn>
      </div>
      <div style="max-width: 95vw">
        <div class="q-gutter-y-md">
          <div v-if="pending" v-for="n in 5">
            <SkeletonBase type="list" />
          </div>
          <div v-else v-for="requirement in serviceRequirements?.data">
            <WebRequirementCard :requirement="requirement" />
          </div>
          <PaginateComponet :page="page" :meta="serviceRequirements?.meta" @update:model-value="refresh" />
          <q-dialog v-model="filterModal">
            <q-card style="width: 100%">
              <q-toolbar color="primary">
                <q-toolbar-title><span class="text-weight-bold">Filter Services</span></q-toolbar-title>
                <q-btn flat dense icon="close" v-close-popup />
              </q-toolbar>

              <q-card-section class="column q-pa-lg">
                <div>
                  <h6>Sorty By</h6>
                  <div class="q-gutter-sm">
                    <q-radio v-model="filter" val="active" label="Active" />
                    <q-radio v-model="filter" val="accepted" label="Accepted" />
                    <q-radio v-model="filter" val="expired" label="Expired" />
                  </div>
                </div>
                <div class="row justify-end">
                  <q-btn label="Apply" color="primary" @click="() => {
          refresh();
          filterModal = false;
        }
          " />
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
