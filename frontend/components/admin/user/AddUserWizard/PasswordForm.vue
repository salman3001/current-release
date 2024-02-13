<script setup lang="ts">
import createUserStore from 'src/stores/createUserStore';
import { ref } from 'vue';

const createUser = createUserStore()
const isPwd = ref(true);

defineProps<{
  step: number
}>()
</script>

<template>
  <q-form class="column q-gutter-y-md" @submit="() => {
    $emit('next')
  }">
    <div class="row q-col-gutter-md" style="padding-top: 30px;">
      <q-input outlined v-model="createUser.form.user.password" :type="isPwd ? 'password' : 'text'" label="Password"
        class="col-12 col-sm-6 col-md-3" :rules="[
          $rules.required('required'),
          $rules.minLength(8, 'Minimum 9 charectors required'),
          $rules.alphaNum('Password Must be alpha numeric'),
        ]">
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>

      <q-input outlined v-model="createUser.form.user.password_confirmaton" :type="isPwd ? 'password' : 'text'"
        label="Cofirm Password" class="col-12 col-sm-6 col-md-3" :rules="[
          $rules.required('required'),
          $rules.sameAs(createUser.form.user.password, 'Password doesnt match'),
        ]">
        <template v-slot:append>
          <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
        </template>
      </q-input>

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
