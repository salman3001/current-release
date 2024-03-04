<script setup lang="ts">
const color = ref("text-muted");
</script>

<template>
  <div
    class="row justify-center items-center text-center cursor-pointer"
    :class="color"
    @mouseenter="color = 'text-black'"
    @mouseleave="color = 'text-muted'"
  >
    <div class="col-12 row justify-center">
      <q-icon name="dvr" size="40px"></q-icon>
    </div>
    <div class="col-12">
      <p>Category</p>
    </div>
  </div>
</template>
