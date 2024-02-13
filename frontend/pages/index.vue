<script setup lang="ts">
definePageMeta({
  layout:'web-layout'
})
</script>
<template>
  <q-page class="row items-center justify-evenly">
    <div>
      <span>
        Public pages are under maintenance. Please explore the admin dashboard
      </span>
      <nuxt-link :to="routes.admin.dashboard">Admin</nuxt-link>
    </div>
  </q-page>
</template>
