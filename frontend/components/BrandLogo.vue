<script setup lang="ts">
import { RouterLink } from 'vue-router';

defineProps<{
  size: string,
  to: string
}>()

RouterLink
</script>
<template>
  <span>
    <RouterLink class="text-h6 text-weight-bold text-black"  style="text-decoration: none;"
      :to="to">
      <div :style="{ width: size, }">
        <q-img src="/images/logo.png"></q-img>
      </div>
    </RouterLink>
  </span>
</template>
