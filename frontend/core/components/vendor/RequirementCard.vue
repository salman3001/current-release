<script setup lang="ts">
import { date } from "quasar";
defineProps<{
  requirement: IServiceRequirement;
}>();

const route = useRoute();
const getImageUrl = useGetImageUrl();
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
        </ClientOnly>
      </div>
    </q-toolbar>
    <q-card-section>
      <div class="row gap-50">
        <q-avatar size="72px">
          <img
            :src="
              getImageUrl(
                requirement?.user?.profile?.avatar?.url,
                '/images/sample-dp.png'
              )
            "
          />
        </q-avatar>
        <div class="column justify-center">
          <p class="text-bold text-subtitle1">
            {{ requirement?.user?.first_name }}
            {{ requirement?.user?.last_name }}
          </p>
        </div>
      </div>
      <br />
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
      <div
        class="row items-center q-gutter-sm"
        v-if="route.path == routes.vendor.service_requirements.list"
      >
        <NuxtLink :to="routes.vendor.service_requirements.view(requirement.id)">
          <q-btn color="primary"> View Detail </q-btn>
        </NuxtLink>
      </div>
    </q-card-section>
  </q-card>
</template>
