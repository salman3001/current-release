<script setup lang="ts">
const route = useRoute();
const customFetch = useCustomFetch();

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
                  select: [
                    "first_name",
                    "last_name",
                    "id",
                    "avg_rating",
                    "business_name",
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

const bidQuery = reactive({
  page: 1,
  sortBy: "created_at",
  descending: "false",
  join: [] as string[][],
  select: ["*"],
  where: {
    id: ["!=", (data.value?.acceptedBid?.id as unknown as string) || 0],
  },
});

const {
  data: recivedBids,
  pending,
  refresh: refreshBids,
} = await useAsyncData(
  "recieved-bids" + route.params.id + bidQuery.page,
  async () => {
    const data = await customFetch<IPageRes<IBid>>(
      apiRoutes.service_requirement_show_bids(
        route.params.id as unknown as number
      ),
      {
        query: {
          preload: [
            {
              vendorUser: {
                select: ["avg_rating"],
              },
            },
          ],
          page: bidQuery.page,
          join: bidQuery.join,
          descending: bidQuery.descending,
          select: bidQuery.select,
          sortBy: bidQuery.sortBy,
          where: bidQuery.where as any,
        } as AdditionalParams,
      }
    );

    return data.data;
  }
);

const sortByVendorRating = () => {
  bidQuery.sortBy = "vendor_users.avg_rating";
  bidQuery.select = ["bids.*"];
  bidQuery.descending = "true";
  bidQuery.join = [["vendor_users", "bids.vendor_user_id", "vendor_users.id"]];
  bidQuery.where = {
    "bids.id": ["!=", (data.value?.acceptedBid?.id as unknown as string) || 0],
  };
  refreshBids();
};

const sortByLowestPrice = () => {
  bidQuery.sortBy = "offered_price";
  bidQuery.select = ["*"];
  bidQuery.descending = "false";
  bidQuery.join = [];
  bidQuery.where = {
    id: ["!=", (data.value?.acceptedBid?.id as unknown as string) || 0],
  };
  refreshBids();
};

const refreshData = async () => {
  await refreshRequirement();
  bidQuery.sortBy = "created_at";
  bidQuery.select = ["*"];
  bidQuery.descending = "false";
  bidQuery.join = [];
  bidQuery.where = {
    id: ["!=", (data.value?.acceptedBid?.id as unknown as string) || 0],
  };
  await refreshBids();
};
</script>

<template>
  <div>
    <br />
    <br />
    <WebRequirementCard :requirement="data?.serviceRequirement!" />
    <br />
    <br />
    <div class="" style="max-width: 95vw">
      <div>
        <h6 class="text-bold">Acceped Bid</h6>
      </div>
      <br />

      <div class="row">
        <div v-if="!data?.acceptedBid" class="text-subtitle1">
          <p>You haven't accepted any bid yet. Please accept a bid</p>
          <br />
        </div>
        <WebProposalCard
          v-else
          :accepted="true"
          :bid="data?.acceptedBid"
          :any-bid-accepted="data.acceptedBid ? true : false"
          :requirement-id="data.serviceRequirement.id"
          @bid-rejected="refreshData"
        />
      </div>
      <br />
      <br />
      <div class="q-gutter-y-md">
        <div class="row justify-between items-center q-gutter-y-md">
          <div>
            <h6 class="text-bold">Bids Recieved</h6>
          </div>
          <div class="row items-center q-gutter-sm">
            <q-badge
              class="q-badge-primary text-subtitle1"
              v-if="bidQuery.sortBy == 'vendor_users.avg_rating'"
              >Sorting by Top Rating</q-badge
            >
            <q-badge
              class="q-badge-primary text-subtitle1"
              v-if="bidQuery.sortBy == 'offered_price'"
              >Sorting by Lowest Price</q-badge
            >

            <q-btn-dropdown
              outline
              icon="filter_alt"
              color="primary"
              label="Filter"
            >
              <q-list style="" dense>
                <q-item clickable v-ripple @click="sortByVendorRating">
                  <q-item-section> Highest Rating </q-item-section>
                </q-item>
                <q-separator inset />
                <q-item clickable v-ripple @click="sortByLowestPrice">
                  <q-item-section>Lowest Price</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
        <br />

        <div>
          <div v-if="pending">
            <SkeletonBase type="list" v-for="i in 3" :key="i"></SkeletonBase>
          </div>
          <div v-else class="row q-gutter-md">
            <WebProposalCard
              v-for="bid in recivedBids?.data"
              :accepted="false"
              :bid="bid"
              :any-bid-accepted="data?.acceptedBid ? true : false"
              @bid-accpted="refreshData"
            />
          </div>
          <PaginateComponet
            :page="bidQuery.page"
            :meta="recivedBids?.meta"
            @update:model-value="
              (v) => {
                bidQuery.page = v;
                refreshBids();
              }
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
