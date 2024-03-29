<script setup lang="ts">
import { onMounted } from 'vue';
import { userApi } from '@/utils/BaseApiService';

const editUser = editUserStore()
const { execute, loading } = userApi.put();


onMounted(() => {
  editUser.getLangauges()
  console.log(editUser.languagesForm.languages);

})
</script>

<template>
  <q-form @submit="() => {
    execute(editUser?.user?.id as string, editUser.languagesForm)
  }" @validation-error="srollToView">
    <div class="q-py-lg">
      <div class="row q-col-gutter-md">
        <q-select outlined emit-value map-options v-model="editUser.languagesForm.languages" :options="editUser.languages"
          label="Language" class="col-12 col-sm-6 col-md-3" multiple use-chips option-label="name" option-value="id" />
      </div>

      <div class="row  q-gutter-md q-pt-xl">
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
      </div>
    </div>
  </q-form>
</template>
