<script setup lang="ts">

</script>

<template>
  <div class="column items-center justify-evenly" style="min-height: 100vh;">
    <h1>Web Home Page</h1>
    <div>
      <nuxt-link :to="routes.admin.dashboard">Admin</nuxt-link> |
      <nuxt-link :to="routes.vendor.dashboard">Vendor</nuxt-link>
    </div>
  </div>
</template>
