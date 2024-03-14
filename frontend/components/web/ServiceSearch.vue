<script setup lang="ts">
import { ref } from "vue";
const modal = modalStore();

const props = defineProps<{
  initailValue: string;
}>();

const text = ref(
  props.initailValue ? props.initailValue.replaceAll("%", "") : ""
);
const expand = ref(false);
</script>

<template>
  <q-input
    type="text"
    outlined
    rounded
    :dense="$q.screen.lt.md"
    v-model="text"
    placeholder="Search Services"
    :debounce="500"
    :style="{ minWidth: $q.screen.lt.sm ? '300px' : '500px' }"
    class="input-shadow"
    @focus="expand = true"
    @blur="expand = false"
    @keyup.enter="$emit('search', text)"
  >
    <template v-slot:append>
      <q-btn
        rounded
        color="primary"
        :size="$q.screen.lt.md ? 'sm' : 'md'"
        @click="
          () => {
            $emit('search', text);
          }
        "
      >
        <q-icon name="search" />
        <span v-if="expand">Search </span>
      </q-btn>
    </template>

    <template v-slot:after> </template>
  </q-input>
</template>
