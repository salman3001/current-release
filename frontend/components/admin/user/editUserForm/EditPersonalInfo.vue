<script setup lang="ts">
import ProfileImageInput from 'src/components/forms/ProfileImageInput.vue';
import editUserStore from 'src/stores/editUserStore';
import { userApi } from 'src/utils/BaseApiService';
import { srollToView } from 'src/utils/scrollToView';
import { rules } from 'src/utils/validationRules';
import { onMounted, ref } from 'vue';

const editUser = editUserStore()

const { execute, loading } = userApi.put({
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

const uploads = ref('')

onMounted(async () => {
  uploads.value = process.env.UPLOAD as string;
});
</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.userForm)
    }" @validation-error="srollToView">
      <div>
        <ProfileImageInput name="image" :url="editUser.user?.avatar
          ? uploads + editUser.user?.avatar?.url
          : '/images/sample-dp.png'
          " @image="(v: any) => {
    editUser.userForm.image = v
  }" />
      </div>
      <div class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <q-input outlined v-model="editUser.userForm.user.firstName" label="First Name" class="col-12 col-sm-6 col-md-3"
            :rules="[$rules.required('required')]" />
          <q-input outlined v-model="editUser.userForm.user.lastName" label="Last Name" class="col-12 col-sm-6 col-md-3"
            :rules="[$rules.required('required')]" />
          <q-input outlined debounce="500" v-model="editUser.userForm.user.email" type="email" label="Email"
            class="col-12 col-sm-6 col-md-3" :rules="[
              $rules.required('required'),
              $rules.email('Email is not valid'),
              async (v) =>
                (await rules.unique('/users/unique-field', 'email', v, editUser?.user?.email)) ||
                'Email Already Taken'
            ]
              " />
          <q-input outlined debounce="500" v-model="editUser.userForm.user.userName" label="User Name"
            class="col-12 col-sm-6 col-md-3" :rules="[
              $rules.required('required'),
              rules.slug || 'Remove White Spaces',
              async (v) =>
                (await rules.unique('/users/unique-field', 'user_name', v, editUser?.user?.user_name)) ||
                'User Name Already Taken',
            ]
              " />
          <q-input outlined v-model="editUser.userForm.user.desc" type="textarea" class="col-12" label="Description" />
          <q-toggle v-model="editUser.userForm.user.isActive" label="Activate" />
        </div>

      </div>
      <div class="row justify-end q-gutter-md">
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
      </div>
    </q-form>
  </div>
</template>
