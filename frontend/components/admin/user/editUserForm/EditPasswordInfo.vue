<script setup lang="ts">
import editUserStore from 'src/stores/editUserStore';
import { userApi } from 'src/utils/BaseApiService';
import { srollToView } from 'src/utils/scrollToView';
import { onMounted, ref } from 'vue';

const editUser = editUserStore()
const isPwd = ref(true);

const { execute, loading } = userApi.updatePassword();


onMounted(() => {
  editUser.passwordForm.password = '';
  editUser.passwordForm.password_confirmation = '';
})

</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.passwordForm)
    }" @validation-error="srollToView">
      <div class="column q-gutter-y-md">
        <div class="row q-col-gutter-md" style="padding-top: 30px;">
          <q-input outlined v-model="editUser.passwordForm.password" :type="isPwd ? 'password' : 'text'" label="Password"
            class="col-12 col-sm-6 col-md-3" :rules="[
              $rules.required('required'),
              $rules.minLength(8, 'Minimum 9 charectors required'),
              $rules.alphaNum('Password Must be alpha numeric'),
            ]">
            <template v-slot:append>
              <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
            </template>
          </q-input>

          <q-input outlined v-model="editUser.passwordForm.password_confirmation" :type="isPwd ? 'password' : 'text'"
            label="Cofirm Password" class="col-12 col-sm-6 col-md-3" :rules="[
              $rules.required('required'),
              $rules.sameAs(editUser.passwordForm.password, 'Password doesnt match'),
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
    </q-form>
  </div>
</template>
