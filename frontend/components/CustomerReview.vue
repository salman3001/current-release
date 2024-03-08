<script setup lang="ts">

defineProps<{
  review: IReview
}>()

</script>

<template>

  <div class="row items-center q-col-gutter-sm">
    <div class="row items-start q-gutter-sm" style="max-width: max-content">
      <q-avatar>
        <img :src="review?.user?.profile?.avatar?.url || '/images/sample-dp.png'" />
      </q-avatar>
      <div>
        <span>{{ review?.user?.first_name }} {{ review?.user?.last_name }}</span>
        <RatingComponent :rating="review.rating" size="1.1rem" />
        <p class="text-muted">
          {{ review.created_at }} |
          <q-badge class="text-bold" color="primary" outline>Verified purchase</q-badge>
        </p>
      </div>
    </div>
  </div>
  <p class="text-muted">
    {{ review.message }}
  </p>

</template>
