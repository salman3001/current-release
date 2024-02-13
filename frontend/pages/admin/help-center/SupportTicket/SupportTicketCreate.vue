<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  SupportTickeApi, userApi,
} from 'src/utils/BaseApiService';
import { ref } from 'vue';

const router = useRouter();

const form = ref({
  subject: '',
  status: 'Open',
  userId: '',
  message: '',
});

const users = ref<any[]>([])
userApi.index().then(({ data }) => {
  users.value = data.value as any
})


const { execute: createTicket, loading } =
  SupportTickeApi.post({}, {
    onSuccess: () => {
      router.push({ name: 'admin.supportTicket.index' });
    }
  });

const submit = async () => {
  createTicket(form.value)
};
</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.supportTicket.index' });
      }
        " />
      <span class="text-h6"> Add Support Ticket </span>
    </div>
    <q-form class="column q-gutter-y-xl" @submit="submit" style="max-width: 700px;">
      <div class="q-gutter-y-md">
        <q-select outlined debounce="500" v-model="form.userId" emit-value map-options option-label="first_name"
          option-value="id" label="User" class="col-12 col-sm-6 col-md-3" :options="users"
          :rules="[$rules.required('Required')]" />
        <q-input outlined v-model="form.subject" label="Subject" class="col-12 col-sm-6 col-md-3" :rules="[
          $rules.required('Required')
        ]" />
        <q-input type="textarea" outlined v-model="form.message" label="Message" class="col-12 col-sm-6 col-md-3"
          :rules="[$rules.required('Required')]" />

      </div>
      <div class="row justify-end q-gutter-md">
        <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
          router.push({ name: 'admin.supportTicket.index' });
        }
          ">Cancle</q-btn>
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Save</q-btn>
      </div>
    </q-form>
  </div>
</template>
