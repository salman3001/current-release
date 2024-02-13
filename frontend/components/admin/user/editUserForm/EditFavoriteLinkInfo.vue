<script setup lang="ts">
import editUserStore from 'src/stores/editUserStore';
import { userApi } from 'src/utils/BaseApiService';
import { srollToView } from 'src/utils/scrollToView';

const editUser = editUserStore()

const { execute, loading } = userApi.put();

</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.favoriteLinksForm)
    }" @validation-error="srollToView">
      <div class="q-gutter-y-md">
        <div class="row q-col-gutter-md items-center">
          <q-input outlined v-for="(f, i) in editUser.favoriteLinksForm.favoriteLinks" :key="i" v-model="f.link"
            class="col-12 col-sm-6 col-md-3" :label="'Link' + ' ' + (i + 1)" clear-icon="close"
            :rules="[$rules.required('required')]">
            <template v-slot:append>
              <q-icon v-if="i > 0" name="close" color="primary" @click="editUser.popFavoriteLinks" />
            </template>
          </q-input>
        </div>
        <q-btn color="primary" style="max-width: 8rem" @click="editUser.addNewFavoriteLinks">+Add
          New</q-btn>
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
