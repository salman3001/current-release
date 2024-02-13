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
    <div class="column q-gutter-y-md">
      <div class=" q-col-gutter-md items-center ">
        <q-toggle v-model="createUser.form.user.isPublic" :label="createUser.form.user.isPublic ? 'On' : 'Off'" />
        <p style="max-width: 35rem; color: #686552;">Don’t display my personal info with my profile,
          reviews, and ratings on
          CurrentRelease CurrentRelease
          will stop sharing my name, title, company name, and photo with partners in relation to my reviews.</p>
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
