<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const props = defineProps<{
  type?: "active" | "completed" | "expired";
}>();

const customFetch = useCustomFetch();
const page = ref(1);

const query =
  props.type === "active"
    ? {
        whereNull: "accepted_bid_id",
      }
    : props.type === "completed"
    ? {
        whereNotNull: "accepted_bid_id",
      }
    : props.type === "expired"
    ? {
        where: {
          expires_at: ["<", date.formatDate(Date.now(), "YYYY/MM/DD hh:mm:ss")],
        },
      }
    : {};

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
        sortBy: "created_at",
        descending: "true",
        ...query,
      } as AdditionalParams,
    }
  );

  return data.data;
});
</script>

<template>
  <div class="q-gutter-y-md">
    <div v-if="pending" v-for="n in 5">
      <SkeletonBase type="list" />
    </div>
    <div v-else v-for="requirement in serviceRequirements?.data">
      <q-card flat bordered class="q-gutter-y-none full-width">
        <q-card-section>
          <ClientOnly>
            <p class="text-muted flex gap-100">
              Posted on
              {{ date.formatDate(requirement.created_at, "DD/MM/YYYY hh:mmA") }}
              <q-badge
                color="warning"
                outline
                v-if="!requirement.accepted_bid_id"
                >Active</q-badge
              >
              <q-badge
                color="green"
                outline
                v-else-if="requirement.accepted_bid_id != null"
                >Completed</q-badge
              >
              <q-badge
                color="negative"
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
            </p>
          </ClientOnly>

          <p class="text-h5">{{ requirement.title }}</p>
          <div class="normalcase text-bold">
            Budget Type: {{ requirement.budget_type }}
          </div>
          <div class="text-bold">Budget: &#x20B9;{{ requirement.budget }}</div>
          <p>
            Category:
            <NuxtLink class="underline">{{
              requirement?.serviceCategory?.name
            }}</NuxtLink>
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
            <div>
              Avg. Proposal Price : &#x20B9;{{
                new BigNumber(requirement.meta?.avgBidPrice || 0).toFixed(2)
              }}
            </div>
            <div>
              {{ requirement?.meta?.bidCount }} Proposals Recieved |
              <q-icon name="location_on" size="20px" color="primary"></q-icon
              >Jarkhand, India
            </div>
          </div>
          <NuxtLink :to="routes.view_service_requirement(requirement.id)">
            <q-btn color="primary"> View Detail </q-btn>
          </NuxtLink>
        </q-card-section>
      </q-card>
    </div>
    <PaginateComponet
      :page="page"
      :meta="serviceRequirements?.meta"
      @update:model-value="refresh"
    />
  </div>
</template>
