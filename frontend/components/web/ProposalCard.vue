<script setup lang="ts">
import BigNumber from "bignumber.js";
import { date } from "quasar";
const props = defineProps<{
  anyBidAccepted: boolean;
  accepted: boolean;
  bid?: IBid;
  requirementId: number;
}>();

const emit = defineEmits<{
  (e: "bid-accpted"): void;
  (e: "bid-rejected"): void;
}>();

const loading = ref(false);
const modal = modalStore();

const customFetch = useCustomFetch();

const acceptBid = async () => {
  loading.value = true;

  const res = await customFetch<IResType<any>>(
    apiRoutes.accept_bid(props.bid?.service_requirement_id as number),
    {
      method: "post",
      body: {
        bidId: props.bid?.id,
      },
    }
  );

  if (res.success == true) {
    emit("bid-accpted");
  }
  try {
  } catch (error) {
    console.log(error);
  }

  loading.value = false;
};

const rejectBid = async () => {
  loading.value = true;

  const res = await customFetch<IResType<any>>(
    apiRoutes.reject_bid(props.bid?.service_requirement_id as number),
    {
      method: "post",
    }
  );

  if (res.success == true) {
    emit("bid-rejected");
  }
  try {
  } catch (error) {
    console.log(error);
  }

  loading.value = false;
};
</script>

<template>
  <q-card
    flat
    bordered
    :class="accepted ? 'border-primary border-2' : ''"
    style="max-width: 400px; height: max-content"
  >
    <q-card-section>
      <div class="row q-gutter-y-md wrap justify-between">
        <div class="row gap-50">
          <q-avatar size="72px">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div>
            <p v-if="accepted" class="text-bold text-subtitle1">
              {{ bid?.vendorUser.first_name }}
              {{ bid?.vendorUser.last_name }}
            </p>
            <p v-else class="text-bold text-subtitle1">Anonymous</p>
            <div>
              <NuxtLink :to="routes.home" class="underline">{{
                bid?.vendorUser?.business_name
              }}</NuxtLink>
            </div>
            <div>
              <RatingComponent
                :rating="bid?.vendorUser?.avg_rating || 0"
                size="1.25rem"
              />
            </div>
          </div>
        </div>
        <div>
          <p class="text-muted" style="width: max-content">
            {{ date.formatDate(bid?.created_at, "DD/MM/YYYY hh:mmA") }}
          </p>
          <q-badge
            v-if="accepted"
            outline
            class="q-badge-primary justify-center"
          >
            Accepted</q-badge
          >
        </div>
      </div>
      <br />
      <div class="q-gutter-sm">
        <q-badge class="q-badge-primary justify-center" style="width: 120px">
          <span class="text-bold text-body1"
            >&#x20B9;{{
              new BigNumber(bid?.offered_price || 0).toFixed(2)
            }}</span
          >
          / Qty</q-badge
        >
        <q-badge class="q-badge-primary justify-center" style="width: 120px">
          <span class="text-bold text-body1">3</span>
          Hrs</q-badge
        >
      </div>
      <br />
      <div>
        <p class="text-body-1 ellipsis-3-lines">
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Iste
          laboriosam incidunt eum maxime architecto beatae illum repellendus at
          tempore expedita? Lorem ipsum dolor sit amet consectetur, adipisicing
          elit. Exercitationem, distinctio.
        </p>
      </div>
    </q-card-section>
    <q-card-action class="row q-px-sm justify-end">
      <q-btn color="primary">Review</q-btn>
    </q-card-action>
    <br />
  </q-card>
</template>
