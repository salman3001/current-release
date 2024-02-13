<script setup lang="ts">
import { AdminUserApi, BlogApi, CityApi, ContactMessageApi, ContinentsApi, CountriesApi, KnowledgebaseCategoryApi, KnowledgebaseContentApi, StateApi, StreetApi, blogCategoryApi, campaignApi, productApi, productCategoryApi, productSubCategoryApi, productTagApi, serviceApi, serviceCategoryApi, serviceSubCategoryApi, serviceTagApi, subscriberApi, templateApi, userApi } from '@/utils/BaseApiService';
import { ref } from 'vue';
const url = ref('')
const loading = ref(false)

const props = defineProps<{
  type: 'admin-users' | 'helpcenter-content' | 'helpcenter-category' | 'contact-message' | 'blogs' | 'blogs-category' | 'continent' | 'country' | 'state' | 'city' | 'street' | 'users' | 'product' | 'product-category' | 'product-subcategory' | 'product-tags' | 'service' | 'service-category' | 'service-subcategory' | 'service-tags' | 'subscriber' | 'template' | 'campaign'
}>()

const resolve = ({ data }: any) => {
  url.value = BaseUploadsUrl + data.value?.url
  loading.value = false
}

const reject = () => {
  loading.value = false
}

const creatExcel = () => {
  loading.value = true
  if (props.type === 'admin-users') {
    AdminUserApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'helpcenter-content') {
    KnowledgebaseContentApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'helpcenter-category') {
    KnowledgebaseCategoryApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'contact-message') {
    ContactMessageApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'blogs') {
    BlogApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'blogs-category') {
    blogCategoryApi.exportExcel().then(resolve).catch(reject)
  }
  if (props.type === 'continent') {
    ContinentsApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'country') {
    CountriesApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'state') {
    StateApi.exportExcel().then(resolve).catch(reject)
  }
  if (props.type === 'city') {
    CityApi.exportExcel().then(resolve).catch(reject)
  }
  if (props.type === 'street') {
    StreetApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'users') {
    userApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'product') {
    productApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'product-category') {
    productCategoryApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'product-subcategory') {
    productSubCategoryApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'product-tags') {
    productTagApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'service') {
    serviceApi.exportExcel().then(resolve).catch(reject)
  }


  if (props.type === 'service-category') {
    serviceCategoryApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'service-subcategory') {
    serviceSubCategoryApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'service-tags') {
    serviceTagApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'template') {
    templateApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'subscriber') {
    subscriberApi.exportExcel().then(resolve).catch(reject)
  }

  if (props.type === 'campaign') {
    campaignApi.exportExcel().then(resolve).catch(reject)
  }
}

</script>
<template>
  <a v-if="url" :href="url" target="_blank"><q-btn color="green-8">Download Excel</q-btn></a>
  <q-btn color="primary" v-else-if="loading" :disable="true">
    <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8" track-color="orange-2"
      style="min-width: 8rem" />
  </q-btn>
  <q-btn color="primary" v-else @click="creatExcel">Generate Excel</q-btn>
</template>
