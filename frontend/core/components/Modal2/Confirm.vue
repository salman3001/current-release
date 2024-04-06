<script setup lang="ts">

defineProps<{
  iconName: string,
  message: string,
  title: string
}>()

const emits = defineEmits<{
  (e: "accepted"): void
  (e: "rejected"): void
}>()

</script>

<template>
  <Modal2Base :title="title">
    <q-card-section class="column items-center text-center q-px-md-sm">
      <q-icon :name="iconName || 'block'" color="secondary" class="col-4" size="5rem" />
      <p>{{ message }}</p>
    </q-card-section>
    <q-card-section class="row justify-end">
      <div class="q-gutter-sm">
        <q-btn color="secondary" @click="emits('rejected')">Cancle</q-btn>
        <q-btn color="primary" @click="emits('accepted')">Continue</q-btn>
      </div>
    </q-card-section>
  </Modal2Base>

</template>
