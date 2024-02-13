<script setup lang="ts">
import editUserStore from 'src/stores/editUserStore';
import { userApi } from 'src/utils/BaseApiService';
import { srollToView } from 'src/utils/scrollToView';

const editUser = editUserStore()

const { execute, loading } = userApi.put();


</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.socialForm)
    }" @validation-error="srollToView">
      <div class="q-gutter-y-md">
        <div class="column q-gutter-y-md">
          <div class="row q-col-gutter-md">
            <q-input outlined v-model="editUser.socialForm.social.website" class="col-12 col-sm-6 col-md-3"
              label="Website URL" />
            <q-input outlined v-model="editUser.socialForm.social.facebook" label="Facebook URL"
              class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="editUser.socialForm.social.twitter" label="Twitter URL"
              class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="editUser.socialForm.social.instagram" label="Instagram URL"
              class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="editUser.socialForm.social.pintrest" label="Pintrest URL"
              class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="editUser.socialForm.social.linkedin" label="Linkedin URL"
              class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="editUser.socialForm.social.vk" class="col-12 col-sm-6 col-md-3" label="VK URL" />
            <q-input outlined v-model="editUser.socialForm.social.whatsapp" class="col-12 col-sm-6 col-md-3"
              label="Whatsapp URL" />
            <q-input outlined v-model="editUser.socialForm.social.telegram" class="col-12 col-sm-6 col-md-3"
              label="Telegram URL" />
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
