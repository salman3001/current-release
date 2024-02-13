<script setup lang="ts">
import createUserStore from 'src/stores/createUserStore';

const createUser = createUserStore()
defineProps<{
  step: number
}>()
</script>

<template>
  <q-form class="column q-gutter-y-md" @submit="() => {
    $emit('next')
  }">
    <div class="row q-gutter-y-md">
      <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
        <q-toggle v-model="createUser.form.NotificationSettings.onMessageRecieve"
          label="When Someone sends me a message" />
        <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
          times an invisible web beacon embedded in the campaign is downloaded.</p>
      </div>
      <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
        <q-toggle v-model="createUser.form.NotificationSettings.onCommentReply" label="When Someone sends me a message" />
        <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
          times an invisible web beacon embedded in the campaign is downloaded..</p>
      </div>
      <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
        <q-toggle v-model="createUser.form.NotificationSettings.onProductUpdate"
          label="Get updates from the products you follow when they are updated." />
        <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
          times an invisible web beacon embedded in the campaign is downloaded.</p>
      </div>
      <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
        <q-toggle v-model="createUser.form.NotificationSettings.onOffers"
          label="Personalized updates containing the best the CurrentRelease community has to offer." />
        <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
          times an invisible web beacon embedded in the campaign is downloaded.</p>
      </div>
    </div>
    <div class="row justify-end q-gutter-md">
      <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit" label="Back"
        class="q-ml-sm" @click="() => {
          $emit('prev')

        }" />
      <q-btn color="primary" type="submit" style="min-width: 8rem">Next</q-btn>
    </div>
  </q-form>
</template>
