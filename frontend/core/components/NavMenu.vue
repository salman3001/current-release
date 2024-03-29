<script setup lang="ts">
const props = defineProps<{ title?: string }>();
</script>

<template>
  <q-btn
    class="text-black"
    :label="props.title"
    unelevated
    icon-right="expand_more"
  >
    <q-menu
      anchor="bottom left"
      style="border-radius: 14px; border-top: 4px solid black"
    >
      <q-list style="min-width: 100px" dense>
        <slot />
      </q-list>
    </q-menu>
  </q-btn>
</template>
