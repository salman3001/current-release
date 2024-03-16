<script setup lang="ts">
import { date } from 'quasar'
const getImageUrl = useGetImageUrl();


defineProps<{
  review: IReview;
}>();
</script>

<template>
  <q-card class="shadow-12" style="width: 400px;">
    <q-card-section>
      <div class="row items-center">
        <RatingComponent :rating="review.rating" size="1.25rem" />&nbsp; | &nbsp;
        {{ date.formatDate(review.created_at, 'DD/MM/YYYY hh:mmA') }}
      </div>
      <div class="text-h6 text-bold">
        {{ review.rating }} Rating
      </div>
    </q-card-section>
    <q-card-section>
      <div class="">
        {{ review.message }} Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia, quis. Lorem ipsum dolor
        sit amet consectetur adipisicing elit. Quibusdam, similique? Lorem ipsum dolor sit, amet consectetur adipisicing
        elit. Odit earum corporis magni consequuntur, nostrum iure.
      </div>
    </q-card-section>
    <q-separator />
    <q-card-section class="row items-start q-gutter-sm" style="max-width: max-content">
      <q-avatar>
        <img :src="getImageUrl(
          review?.user?.profile?.avatar?.url,
          '/images/sample-dp.png'
        )
          " />
      </q-avatar>
      <div>
        <span>{{ review?.user?.first_name }} {{ review?.user?.last_name }}</span>
        <p class="text-muted">

          <q-badge class="text-bold" color="primary" outline>Verified purchase</q-badge>
        </p>
      </div>
    </q-card-section>
  </q-card>
</template>
