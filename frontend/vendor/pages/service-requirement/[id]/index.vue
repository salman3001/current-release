<script setup lang="ts">
import { date } from "quasar";

const route = useRoute();
const placeBidModal = ref(false);
const negotiateModal = ref(false);
const getImageUrl = useGetImageUrl();

const { show } = useServiceRequirementApi.show();

const { data: requirement, refresh: refreshRequirement } = await useAsyncData(
  async () => {
    const data = await show(route.params.id as unknown as number);
    return data.data;
  }
);

const { showVendorPlacedbid } = useServiceRequirementApi.showVendorPlacedbid();

const {
  data: placedBid,
  refresh: refreshPlacedBid,
  pending,
} = await useAsyncData(async () => {
  const data = await showVendorPlacedbid(route.params.id as unknown as number);
  return data.data;
});

const { create: createChat, form, loading: creatingChat } = useChatApi.cretae();

const { create: createBid, form: placeBidForm, loading } = useBidApi.cretae();
const {
  acceptNegotiate,
  form: acceptNegotiateForm,
  loading: acceptingNegotiate,
} = useBidApi.acceptNegotiate({
  newPrice: "",
});

const creatingBid = ref(false);
</script>

<template>
  <div>
    <br />
    <br />
    <q-card bordered class="q-gutter-y-none full-width shadow-16">
      <q-toolbar class="justify-between">
        <div class="column q-gutter-y-sm">
          <br />
          <div v-if="requirement?.urgent">
            <q-badge class="q-px-sm text-subtitle1" color="negative"
              >Urgent Requirment</q-badge
            >
          </div>
          <div>
            <q-icon name="location_on" size="30px" color="muted"></q-icon>
            Jarkhand, India
          </div>
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
          {{ requirement?.title }}
        </p>
        <div class="normalcase text-bold row items-center">
          <span class="text-h6 text-bold"
            >&#x20B9;{{ requirement?.budget }}</span
          >&nbsp;&nbsp;<q-badge
            class="text-body2 text-black q-px-md q-badge-info"
            >{{ requirement?.budget_unit }}</q-badge
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
            >{{ requirement?.serviceCategory?.name }}
          </NuxtLink>
        </p>
      </q-card-section>

      <q-card-section>
        <p class="text-subtitle1 text-muted">
          {{ requirement?.desc }}
        </p>
      </q-card-section>

      <q-card-section v-if="requirement?.images">
        <h6>Images</h6>
        <br />
        <LightBox
          :images="requirement.images.map((i) => getImageUrl(i?.file?.url))"
        />
      </q-card-section>

      <q-card-section class="row items-center justify-between q-gutter-y-md">
        <div class="row q-gutter-sm">
          <p v-for="(tag, i) in requirement?.tags" :key="i" class="normalcase">
            #{{ tag.name }}
          </p>
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
      <div v-if="!pending && !placedBid">
        <NuxtLink
          :to="routes.vendor.service_requirements.view(requirement!.id)"
        >
          <q-btn color="primary" @click="placeBidModal = true">
            Place a Bid</q-btn
          >
        </NuxtLink>
      </div>
      <div v-else>
        <h6 class="text-bold">Bid Placed</h6>
        <br />
        <VendorPlacedBidCard
          :bid="placedBid"
          :accepted="requirement?.accepted_bid_id == placedBid?.id"
        />
      </div>
      <br />
      <div v-if="placedBid && placedBid.negotiate_history?.length > 0">
        <h6 class="text-bold">Negotiate history</h6>
        <br />
        <div>
          <TimeLine>
            <template v-for="(h, i) in placedBid?.negotiate_history" :key="i">
              <q-timeline-entry>
                <template v-slot:title>
                  Customer has offered
                  <span class="text-bold">&#x20B9; {{ h.asked_price }}</span>
                </template>

                <template v-slot:subtitle>
                  {{ date.formatDate(h?.date_time, "DD/MM/YYYY hh:mmA") }}
                </template>

                <div class="text-muted">
                  <span class="text-bold text-nutral">Customer Says :</span>
                  {{ h.message }}
                </div>
                <div v-if="!h.accepted">
                  <q-btn color="primary" @click="negotiateModal = true"
                    >Negotiate</q-btn
                  >
                </div>
                <div v-else>
                  <q-badge class="q-badge-positive q-pa-sm">Negotiated</q-badge>
                </div>
              </q-timeline-entry>
            </template>
          </TimeLine>
        </div>
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
          <q-form
            class="q-gutter-y-sm"
            @submit="() => {
            placeBidForm.serviceRequirementId = route?.params?.id as string
            createBid({
              onSuccess:()=> {
                placeBidModal = false;
                refreshPlacedBid()
              },
              onError:()=> {
                placeBidModal= false;
              },
            })
          }"
          >
            <q-input
              outlined
              type="number"
              v-model="placeBidForm.offeredPrice"
              label="Offer a price"
              class="col-12 col-sm-6 col-md-3"
              :rules="[rules.required('required')]"
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
    <q-dialog v-model="negotiateModal">
      <q-card style="width: 100%">
        <q-toolbar color="primary">
          <q-toolbar-title
            ><span class="text-weight-bold"
              >Negotiate Price</span
            ></q-toolbar-title
          >
          <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <q-card-section>
          <q-form
            class="q-gutter-y-sm"
            @submit="() => {
            acceptNegotiate(placedBid!.id, {
              onSuccess:()=> {
                negotiateModal = false;
                refreshPlacedBid()
              },
              onError:()=> {
                negotiateModal= false;
              },
            })
          }"
          >
            <q-input
              outlined
              type="number"
              v-model="acceptNegotiateForm.newPrice"
              label="New Price"
              class="col-12 col-sm-6 col-md-3"
              :rules="[rules.required('required')]"
            />
            <div class="row q-gutter-sm justify-end q-pt-lg">
              <q-btn color="primary" v-if="acceptingNegotiate" disabled>
                <LoadingIndicator /> Processing
              </q-btn>
              <q-btn
                color="primary"
                type="submit"
                :disabled="acceptingNegotiate"
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
