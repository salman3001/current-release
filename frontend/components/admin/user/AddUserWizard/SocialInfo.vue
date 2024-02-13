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
      <div class="row q-col-gutter-md">
        <q-input outlined v-model="createUser.form.social.website" class="col-12 col-sm-6 col-md-3" label="Website URL" />
        <q-input outlined v-model="createUser.form.social.facebook" label="Facebook URL"
          class="col-12 col-sm-6 col-md-3" />
        <q-input outlined v-model="createUser.form.social.twitter" label="Twitter URL" class="col-12 col-sm-6 col-md-3" />
        <q-input outlined v-model="createUser.form.social.instagram" label="Instagram URL"
          class="col-12 col-sm-6 col-md-3" />
        <q-input outlined v-model="createUser.form.social.pintrest" label="Pintrest URL"
          class="col-12 col-sm-6 col-md-3" />
        <q-input outlined v-model="createUser.form.social.linkedin" label="Linkedin URL"
          class="col-12 col-sm-6 col-md-3" />
        <q-input outlined v-model="createUser.form.social.vk" class="col-12 col-sm-6 col-md-3" label="VK URL" />
        <q-input outlined v-model="createUser.form.social.whatsapp" class="col-12 col-sm-6 col-md-3"
          label="Whatsapp URL" />
        <q-input outlined v-model="createUser.form.social.telegram" class="col-12 col-sm-6 col-md-3"
          label="Telegram URL" />
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
