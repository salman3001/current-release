<script setup lang="ts">
import { date } from "quasar";
defineProps<{
  requirement: IServiceRequirement;
}>();

const route = useRoute();
const getImageUrl = useGetImageUrl();
</script>

<template>
  <NuxtLink :to="routes.vendor.service_requirements.view(requirement.id)" class="text-nutral">
    <q-card elevated class="my-card shadow-9" bordered>
      <q-item>
        <q-item-section avatar>
          <q-avatar>
            <img :src="getImageUrl(
    requirement?.user?.profile?.avatar?.url,
    '/images/sample-dp.png'
  )
    " />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>
            {{ requirement?.user?.first_name }}
            {{ requirement?.user?.last_name }}</q-item-label>
          <q-item-label caption> Mumbai, India </q-item-label>
        </q-item-section>
        <q-item-section class="row items-end item">
          <q-item-section>
            <q-item-label caption>
              {{
    date.formatDate(requirement.created_at, "DD/MM/YYYY hh:mmA")
  }}</q-item-label>
          </q-item-section>
        </q-item-section>
      </q-item>

      <q-separator />
      <q-card-section>
        <p class="text-h6">
          {{ requirement.title }}
        </p>
        <div class="normalcase text-bold row items-center">

          <span class="text-h6 text-bold">&#x20B9;{{ requirement.budget }}</span> &nbsp;&nbsp;<q-badge
            class="text-body2 text-black q-px-md q-badge-info">{{
    requirement.budget_type
  }}</q-badge>
        </div>
        <p>
          Category:
          <NuxtLink :to="$config.public.webBaseUrl +
    routes.home +
    `?tab=${requirement?.serviceCategory.id}`
    " :external="true" target="_blank" class="underline">{{ requirement?.serviceCategory?.name }}</NuxtLink>
        </p>
      </q-card-section>
    </q-card>
  </NuxtLink>
</template>
