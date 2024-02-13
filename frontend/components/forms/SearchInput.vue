<script setup lang="ts">
import { ref } from 'vue';


const text = ref('')

</script>
<template>
  <q-input type="text" outlined v-model="text" placeholder="Search" dense class="rounded-sm" :debounce="500"
    @update:model-value="(val) => {
      $emit('search', val)
    }">
    <template v-slot:append>
      <q-icon v-if="text !== ''" name="close" @click="() => { text = ''; $emit('search', '') }" class="cursor-pointer" />
      <q-icon name="search" />
    </template>
  </q-input>
</template>
