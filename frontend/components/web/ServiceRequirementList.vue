<script setup lang="ts">
import { date } from 'quasar'

const props = defineProps<{
  type?: "active" | "completed" | "expired"
}>()

const customFetch = useCustomFetch()
const page = ref(1)

const query = props.type === 'active' ? {
  whereNull: 'accepted_bid_id'
} : props.type === "completed" ? {
  whereNotNull: 'accepted_bid_id'
} : {}



const { data: serviceRequirements, pending, refresh } = useAsyncData(async () => {
  const data = await customFetch<IPageRes<IServiceRequirement[]>>(apiRoutes.service_requirements_my_list, {
    query: {
      page: page.value,
      populate: {
        serviceCategory: {
          fields: ['name']
        }
      },
      ...query
    } as AdditionalParams
  })

  return data.data
})

</script>

<template>
  <div class="q-gutter-y-md">
    <div v-if="pending" v-for="n in 5">
      <SkeletonBase type="list" />
    </div>
    <div v-else v-for="requirement in serviceRequirements?.data">
      <q-card flat bordered class="q-gutter-y-none full-width">
        <q-card-section>
          <p class="text-muted flex gap-100">
            Posted on {{ date.formatDate(requirement.created_at, 'DD/MM/YYYY hh:mmA') }}
            <q-badge :color="requirement.acceptedBidId ? 'success' : 'warning'" outline>{{ requirement.acceptedBidId ?
      'Complete' : 'Active' }}</q-badge>
          </p>
          <p class="text-h5"> {{ requirement.title }}</p>
          <div class="normalcase text-bold">Budget Type: {{ requirement.budget_type }}</div>
          <div class="text-bold">Budget: &#x20B9;{{ requirement.budget }}</div>
          <p>Category: <NuxtLink class="underline">{{ requirement?.serviceCategory?.name }}</NuxtLink>
          </p>
        </q-card-section>
        <q-separator inset />
        <q-card-section>
          <p class="text-subtitle1 text-muted">
            {{ requirement.desc }}
          </p>
        </q-card-section>

        <q-card-section class="row justify-between q-gutter-y-md">
          <div class="column">
            <div>Avg. Proposal Price : &#x20B9;70</div>
            <div>
              50+ Proposals |
              <q-icon name="location_on" size="20px" color="primary"></q-icon>Jarkhand, India
            </div>
          </div>
          <NuxtLink :to="routes.view_service_requirement(1)">
            <q-btn color="primary"> View Detail </q-btn>
          </NuxtLink>
        </q-card-section>
      </q-card>
    </div>
    <PaginateComponet :page="page" :meta="serviceRequirements?.meta" @update:model-value="refresh" />
  </div>
</template>
