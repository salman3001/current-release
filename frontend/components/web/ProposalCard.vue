<script setup lang="ts">
import { date } from "quasar";
const props = defineProps<{
  anyBidAccepted: boolean
  accepted: boolean;
  bid?: IBid;
}>();

const emit = defineEmits<{
  (e: 'bid-accpted'): void,
  (e: 'bid-rejected'): void,

}>()

const loading = ref(false)
const modal = modalStore()

const customFetch = useCustomFetch()

const acceptBid = async () => {
  loading.value = true

  const res = await customFetch<IResType<any>>(apiRoutes.accept_bid(props.bid?.service_requirement_id as number), {
    method: 'post',
    body: {
      bidId: props.bid?.id
    }
  })

  if (res.success == true) {
    emit('bid-accpted')
  }
  try {

  } catch (error) {
    console.log(error);

  }

  loading.value = false
}

const rejectBid = async () => {
  loading.value = true

  const res = await customFetch<IResType<any>>(apiRoutes.reject_bid(props.bid?.service_requirement_id as number), {
    method: 'post',
  })

  if (res.success == true) {
    emit('bid-rejected')
  }
  try {

  } catch (error) {
    console.log(error);

  }

  loading.value = false
}



</script>

<template>
  <q-card flat bordered class="full-width" :class="accepted ? 'border-primary border-2' : ''">
    <q-card-section>
      <div class="row q-gutter-y-md wrap justify-between">

        <div class="column col-12 col-sm-4">
          <p class="text-h5" v-if="accepted">Accpted Proposal</p>
          <div>
            <p class="text-muted" style="width: max-content;">
              {{ date.formatDate(bid?.created_at, "DD/MM/YYYY hh:mmA") }}
            </p>
            <div class="text-bold text-subtitle1">
              Offered Price: &#x20B9;{{ bid?.offered_price }}
            </div>
          </div>
        </div>
        <div v-if="accepted" class="column  col-12 col-sm-4 gap-50 "
          :class="$q.screen.lt.sm ? 'items-start' : 'items-center'">
          <q-avatar>
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div class="q-gutter-sm">
            <span>{{ bid?.vendorUser.first_name }}
              {{ bid?.vendorUser.last_name }}
            </span>
          </div>
          <div class="q-gutter-sm">
            <NuxtLink :to="routes.home" class="underline">{{ bid?.vendorUser?.business_name }}</NuxtLink>
          </div>
          <div>
            <q-btn color="primary" size="sm">Chat</q-btn>
          </div>

          <!-- <div v-if="accepted">
            <q-btn color="primary" size="sm">Chat</q-btn>
          </div> -->
        </div>
        <div class="column col-12 col-sm-4" :class="$q.screen.lt.sm ? 'items-start' : 'items-end'">
          <div class="text-bold">Vendor Rating</div>
          <div class="row gap-25">
            <RatingComponent :rating="bid?.vendorUser?.avg_rating || 0" size="1.25rem" />
            <span>{{ bid?.vendorUser?.avg_rating || 0 }}</span>
          </div>
        </div>

      </div>

    </q-card-section>
    <q-separator vertical />
    <q-card-section :horizontal="$q.screen.gt.xs">

      <q-card-section class="full-width" :class="$q.screen.gt.xs ? ' ' : 'q-pa-none'">
        <div class="text-bold text-subtitle1">Included</div>
        <ul class="list-style-none text-muted">
          <li v-for="( f, i ) in  bid?.features_included " :key="i">{{ f }}</li>
        </ul>
      </q-card-section>
      <q-card-section class="full-width" :class="$q.screen.gt.xs ? ' ' : 'q-pa-none'">
        <div class="text-bold text-subtitle1">Excluded</div>
        <ul class="list-style-none text-muted">
          <li v-for="( f, i ) in  bid?.features_excluded " :key="i">{{ f }}</li>
        </ul>
      </q-card-section>
    </q-card-section>

    <q-card-actions class="justify-end q-pt-none q-gutter-sm">
      <q-btn color="primary" v-if="!anyBidAccepted" :disabled="anyBidAccepted || loading" @click="modal.togel('confirm', {
    title: 'Accept Bid',
    message: 'You Are about to accept this bid. After accepting you will be able to intract with vendor. You can reject any time',
    iconName: 'info',
    onAccept: () => {
      acceptBid()
    },
  })">
        <LoadingIndicator v-if="loading" /> Acccept
      </q-btn>

      <q-btn color="secondary" v-if="accepted" @click="modal.togel('confirm', {
    title: 'Reject Bid',
    message: 'You are about to reject this bid, Are you sure?',
    iconName: 'question_mark',
    onAccept: () => {
      rejectBid()
    },
  })">
        Reject
      </q-btn>
      <q-btn color="primary" v-if="accepted">
        Confirm and book
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
