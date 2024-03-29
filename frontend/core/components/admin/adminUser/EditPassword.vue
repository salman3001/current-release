<script setup lang="ts">
import { AdminUserApi } from '@/utils/BaseApiService';
import { srollToView } from '@/utils/scrollToView';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const isPwd = ref(true);
const form = ref({
  password: '',
  password_confirmation: ''
})

const user = ref<Record<string, any> | null>(null);
AdminUserApi.show(route.params.id as string, {
  fields: ['id', 'role_id'],
  populate: {
    role: {
      fields: ['name']
    }
  }
}).then(({ data }) => {
  user.value = data.value
})


const { execute, loading } = AdminUserApi.updatePassword();

onMounted(() => {
  form.value.password = ''
  form.value.password_confirmation = ''
})
</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(route.params.id as string, form)
    }" @validation-error="srollToView">
      <div class="column q-gutter-y-md" v-if="user && user?.role?.name !== 'Super Admin'">
        <div class="row q-col-gutter-md" style="padding-top: 30px;">
          <q-input outlined v-model="form.password" :type="isPwd ? 'password' : 'text'" label="Password"
            class="col-12 col-sm-6 col-md-3" :rules="[
              rules.required('required'),
              rules.minLength(8, 'Minimum 9 charectors required'),
              rules.alphaNum('Password Must be alpha numeric'),
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <q-input outlined v-model="form.password_confirmation" :type="isPwd ? 'password' : 'text'"
            label="Cofirm Password" class="col-12 col-sm-6 col-md-3" :rules="[
              rules.required('required'),
              rules.sameAs(form.password, 'Password doesnt match'),
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div class="row justify-end q-gutter-md">
          <q-btn color="primary" v-if="loading">
            <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
              track-color="orange-2" style="min-width: 8rem" />
          </q-btn>
          <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
        </div>
      </div>
      <div v-else>
        <p class="text-secondary row items-center q-py-lg"><q-icon name="info" size="20px"></q-icon> Super Admin password
          can not be changed. Please change with forgot pasword option!</p>
      </div>
    </q-form>
  </div>
</template>
