<script setup lang="ts">
import { date } from "quasar";

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
              {{
                date.formatDate(
                  requirement?.created_at as unknown as string,
                  "DD/MM/YYYY hh:mmA"
                )
              }}
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
        <p class="text-h6">
          {{ requirement?.title }} Lorem ipsum dolor sit amet.
        </p>
        <div class="normalcase text-bold row items-center">
          <q-badge class="text-body2 text-black q-px-md q-badge-info">{{
            requirement?.budget_type
          }}</q-badge
          >&nbsp;&nbsp;
          <span class="text-h6 text-bold"
            >&#x20B9;{{ requirement?.budget }}</span
          >
        </div>
        <p>
          Category:
          <NuxtLink
            :to="
              $config.public.webBaseUrl +
              routes.home +
              `?tab=${requirement?.serviceCategory.id}`
            "
            :external="true"
            target="_blank"
            class="underline"
            >{{ requirement?.serviceCategory?.name }}</NuxtLink
          >
        </p>
      </q-card-section>

      <q-card-section>
        <p class="text-subtitle1 text-muted">
          {{ requirement?.desc }}
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
          <NuxtLink
            :to="routes.vendor.service_requirements.view(requirement?.id || 0)"
          >
            <q-btn color="primary"> View Detail </q-btn>
          </NuxtLink>
        </div>
      </q-card-section>
    </q-card>
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
