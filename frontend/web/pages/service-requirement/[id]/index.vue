<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const route = useRoute();
const customFetch = useCustomFetch();
const bidDetailModal = ref(false);
const negotiateModal = ref(false);
const selectedBid = ref<IBid | null>(null);
const getImageUrl = useGetImageUrl();

const { show } = useServiceRequirementApi.show();
const { showAcceptedBid } = useServiceRequirementApi.showAcceptedBid();

const { data, refresh: refreshRequirement } = await useAsyncData(
  ("service-requirement" + route.params.id) as string,
  async () => {
    const [serviceRequirement, acceptedBid] = await Promise.all([
      show(route.params.id as unknown as number),
      showAcceptedBid(route.params.id as unknown as number),
    ]);

    return {
      serviceRequirement: serviceRequirement.data,
      acceptedBid: acceptedBid.data,
    };
  }
);

const { query: bidQuery, showBids } = useServiceRequirementApi.showBids({
  page: 1,
  orderBy: "created_at:asc",
  orderby_lowest_price: "",
  orderby_avg_rating: "",
});

const {
  data: recivedBids,
  pending,
  refresh: refreshBids,
} = await useAsyncData(
  "recieved-bids" + route.params.id + bidQuery.page,
  async () => {
    const data = await showBids(route.params.id as unknown as number);

    return data.data;
  }
);

const sortByVendorRating = () => {
  bidQuery.orderBy = "";
  bidQuery.orderby_avg_rating = "1";
  bidQuery.orderby_lowest_price = "";
  refreshBids();
};

const sortByLowestPrice = () => {
  bidQuery.orderBy = "";
  bidQuery.orderby_avg_rating = "";
  bidQuery.orderby_lowest_price = "1";
  refreshBids();
};

const refreshData = async () => {
  await refreshRequirement();
  bidQuery.orderBy = "created_at:asc";
  bidQuery.orderby_avg_rating = "";
  bidQuery.orderby_lowest_price = "";
  await refreshBids();
};

