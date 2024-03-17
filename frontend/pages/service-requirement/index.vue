<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const customFetch = useCustomFetch();
const page = ref(1);
const filterModal = ref(false)
const modal = modalStore()
const filter = ref(null)

const query = computed(() =>
  filter.value === "active"
    ? {
      whereNull: "accepted_bid_id",
    }
    : filter.value === "accepted"
      ? {
        whereNotNull: "accepted_bid_id",
      }
      : filter.value === "expired"
        ? {
          where: {
            expires_at: ["<", date.formatDate(Date.now(), "YYYY/MM/DD hh:mm:ss")],
          },
        }
        : {})

const {
  data: serviceRequirements,
  pending,
  refresh,
} = await useAsyncData(async () => {
  const data = await customFetch<IPageRes<IServiceRequirement[]>>(
    apiRoutes.service_requirements_my_list,
    {
      query: {
        page: page.value,
        preload: [
          {
            serviceCategory: {
              select: ["name"],
            },
          },
        ],
        withCount: [
          {
            relation: "recievedBids",
            as: "bidCount",
          },
        ],
        withAggregate: [
          {
            aggregator: "avg",
            relation: "recievedBids",
            field: "offered_price",
            as: "avgBidPrice",
          },
        ],
        descending: "true",
        ...query.value,
      } as AdditionalParams,
    }
  );

  return data.data;
});
</script>

<template>
  <div class="q-gutter-y-xl">
    <br>
    <div class="row justify-between q-gutter-md">
      <h4>Service Requirements</h4>
      <div class="q-gutter-x-sm">
        <q-btn flat icon="filter_alt" class="btn-grey" @click="filterModal = true" />
        <q-btn color="primary" @click="modal.togel('webPostRequirement', {
          onSuccess: () => { refresh() }
        })">+ Post A Requirement</q-btn>
      </div>

    </div>
    <div class="q-gutter-lg">
      <div class="row items-center q-gutter-x-md">
        <q-badge v-if="filter" icon="filter_alt" class="btn-grey q-badge-primary q-px-md normalcase text-subtitle1"
          :label="'filtering by ' + filter" /><q-btn v-if="filter" flat round size="sm" class="btn-grey" icon="close"
          @click="() => { filter = null; refresh() }"></q-btn>
      </div>
      <div style="max-width: 95vw">
        <div class="q-gutter-y-md">
          <div v-if="pending" v-for="n in 5">
            <SkeletonBase type="list" />
          </div>
          <div v-else v-for="requirement in serviceRequirements?.data">
            <q-card class="q-gutter-y-none full-width shadow-16">
              <q-toolbar class="justify-between">
                <div>
                  <q-icon name="location_on" size="30px" color="muted"></q-icon> Jarkhand, India
                </div>

                <div>
                  <br>
                  <ClientOnly>
                    <div>
                      {{ date.formatDate(requirement.created_at, "DD/MM/YYYY hh:mmA") }}
                    </div>

                    <div class="row " :class="$q.screen.xs ? 'justify-end' : 'justify-end'">

                      <q-badge class="q-badge-warning text-body2" outline
                        v-if="!requirement.accepted_bid_id">Active</q-badge>
                      <q-badge class="q-badge-positive text-body2" outline
                        v-else-if="requirement.accepted_bid_id != null">Completed</q-badge>
                      <q-badge class="q-badge-negative text-body2" outline v-else-if="date.getDateDiff(
          requirement.expires_at,
          Date.now(),
          'minutes'
        ) < 0
          ">Expired</q-badge>
                    </div>
                  </ClientOnly>
                </div>
              </q-toolbar>
              <q-card-section>
                <p class="text-h6">{{ requirement.title }} Lorem ipsum dolor sit amet.</p>
                <div class="normalcase text-bold row items-center">
                  <q-badge class="text-body2 text-black q-px-md q-badge-info">{{ requirement.budget_type
                    }}</q-badge>&nbsp;&nbsp;
                  <span class="text-h6 text-bold">&#x20B9;{{
          requirement.budget
        }}</span>
                </div>
                <p>
                  Category:
                  <NuxtLink :to="{ path: routes.home, query: { tab: requirement.service_category_id } }"
                    class="underline">{{
          requirement?.serviceCategory?.name
        }}</NuxtLink>
                </p>
              </q-card-section>

              <q-card-section>
                <p class="text-subtitle1 text-muted">
                  {{ requirement.desc }}
                </p>
              </q-card-section>

              <q-card-section class="row items-center justify-between q-gutter-y-md">
                <div class="row q-gutter-sm">
                  <p>#Keywords</p>
                  <p>#Keywords</p>
                  <p>#Keywords</p>
                </div>
                <div class="row items-center q-gutter-sm">
                  <q-badge class="text-body2 q-px-md q-badge-info"><q-icon name="messages" /> &nbsp;Bids&nbsp;
                    <span class="text-bold text-body1">{{
          requirement?.meta?.bidCount }}</span></q-badge>
                  <q-badge class="text-body2 q-px-sm q-badge-positive "> <q-icon name="money" /> &nbsp; Avg. Price
                    &nbsp;
                    <span class="text-bold text-body1">&#x20B9;{{
          new BigNumber(requirement.meta?.avgBidPrice || 0).toFixed(2)
        }}</span> </q-badge>
                  <q-badge class="text-body2 q-px-sm q-badge-negative"><q-icon name="done" />&nbsp;Accepted Bid&nbsp;
                    <span class="text-bold text-body1"> {{ requirement.accepted_bid_id ? 1 : 0 }}</span></q-badge>
                  <NuxtLink :to="routes.view_service_requirement(requirement.id)">
                    <q-btn color="primary"> View Detail </q-btn>
                  </NuxtLink>
                </div>
              </q-card-section>
            </q-card>
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
                  <q-btn label="Apply" color="primary" @click="()=>{
          refresh();filterModal=false
        }" />
                </div>
              </q-card-section>
            </q-card>
          </q-dialog>
        </div>
      </div>
    </div>
  </div>
</template>
