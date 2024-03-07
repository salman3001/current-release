<script setup lang="ts">
defineProps<{
  accepted: boolean;
}>();
</script>

<template>
  <q-card flat bordered class="q-gutter-y-none full-width">
    <q-card-section>
      <p class="text-h5" v-if="accepted">Accpted Proposal</p>
      <div class="row justify-between q-gutter-y-md">
        <div class="row items-start q-gutter-sm">
          <q-avatar v-if="accepted">
            <img src="https://cdn.quasar.dev/img/avatar.png" />
          </q-avatar>
          <div class="q-gutter-sm">
            <span v-if="accepted"
              >Sara Jacob |
              <NuxtLink :to="routes.home" class="underline"
                >Best Pest Control Service</NuxtLink
              ></span
            >
            <div>
              <div class="text-bold">Service Providers Rating</div>
              <div class="row gap-50 items-center">
                <RatingComponent :rating="4.5" size="1.1rem" /> 4.0
              </div>
            </div>
            <div v-if="accepted">
              <q-btn color="primary" size="sm">Chat</q-btn>
            </div>
          </div>
        </div>
        <div>
          <p class="text-muted flex gap-100">12 Jan 2024 13:12pm</p>
          <div class="text-bold text-subtitle1">Offered Price: &#x20B9;60</div>
        </div>
      </div>
    </q-card-section>
    <q-separator vertical />
    <q-card-section :horizontal="$q.screen.gt.xs">
      <q-card-section>
        <div class="text-bold text-subtitle1">Included</div>
        <div class="text-subtitle1 text-muted">
          Needed a pest control service . Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Animi illo atque incidunt nesciunt id, eligendi
          quaerat corrupti quibusdam deserunt accusamus?
        </div>
      </q-card-section>
      <q-separator inset :vertical="$q.screen.gt.xs"></q-separator>
      <q-card-section>
        <div class="text-bold text-subtitle1">Excluded</div>
        <div class="text-subtitle1 text-muted">
          Needed a pest control service . Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Animi illo atque incidunt nesciunt id, eligendi
          quaerat corrupti quibusdam deserunt accusamus?
        </div>
      </q-card-section>
    </q-card-section>

    <q-card-actions class="justify-end q-pa-md q-gutter-sm">
      <NuxtLink :to="routes.book_Service(1)" v-if="!accepted">
        <q-btn color="primary"> Acccept</q-btn>
      </NuxtLink>
    </q-card-actions>
  </q-card>
</template>
