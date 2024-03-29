<script setup lang="ts">
import { userApi } from '@/utils/BaseApiService';

const editUser = editUserStore()

const { execute, loading } = userApi.put();


</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.notificationForm)
    }" @validation-error="srollToView">
      <div class="column q-gutter-y-md">
        <div class="row q-gutter-y-md">
          <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
            <q-toggle v-model="editUser.notificationForm.NotificationSettings.onMessageRecieve"
              label="When Someone sends me a message" />
            <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
              times an invisible web beacon embedded in the campaign is downloaded.</p>
          </div>
          <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
            <q-toggle v-model="editUser.notificationForm.NotificationSettings.onCommentReply"
              label="When Someone sends me a message" />
            <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
              times an invisible web beacon embedded in the campaign is downloaded..</p>
          </div>
          <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
            <q-toggle v-model="editUser.notificationForm.NotificationSettings.onProductUpdate"
              label="Get updates from the products you follow when they are updated." />
            <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
              times an invisible web beacon embedded in the campaign is downloaded.</p>
          </div>
          <div class="col-12 col-sm-6 q-col-gutter-xs items-center ">
            <q-toggle v-model="editUser.notificationForm.NotificationSettings.onOffers"
              label="Personalized updates containing the best the CurrentRelease community has to offer." />
            <p style="max-width: 35rem; color: #686552;">Discover who opens your campaigns by tracking the number of
              times an invisible web beacon embedded in the campaign is downloaded.</p>
          </div>
        </div>
        <div class="row justify-end q-gutter-md">
          <q-btn color="primary" v-if="loading">
            <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
              track-color="orange-2" style="min-width: 8rem" />
          </q-btn>
          <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>
