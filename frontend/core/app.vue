<script setup>
// const token = useCookie("token");
// const config = useRuntimeConfig();

// const authorization = `Bearer ${toRaw(token.value)}`;

// createFetch({
//   baseURL: config.public.baseApi,
//   headers: {
//     authorization,
//   },
// });
</script>

<template>
  <NuxtLoadingIndicator></NuxtLoadingIndicator>
  <NuxtLayout>
    <div>
      <NuxtPage />
    </div>
  </NuxtLayout>
</template>
