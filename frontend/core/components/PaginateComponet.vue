<script setup lang="ts">
defineProps<{
  meta?: PageMeta;
  page: number;
}>();

defineEmits<{
  (e: "update:model-value", v: number): void;
}>();
</script>

<template>
  <div class="row justify-start q-pa-md">
    <q-pagination
      :model-value="page"
      flat
      direction-links
      @update:model-value="(v: number) => $emit('update:model-value', v)"
      color="primary"
      :max="meta ? Math.ceil(meta.total / meta.per_page) : 0"
      size="md"
    />
  </div>
</template>
