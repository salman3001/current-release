<script setup lang="ts">
const route = useRoute();
const customFetch = useCustomFetch();
const placeBidModal = ref(false);
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
            userType: requirement.value?.user?.userType,
            userId: requirement.value?.user?.id,
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

const placeBidForm = reactive({
  serviceRequirementId: requirement.value!.id,
  offeredPrice: "",
  message: "",
});

const creatingBid = ref(false);
const createBid = async () => {
  creatingBid.value = true;
  try {
    const res = await customFetch<IResType<any>>(apiRoutes.bids.create, {
      method: "post",
      body: placeBidForm,
    });

    if (res.success == true) {
      alert("bid placed");
    }
  } catch (error) {
    console.log(error);
  }
  creatingBid.value = false;
};
</script>

<template>
  <div>
    <br />
    <br />
    <VendorRequirementCard
      :requirement="requirement!"
      @create-chat="createChat()"
    />
    <br />
    <br />
    <div class="" style="max-width: 95vw">
      <div>
        <NuxtLink
          :to="routes.vendor.service_requirements.view(requirement!.id)"
        >
          <q-btn color="primary" @click="placeBidModal = true">
            Place a Bid</q-btn
          >
        </NuxtLink>
      </div>
      <br />

      <div class="row">
        <!-- <VendorPlacedBidCard
          :accepted="true"
          :bid="data?.acceptedBid"
          :any-bid-accepted="data.acceptedBid ? true : false"
          :requirement-id="data.serviceRequirement.id"
        /> -->
      </div>
      <br />
      <br />
    </div>
    <q-dialog v-model="placeBidModal">
      <q-card style="width: 100%">
        <q-toolbar color="primary">
          <q-toolbar-title
            ><span class="text-weight-bold">Bid Detail</span></q-toolbar-title
          >
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-form class="q-gutter-y-sm" @submit="createBid">
            <q-input
              outlined
              type="number"
              v-model="placeBidForm.offeredPrice"
              label="Offer a price"
              class="col-12 col-sm-6 col-md-3"
              :rules="[rules.required('required')]"
              lazy-rules="true"
            />
            <q-input
              type="textarea"
              outlined
              v-model="placeBidForm.message"
              label="Message"
              class="col-12 col-sm-6 col-md-3"
              :rules="[rules.required('required')]"
            />
            <div class="row q-gutter-sm justify-end q-pt-lg">
              <q-btn color="primary" v-if="creatingBid" disabled>
                <LoadingIndicator /> Processing
              </q-btn>
              <q-btn
                color="primary"
                type="submit"
                :disabled="creatingBid"
                v-else
                style="min-width: 6rem"
                >Submit</q-btn
              >
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
