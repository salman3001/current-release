<script setup lang="ts">
import { userApi } from '@/utils/BaseApiService';


const editUser = editUserStore()

const { execute, loading } = userApi.put();

</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.skillsForm)
    }" @validation-error="srollToView">
      <div class="column q-gutter-y-md">
        <div class="row q-col-gutter-md q-pb-lg" v-for="(s, i) in editUser.skillsForm.skills" :key="i">
          <div class="col-12 row q-col-gutter-sm items-center">
            <p class="text-grey">Skill {{ i + 1 }}</p>
            <div>
              <q-btn v-if="i > 0" flat icon="delete" @click="() => editUser.popSkill(i)">Remove
              </q-btn>
            </div>
          </div>

          <q-input outlined v-model="s.name" label="Skill Name" class="col-12 col-sm-6 col-md-3"
            :rules="[rules.required('required')]" />
          <q-input type="textarea" outlined v-model="s.desc" label="Description" class="col-12" />

        </div>
        <div class="row justify-end">
          <q-btn color="primary" style="max-width: 14rem" size="small" @click="editUser.addNewSkill">+ Add
            New Skill</q-btn>
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
