<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";

const route = useRoute();
const customFetch = useCustomFetch();
const bidDetailModal = ref(false);
const selectedBid = ref<IBid | null>(null);
const getImageUrl = useGetImageUrl();

const { data: requirement, refresh: refreshRequirement } = await useAsyncData(
  ("service-requirement" + route.params.id) as string,
  async () => {
    const data = await customFetch<IResType<IServiceRequirement>>(
      apiRoutes.service_requirements.view(route.params.id as unknown as number)
    );

    return data.data;
  }
);

const createChat = async () => {
  try {
    const res = await customFetch<IResType<IConversation>>(
      apiRoutes.chat.conversations.create,
      {
        method: "post",
        body: {
          participant: {
            userType: requirement.value?.serviceRequirement?.user?.userType,
            userId: requirement.value?.serviceRequirement?.user?.id,
          },
        },
      }
    );

    if (res.success == true) {
      navigateTo({
        path: routes.vendor.chat,
        query: {
          newConversationId: res?.data?.id,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
</script>

<template>
  <div>
    <br />
    <br />
    <VendorRequirementCard
      :requirement="data?.serviceRequirement!"
      @create-chat="createChat()"
    />
    <br />
    <br />
    <div class="" style="max-width: 95vw">
      <div>
        <NuxtLink :to="routes.vendor.service_requirements.view(requirement.id)">
          <q-btn color="primary"> Place a Bid</q-btn>
        </NuxtLink>
      </div>
      <br />

      <div class="row">
        <div v-if="!data?.acceptedBid" class="text-subtitle1">
          <p>You haven't accepted any bid yet. Please accept a bid</p>
          <br />
        </div>
        <VendorPlacedBidCard
          v-else
          :accepted="true"
          :bid="data?.acceptedBid"
          :any-bid-accepted="data.acceptedBid ? true : false"
          :requirement-id="data.serviceRequirement.id"
        />
      </div>
      <br />
      <br />
    </div>
    <!-- <q-dialog v-model="bidDetailModal">
      <q-card style="width: 100%">
        <q-toolbar color="primary">
          <q-toolbar-title><span class="text-weight-bold">Bid Detail</span></q-toolbar-title>
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>

        <q-card-section class="column q-pa-lg" v-if="selectedBid">
          <div class="row q-gutter-y-md wrap justify-between">
            <div class="row gap-50">
              <q-avatar size="72px">
                <img :src="getImageUrl(
      selectedBid?.vendorUser?.profile?.avatar?.url,
      '/images/sample-dp.png'
    )
      " />
              </q-avatar>
              <div>
                <p v-if="data?.acceptedBid?.id === selectedBid?.id" class="text-bold text-subtitle1">
                  {{ selectedBid?.vendorUser.first_name }}
                  {{ selectedBid?.vendorUser.last_name }}
                  <q-btn size="xs" color="secondary" v-if="data?.acceptedBid?.id === selectedBid?.id"
                    @click="createChat">chat</q-btn>
                </p>
                <p v-else class="text-bold text-subtitle1">Anonymous</p>
                <div>
                  <NuxtLink :to="routes.home" class="underline">{{
      selectedBid?.vendorUser?.business_name
    }}</NuxtLink>
                </div>

                <div>
                  <RatingComponent :rating="selectedBid?.vendorUser?.avg_rating || 0" size="1.25rem" />
                </div>
              </div>
            </div>
            <div>
              <p class="text-muted" style="width: max-content">
                {{
      date.formatDate(selectedBid?.created_at, "DD/MM/YYYY hh:mmA")
    }}
              </p>
              <q-badge v-if="data?.acceptedBid?.id === selectedBid?.id" outline
                class="q-badge-positive q-py-sm q-px-md justify-center">
                Accepted</q-badge>
            </div>
          </div>
          <br />
          <div class="q-gutter-sm">
            <q-badge class="q-badge-primary justify-center" style="width: 120px">
              <span class="text-bold text-body1">&#x20B9;{{
      new BigNumber(selectedBid?.offered_price || 0).toFixed(2)
    }}</span>
              / Qty</q-badge>
            <q-badge class="q-badge-primary justify-center" style="width: 120px">
              <span class="text-bold text-body1">3</span>
              Hrs</q-badge>
          </div>
          <br />
          <div>
            <p class="text-body-1 ellipsis-3-lines">
              {{ selectedBid?.message }}
            </p>
          </div>
        </q-card-section>
        <q-card-acetion class="row justify-end q-pa-lg" v-if="selectedBid">
          <NuxtLink :to="{
      path: routes.book_custom_Service(data!?.serviceRequirement.id),
      query: {
        acceptedBidId: selectedBid.id,
      },
    }" v-if="!data?.serviceRequirement.accepted_bid_id">
            <q-btn color="primary">Accept and Book</q-btn>
          </NuxtLink>
        </q-card-acetion>
      </q-card>
    </q-dialog> -->
  </div>
</template>
