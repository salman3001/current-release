<script setup lang="ts">
defineProps<{
  meta?: PageMeta;
  page: number;
}>();
</script>

<template>
  <div class="row justify-start q-pa-md">
    <q-pagination
      :model-value="page"
      @update:model-value="(v:number)=>$emit('update:model-value',v)"
      color="primary"
      :max="meta ? Math.ceil(meta.total / meta.per_page) : 0"
      size="md"
    />
  </div>
</template>
