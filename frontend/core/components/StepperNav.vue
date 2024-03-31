<script setup lang="ts">
import { emit } from "process";

defineProps<{
  lastStep: number;
  step: number;
}>();

const emits = defineEmits<{
  (e: "next"): void;
  (e: "prev"): void;
}>();
</script>

<template>
  <q-stepper-navigation>
    <q-btn
      type="submit"
      color="primary"
      :label="step === lastStep ? 'Finish' : 'Continue'"
    />
    <q-btn
      v-if="step > 1"
      flat
      color="primary"
      @click="emits('prev')"
      label="Back"
      class="q-ml-sm"
    />
  </q-stepper-navigation>
</template>
