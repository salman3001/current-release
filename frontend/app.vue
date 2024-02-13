<script setup>
import { ofetch } from 'ofetch'
const token = useCookie('token')

const authorization = `Bearer ${toRaw(token.value?.token)}`
globalThis.$fetch = ofetch.create({
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
