<script setup lang="ts">
import { srollToView } from 'src/utils/scrollToView';
import ExperienceForm from 'src/components/admin/user/editUserForm/ExperienceForm.vue';
import editUserStore from 'src/stores/editUserStore';
import { userApi } from 'src/utils/BaseApiService';


const editUser = editUserStore()

const { execute, loading } = userApi.put();
</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.workExperienceForm)
    }" @validation-error="srollToView">
      <div class="column q-gutter-y-md">
        <p class="text-subtitle1">Work Experience</p>
        <div class="row q-col-gutter-md q-pb-lg" v-for="(w, i) in editUser.workExperienceForm.workExperience" :key="i">
          <div class="col-12 row q-col-gutter-sm items-center">
            <p class="text-grey">Work Experience {{ i + 1 }}</p>
            <div>
              <q-btn v-if="i > 0" flat icon="delete" @click="editUser.popWorkExperience">Remove
              </q-btn>
            </div>
          </div>
          <ExperienceForm :index="i" />
        </div>
        <div class="row justify-end">
          <q-btn color="primary" style="max-width: 14rem" @click="editUser.addNewWorkExperience">+ Add
            New Experience</q-btn>
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
