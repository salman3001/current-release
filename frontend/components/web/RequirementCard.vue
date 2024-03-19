<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";
defineProps<{
  requirement: IServiceRequirement;
}>();
</script>

<template>
  <q-card bordered class="q-gutter-y-none full-width shadow-16">
    <q-toolbar class="justify-between">
      <div>
        <q-icon name="location_on" size="30px" color="muted"></q-icon>
        Jarkhand, India
      </div>

      <div>
        <br />
        <ClientOnly>
          <div>
            {{ date.formatDate(requirement.created_at, "DD/MM/YYYY hh:mmA") }}
          </div>

          <div
            class="row"
            :class="$q.screen.xs ? 'justify-end' : 'justify-end'"
          >
            <q-badge
              class="q-badge-warning text-body2 q-px-md"
              outline
              v-if="!requirement.accepted_bid_id"
              >Active</q-badge
            >
            <q-badge
              class="q-badge-positive text-body2 q-px-md"
              outline
              v-else-if="requirement.accepted_bid_id != null"
              >Accepted</q-badge
            >
            <q-badge
              class="q-badge-negative text-body2 q-px-md"
              outline
              v-else-if="
                date.getDateDiff(
                  requirement.expires_at,
                  Date.now(),
                  'minutes'
                ) < 0
              "
              >Expired</q-badge
            >
          </div>
        </ClientOnly>
      </div>
    </q-toolbar>
    <q-card-section>
      <p class="text-h6">{{ requirement.title }} Lorem ipsum dolor sit amet.</p>
      <div class="normalcase text-bold row items-center">
        <q-badge class="text-body2 text-black q-px-md q-badge-info">{{
          requirement.budget_type
        }}</q-badge
        >&nbsp;&nbsp;
        <span class="text-h6 text-bold">&#x20B9;{{ requirement.budget }}</span>
      </div>
      <p>
        Category:
        <NuxtLink
          :to="{
            path: routes.home,
            query: { tab: requirement.service_category_id },
          }"
          class="underline"
          >{{ requirement?.serviceCategory?.name }}</NuxtLink
        >
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
        <q-badge class="text-body2 q-px-md q-badge-info q-px-lg q-py-xs"
          ><q-icon name="messages" /> &nbsp;Bids&nbsp;
          <span class="text-bold text-body1">{{
            requirement?.meta?.bidCount
          }}</span></q-badge
        >
        <q-badge class="text-body2 q-px-lg q-py-xs q-badge-positive">
          <q-icon name="money" /> &nbsp; Avg. Price &nbsp;
          <span class="text-bold text-body1"
            >&#x20B9;{{
              new BigNumber(requirement.meta?.avgBidPrice || 0).toFixed(2)
            }}</span
          >
        </q-badge>
        <q-badge class="text-body2 q-px-sm q-badge-negative q-px-lg q-py-xs"
          ><q-icon name="done" />&nbsp;Accepted Bid&nbsp;
          <span class="text-bold text-body1">
            {{ requirement.accepted_bid_id ? 1 : 0 }}</span
          ></q-badge
        >
        <NuxtLink :to="routes.view_service_requirement(requirement.id)">
          <q-btn color="primary"> View Detail </q-btn>
        </NuxtLink>
      </div>
    </q-card-section>
  </q-card>
</template>
