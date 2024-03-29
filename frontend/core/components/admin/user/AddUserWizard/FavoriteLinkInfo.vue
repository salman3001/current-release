<script setup lang="ts">

const createUser = createUserStore()
defineProps<{
  step: number
}>()

</script>

<template>
  <q-form class="column q-gutter-y-md" @submit="() => {
    $emit('next')
  }">
    <div class="column q-gutter-y-md">
      <div class="row q-col-gutter-md items-center">
        <q-input outlined v-for="(f, i) in createUser.form.favoriteLinks" :key="i" v-model="f.link"
          class="col-12 col-sm-6 col-md-3" :label="'Link' + ' ' + (i + 1)" clear-icon="close"
          :rules="[rules.required('Field is required')]">
          <template v-slot:append>
            <q-icon v-if="i > 0" name="close" color="primary" @click="() => createUser.popFavoriteLinks()" />
          </template>
        </q-input>
      </div>
      <q-btn color="primary" style="max-width: 8rem" @click="createUser.addNewFavoriteLinks">+Add
        New</q-btn>
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
