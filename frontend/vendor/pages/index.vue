<script setup lang="ts">
definePageMeta({
  middleware: "is-logged-in",
});
</script>

<template>
  <div class="column items-center justify-evenly" style="min-height: 100vh">
    <h1>Vendor dashboard</h1>
    <div>
      <nuxt-link :to="routes.home">Web home</nuxt-link>
    </div>
  </div>
</template>