const createChat = async () => {
  try {
    const res = await customFetch<IResType<IConversation>>(
      apiRoutes.chat.conversations.create,
      {
        method: "post",
        body: {
          participant: {
            userType: data.value?.acceptedBid?.vendorUser?.userType,
            userId: data.value?.acceptedBid?.vendorUser?.id,
          },
        },
      }
    );

    if (res.success == true) {
      navigateTo({
        path: routes.chats,
        query: {
          newConversationId: res?.data?.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const {
  create: negotiate,
  form: negotiateForm,
  loading: negotiateOnProgress,
} = useServiceRequirementApi.negotiate();
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
          @create-chat="createChat()"
          :any-bid-accepted="data.acceptedBid ? true : false"
          :requirement-id="data.serviceRequirement.id"
          @bid-rejected="refreshData"
          @review="
            (v) => {
              selectedBid = v;
              bidDetailModal = true;
            }
          "
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
              v-if="bidQuery.orderby_avg_rating == '1'"
              >Sorting by Top Rating</q-badge
            >
            <q-badge
              class="q-badge-primary text-subtitle1"
              v-if="bidQuery.orderby_lowest_price == '1'"
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
          <div v-else class="row gap-100">
            <WebProposalCard
              v-for="bid in recivedBids?.data"
              :accepted="false"
              :bid="bid"
              :any-bid-accepted="data?.acceptedBid ? true : false"
              @bid-accpted="refreshData"
              @review="
                (v) => {
                  selectedBid = v;
                  bidDetailModal = true;
                }
              "
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
    <q-dialog v-model="bidDetailModal">
      <q-card style="width: 100%">
        <q-toolbar color="primary">
          <q-toolbar-title
            ><span class="text-weight-bold">Bid Detail</span></q-toolbar-title
          >
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="column q-pa-lg" v-if="selectedBid">
          <div class="row q-gutter-y-md wrap justify-between">
            <div class="row gap-50">
              <q-avatar size="72px">
                <img
                  :src="
                    getImageUrl(
                      selectedBid?.vendorUser?.profile?.avatar?.url,
                      '/images/sample-dp.png'
                    )
                  "
                />
              </q-avatar>
              <div>
                <p
                  v-if="data?.acceptedBid?.id === selectedBid?.id"
                  class="text-bold text-subtitle1"
                >
                  {{ selectedBid?.vendorUser.first_name }}
                  {{ selectedBid?.vendorUser.last_name }}
                  <q-btn
                    size="xs"
                    color="secondary"
                    v-if="data?.acceptedBid?.id === selectedBid?.id"
                    @click="createChat"
                    >chat</q-btn
                  >
                </p>
                <p v-else class="text-bold text-subtitle1">Anonymous</p>
                <div>
                  <NuxtLink :to="routes.home" class="underline">{{
                    selectedBid?.vendorUser?.business_name
                  }}</NuxtLink>
                </div>

                <div>
                  <RatingComponent
                    :rating="selectedBid?.vendorUser?.avg_rating || 0"
                    size="1.25rem"
                  />
                </div>
              </div>
            </div>
            <div>
              <p class="text-muted" style="width: max-content">
                {{
                  date.formatDate(selectedBid?.created_at, "DD/MM/YYYY hh:mmA")
                }}
              </p>
              <q-badge
                v-if="data?.acceptedBid?.id === selectedBid?.id"
                outline
                class="q-badge-positive q-py-sm q-px-md justify-center"
              >
                Accepted</q-badge
              >
            </div>
          </div>
          <br />
          <div class="q-gutter-sm">
            <q-badge
              class="q-badge-primary justify-center"
              style="width: 120px"
            >
              <span class="text-bold text-body1"
                >&#x20B9;{{
                  new BigNumber(selectedBid?.offered_price || 0).toFixed(2)
                }}</span
              ></q-badge
            >
          </div>
          <br />
          <div>
            <p class="text-body-1 ellipsis-3-lines">
              {{ selectedBid?.message }}
            </p>
          </div>
          <div>
            <TimeLine>
              <template
                v-for="(h, i) in selectedBid?.negotiate_history"
                :key="i"
              >
                <q-timeline-entry>
                  <template v-slot:title>
                    you have offered
                    <span class="text-bold">&#x20B9;{{ h.asked_price }}</span>
                  </template>

                  <template v-slot:subtitle>
                    {{ date.formatDate(h?.date_time, "DD/MM/YYYY hh:mmA") }}
                  </template>

                  <div class="text-muted">
                    <span class="text-bold text-nutral">You Said :</span>
                    {{ h.message }}
                  </div>
                  <div v-if="!h.accepted">
                    <q-badge class="q-badge-warning q-pa-sm">Pending</q-badge>
                  </div>
                  <div v-else>
                    <q-badge class="q-badge-positive q-pa-sm"
                      >Negotiated</q-badge
                    >
                  </div>
                </q-timeline-entry>
              </template>
            </TimeLine>
          </div>
        </q-card-section>
        <q-card-acetion
          class="row q-gutter-sm justify-end q-pa-lg"
          v-if="selectedBid"
        >
          <q-btn
            type=""
            color="primary"
            @click.prevent="negotiateModal = true"
            v-if="
              selectedBid?.negotiate_history?.length < 1 ||
              selectedBid?.negotiate_history[
                selectedBid?.negotiate_history?.length - 1
              ]?.accepted
            "
            >Negotiate</q-btn
          >
          <NuxtLink
            :to="{
          path: routes.book_custom_Service(data!?.serviceRequirement.id),
          query: {
            acceptedBidId: selectedBid.id,
          },
        }"
            v-if="!data?.serviceRequirement.accepted_bid_id"
          >
            <q-btn color="primary" type="submit">Accept and Book</q-btn>
          </NuxtLink>
        </q-card-acetion>
      </q-card>
    </q-dialog>
    <q-dialog v-model="negotiateModal">
      <q-card style="width: 100%">
        <q-toolbar color="primary">
          <q-toolbar-title
            ><span class="text-weight-bold"
              >Request Price Negotiation</span
            ></q-toolbar-title
          >
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="column q-pa-lg">
          <q-input
            outlined
            type="number"
            v-model="negotiateForm.price"
            label="Request a price"
            :rules="[rules.required('required')]"
          />
          <q-input
            outlined
            type="textarea"
            v-model="negotiateForm.message"
            label="message"
            :rules="[rules.required('required')]"
          />
        </q-card-section>
        <q-card-acetion class="row justify-end q-pa-lg">
          <q-btn
            color="primary"
            @click="()=>{
              negotiateForm.bidId=selectedBid?.id as unknown as string
              negotiate(data!.serviceRequirement!.id,{
              onSuccess:()=>{
                refreshBids()
                negotiateModal=false
                bidDetailModal=false
              }
            })}"
            >Submit Request</q-btn
          >
        </q-card-acetion>
      </q-card>
    </q-dialog>
  </div>
</template>
