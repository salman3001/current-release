<script setup lang="ts">
import wishlistStore from '../core/stores/wishlistStore';

const user = useCookie("user");
const wishlist = wishlistStore()

onMounted(() => {
  if (user) {
    wishlist.fetchWishlist()
  }
})
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
