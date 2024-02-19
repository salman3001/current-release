<script setup>
import { ofetch } from 'ofetch'
const token = useCookie('token')
const config = useRuntimeConfig()

const authorization = `Bearer ${toRaw(token.value)}`
globalThis.$fetch = ofetch.create({
  baseURL: config.public.baseApi,
  headers: {
    authorization,
  },
})

</script>

<template>
 <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
