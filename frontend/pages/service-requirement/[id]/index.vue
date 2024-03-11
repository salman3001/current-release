<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const tab = ref("Accepted Proposal");
const route = useRoute();
const customFetch = useCustomFetch();
const page = ref(1);

const { data } = await useAsyncData(
  ("service-requirement" + route.params.id) as string,
  async () => {
    const [serviceRequirement, acceptedBid] = await Promise.all([
      customFetch<IResType<IServiceRequirement>>(
        apiRoutes.service_requirements_view(
          route.params.id as unknown as number
        ),
        {
          query: {
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
          } as AdditionalParams,
        }
      ),
      customFetch<IResType<IBid>>(
        apiRoutes.service_requirement_show_accepted_bid(
          route.params.id as unknown as number
        ),
        {
          query: {
            preload: [
              {
                vendorUser: {
                  select: ["first_name", "last_name", "id"],
                  preload: [
                    {
                      business: {
                        select: ["name"],
                      },
                    },
                  ],
                },
              },
            ],
          } as AdditionalParams,
        }
      ),
    ]);

    return {
      serviceRequirement: serviceRequirement.data,
      acceptedBid: acceptedBid.data,
    };
  }
);

const {
  data: recivedBids,
  pending,
  refresh,
} = await useAsyncData(
  "recieved-bids" + route.params.id + page.value,
  async () => {
    const data = await customFetch<IPageRes<IBid>>(
      apiRoutes.service_requirement_show_bids(
        route.params.id as unknown as number
      ),
      {
        query: {
          where: {
            service_requirement_id: ["=", route.params.id as string],
          },
          preload: [
            {
              vendorUser: {
                select: ["first_name", "last_name", "id"],
              },
            },
          ],
          page: page.value,
        } as AdditionalParams,
      }
    );

    return data.data;
  }
);

watch(page, (n) => {
  console.log(n);
});
</script>

<template>
  <div class="q-pa-md q-pa-md-lg q-pa-lg-xl q-gutter-md">
    <div>
      <NuxtLink :to="routes.service_requirement">
        <q-icon name="keyboard_backspace" size="30px"></q-icon> Go Back
      </NuxtLink>
    </div>
    <h2 class="text-h5 text-bold q-sm">
      {{ data?.serviceRequirement?.title }}
    </h2>
    <div class="q-gutter-xs">
      <p class="text-muted flex gap-100">
        Posted on
        {{
          date.formatDate(
            data?.serviceRequirement?.created_at,
            "DD/MM/YYYY hh:mmA"
          )
        }}
        <q-badge
          color="warning"
          outline
          v-if="!data?.serviceRequirement?.accepted_bid_id"
          >Active</q-badge
        >
        <q-badge
          color="green"
          outline
          v-else-if="data?.serviceRequirement?.accepted_bid_id"
          >Completed</q-badge
        >
        <q-badge
          color="negative"
          outline
          v-else-if="
            date.getDateDiff(
              data?.serviceRequirement?.expires_at,
              Date.now(),
              'minutes'
            ) < 0
          "
          >Expired</q-badge
        >
      </p>
      <p class="text-h5">{{ data?.serviceRequirement?.title }}</p>
      <div class="normalcase">
        Budget Type: {{ data?.serviceRequirement?.budget_type }}
      </div>
      <div class="">Budget: &#x20B9;{{ data?.serviceRequirement?.budget }}</div>
      <div class="column">
        <div>
          Avg. Proposal Price : &#x20B9;{{
            new BigNumber(
              data?.serviceRequirement?.meta?.avgBidPrice || 0
            ).toFixed(2)
          }}
        </div>
        <div>
          Proposals Recieved :
          {{ data?.serviceRequirement?.meta?.bidCount || 0 }}
        </div>
        <div>
          Location
          <q-icon name="location_on" size="20px" color="primary"></q-icon
          >Jarkhand, India
        </div>
      </div>
      <p>
        Category:
        <NuxtLink class="underline">{{
          data?.serviceRequirement?.serviceCategory?.name
        }}</NuxtLink>
      </p>
    </div>
    <p>
      {{ data?.serviceRequirement?.desc }}
    </p>
    <div class="" style="max-width: 95vw">
      <q-tabs
        dense
        v-model="tab"
        class="text-grey q-mt-md"
        active-color="white"
        indicator-color="secondary"
        active-bg-color="primary"
        align="left"
      >
        <q-tab name="Accepted Proposal" label="Accepted Proposal" />
        <q-tab name="Proposals Recieved" label="Proposals Recieved"
          ><q-badge color="red" floating style="top: -0px; right: -25px">{{
            data?.serviceRequirement?.meta?.bidCount || 0
          }}</q-badge></q-tab
        >
      </q-tabs>
      <q-separator />

      <q-tab-panels class="q-pa-0 bg-nutral" v-model="tab" animated>
        <q-tab-panel name="Accepted Proposal">
          <div class="row">
            <div v-if="!data?.acceptedBid" class="text-h6 q-py-lg">
              <p>
                You haven't accepted any proposal yet. Please accept a proposal
              </p>
              <br />
              <q-btn outline color="primary" @click="tab = 'Proposals Recieved'"
                >View Proposals</q-btn
              >
            </div>
            <WebProposalCard v-else :accepted="true" :bid="data?.acceptedBid" />
          </div>
        </q-tab-panel>

        <q-tab-panel name="Proposals Recieved">
          <div class="q-gutter-y-md">
            <div class="row justify-end q-gutter-sm">
              <q-btn color="secondary" outline icon="filter_alt" left
                >Top Ratted</q-btn
              ><q-btn color="secondary" outline icon="filter_alt" left
                >Lowest Price</q-btn
              >
            </div>
            <div>
              <div v-if="pending">
                <SkeletonBase
                  type="list"
                  v-for="i in 3"
                  :key="i"
                ></SkeletonBase>
              </div>
              <WebProposalCard
                v-else
                v-for="bid in recivedBids?.data"
                :accepted="false"
                :bid="bid"
              />
              <PaginateComponet
                :page="page"
                :meta="recivedBids?.meta"
                @update:model-value="
                  (v) => {
                    page = v;
                    refresh();
                  }
                "
              />
            </div>
          </div>
        </q-tab-panel>
      </q-tab-panels>
    </div>
  </div>
</template>
