<script setup lang="ts">
import { ref } from 'vue';

definePageMeta({
  layout: 'admin-layout'
})

const tab = ref('personal')

</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.admin_users)
      }
        " />
      <span class="text-h6"> Edit User </span>
    </div>
    <q-card flat class="q-mt-lg">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left"
        narrow-indicator>
        <q-tab name="personal" label="Personal Information" />
        <q-tab name="password" label="Password" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="personal" class="q-py-xl">
          <div class="text-h6">Edit Personal Information</div>
          <AdminAdminUserEdit />
        </q-tab-panel>

        <q-tab-panel name="password">
          <div class="text-h6">Edit Password</div>
          <AdminAdminUserEditPassword />
        </q-tab-panel>
      </q-tab-panels>
    </q-card>

  </div>
</template>
