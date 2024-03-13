<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const route = useRoute();
const customFetch = useCustomFetch();
const page = ref(1);
const sortBy = ref('created_at')
const descending = ref('false')
const join = ref<string[][]>([])
const select = ref(['*'])

const { data, refresh: refreshRequirement } = await useAsyncData(
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
                  select: ["first_name", "last_name", "id", 'avg_rating', 'business_name'],
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
  refresh: refreshBids,
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
          page: page.value,
          join: join.value,
          descending: descending.value,
          select: select.value,
          sortBy: sortBy.value,

        } as AdditionalParams,
      }
    );

    return data.data;
  }
);

const sortByVendorRating = () => {
  sortBy.value = 'vendor_users.avg_rating'
  select.value = ['bids.*']
  descending.value = 'false'
  join.value = [['vendor_users', 'bids.vendor_user_id', 'vendor_users.id']]
  refreshBids()
}

const sortByLowestPrice = () => {
  sortBy.value = 'offered_price'
  select.value = ['*']
  descending.value = 'false'
  join.value = []
  refreshBids()

}


const refreshData = () => {
  refreshRequirement()
  refreshBids()
}


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
        <q-badge color="warning" outline v-if="!data?.serviceRequirement?.accepted_bid_id">Active</q-badge>
        <q-badge color="green" outline v-else-if="data?.serviceRequirement?.accepted_bid_id">Completed</q-badge>
        <q-badge color="negative" outline v-else-if="date.getDateDiff(
        data?.serviceRequirement?.expires_at,
        Date.now(),
        'minutes'
      ) < 0
        ">Expired</q-badge>
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
          <q-icon name="location_on" size="20px" color="primary"></q-icon>Jarkhand, India
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
      <q-separator />
      <br>
      <br>
      <div class="row">
        <div v-if="!data?.acceptedBid" class="text-h6 q-py-lg">
          <p>
            You haven't accepted any proposal yet. Please accept a proposal
          </p>
          <br />
        </div>
        <WebProposalCard v-else :accepted="true" :bid="data?.acceptedBid"
          :any-bid-accepted="data.acceptedBid ? true : false" @bid-rejected="refreshData" />
      </div>
      <br>
      <br>
      <q-separator />
      <br>

      <div class="q-gutter-y-md">
        <div class="row justify-between items-center q-gutter-y-md">
          <div>
            <h6>Proposals Recieved</h6>
          </div>
          <div class="q-gutter-md">
            <q-btn color="secondary" :outline="sortBy != 'vendor_users.avg_rating'" icon="filter_alt" left
              @click="sortByVendorRating">Top Ratted</q-btn>
            <q-btn color="secondary" :outline="sortBy != 'offered_price'" icon="filter_alt" left
              @click="sortByLowestPrice">Lowest Price</q-btn>
          </div>
        </div>
        <br />

        <div>
          <div v-if="pending">
            <SkeletonBase type="list" v-for="i in 3" :key="i"></SkeletonBase>
          </div>
          <div v-else class="q-gutter-y-md">
            <WebProposalCard v-for="bid in recivedBids?.data" :accepted="false" :bid="bid"
              :any-bid-accepted="data?.acceptedBid ? true : false" @bid-accpted="refreshData" />
          </div>
          <PaginateComponet :page="page" :meta="recivedBids?.meta" @update:model-value="(v) => {
        page = v;
        refreshBids();
      }
        " />
        </div>
      </div>
    </div>
  </div>
</template>
