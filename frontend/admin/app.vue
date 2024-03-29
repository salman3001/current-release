<script setup>
const token = useCookie("token");
const config = useRuntimeConfig();

const authorization = `Bearer ${toRaw(token.value)}`;

createFetch({
  baseURL: config.public.baseApi,
  headers: {
    authorization,
  },
});
</script>

<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
