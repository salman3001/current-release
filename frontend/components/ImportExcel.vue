<script setup lang="ts">
import { QFile } from 'quasar';
import { AdminUserApi, BlogApi, CityApi, ContinentsApi, CountriesApi, KnowledgebaseCategoryApi, KnowledgebaseContentApi, StateApi, StreetApi, blogCategoryApi, campaignApi, productApi, productCategoryApi, productSubCategoryApi, productTagApi, serviceApi, serviceCategoryApi, serviceSubCategoryApi, serviceTagApi, subscriberApi, templateApi, userApi } from '@/utils/BaseApiService';
import { ref } from 'vue';

const form = ref({
  file: null
})

const input = ref<null | QFile>(null)
const loading = ref(false)

const props = defineProps<{ type: 'admin-users' | 'helpcenter-content' | 'helpcenter-category' | 'blogs' | 'blogs-category' | 'continent' | 'country' | 'state' | 'city' | 'street' | 'users' | 'product' | 'product-category' | 'product-subcategory' | 'product-tags' | 'service' | 'service-category' | 'service-subcategory' | 'service-tags' | 'subscriber' | 'template' | 'campaign' }>()
const onSuccess = () => {
  form.value.file = null
  loading.value = false
}

const onError = () => {
  form.value.file = null
  loading.value = false
}

const config = {

}


const { execute: importAdmin } = AdminUserApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importHelpcenterContent } = KnowledgebaseContentApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importHelpcenterCategory } = KnowledgebaseCategoryApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importBlog } = BlogApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importBlogCategory } = blogCategoryApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importContinent } = ContinentsApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importCountry } = CountriesApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importState } = StateApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importCity } = CityApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importStreet } = StreetApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importUser } = userApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importProduct } = productApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importProductcategory } = productCategoryApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importProductsubcategory } = productSubCategoryApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importProductTags } = productTagApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importservice } = serviceApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importservicecategory } = serviceCategoryApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importservicesubcategory } = serviceSubCategoryApi.importExcel(config, {
  onSuccess,
  onError
})

const { execute: importserviceTags } = serviceTagApi.importExcel(config, {
  onSuccess,
  onError
})


const { execute: importSubscriber } = subscriberApi.importExcel(config, {
  onSuccess,
  onError
})
const { execute: importCampaign } = campaignApi.importExcel(config, {
  onSuccess,
  onError
})
const { execute: importTemplate } = templateApi.importExcel(config, {
  onSuccess,
  onError
})


const change = () => {
  if (input.value) {
    input.value?.pickFiles()
  }
}

const submit = () => {
  loading.value = true
  if (props.type === 'admin-users') {
    importAdmin({ ...form.value })
  }
  if (props.type === 'helpcenter-content') {
    importHelpcenterContent({ ...form.value })
  }
  if (props.type === 'helpcenter-category') {
    importHelpcenterCategory({ ...form.value })
  }

  if (props.type === 'blogs') {
    importBlog({ ...form.value })
  }

  if (props.type === 'blogs-category') {
    importBlogCategory({ ...form.value })
  }
  if (props.type === 'continent') {
    importContinent({ ...form.value })
  }

  if (props.type === 'country') {
    importCountry({ ...form.value })
  }

  if (props.type === 'state') {
    importState({ ...form.value })
  }
  if (props.type === 'city') {
    importCity({ ...form.value })
  }
  if (props.type === 'street') {
    importStreet({ ...form.value })
  }

  if (props.type === 'users') {
    importUser({ ...form.value })
  }

  if (props.type === 'product') {
    importProduct({ ...form.value })
  }

  if (props.type === 'product-category') {
    importProductcategory({ ...form.value })
  }

  if (props.type === 'product-subcategory') {
    importProductsubcategory({ ...form.value })
  }

  if (props.type === 'product-tags') {
    importProductTags({ ...form.value })
  }

  if (props.type === 'service') {
    importservice({ ...form.value })
  }


  if (props.type === 'service-category') {
    importservicecategory({ ...form.value })
  }

  if (props.type === 'service-subcategory') {
    importservicesubcategory({ ...form.value })
  }

  if (props.type === 'service-tags') {
    importserviceTags({ ...form.value })
  }

  if (props.type === 'template') {
    importTemplate({ ...form.value })
  }

  if (props.type === 'subscriber') {
    importSubscriber({ ...form.value })
  }

  if (props.type === 'campaign') {
    importCampaign({ ...form.value })
  }

}


</script>
<template>
  <q-form>
    <q-btn color="primary" v-if="loading">
      <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8" track-color="orange-2"
        style="min-width: 8rem" />
    </q-btn>
    <q-btn color="primary" v-else @click="change">Import Excel</q-btn>
    <q-file ref="input" accept="xlsx" v-model="form.file" style="display: none;" @update:model-value="submit">
    </q-file> </q-form>
</template>
