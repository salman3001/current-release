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
      execute(editUser?.user?.id as string, { user: { ...editUser.userForm.user } })
    }" @validation-error="srollToView">
      <div class="column q-gutter-y-md">
        <div class="column q-gutter-y-md">
          <div class=" q-col-gutter-md items-center ">
            <q-toggle v-model="editUser.userForm.user.isPublic" :label="editUser.userForm.user.isPublic ? 'On' : 'Off'" />
            <p style="max-width: 35rem; color: #686552;">Don’t display my personal info with my profile,
              reviews, and ratings on
              CurrentRelease CurrentRelease
              will stop sharing my name, title, company name, and photo with partners in relation to my reviews.</p>
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
