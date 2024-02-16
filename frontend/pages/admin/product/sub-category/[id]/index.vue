<script setup lang="ts">
import { productSubCategoryApi } from '@/utils/BaseApiService';


const route = useRoute();


const { data: subcategory } = productSubCategoryApi.show(route.params.id as string, {
  populate: {
    faqs: {
      fields: ['*']
    },
    seo: {
      fields: ['*']
    },
  },
})

</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.product.sub_category.index)
      }
        " />
      <span class="text-h6"> View Subcategory </span>
    </div>
    <div v-if="subcategory" class="q-gutter-y-lg">
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          General Information
        </p>
        <div class="q-py-md">
          <q-img spinner-color="white" :src="subcategory.thumbnail?.url
            ? $config.public.baseApi + subcategory.thumbnail?.url
            : '/images/dummy-thumb.jpg'
            " :alt="subcategory?.name"
            style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
        </div>
      </div>
      <div>
        <h6 class="text-grey-8" style="font-weight: 400">Description</h6>
        <div class="q-gutter-lg">
          <div>
            <p style="color: #686552;">Short Description</p>
            <p>{{ subcategory?.short_desc }}</p>
          </div>
          <div>
            <p style="color: #686552;">Long Description</p>
            <p>{{ subcategory?.long_desc }}</p>
          </div>
        </div>
      </div>
      <div v-if="subcategory?.faqs" class="q-gutter-md">
        <p class="text-grey-8 text-h6" style="font-weight: 400">FAQ</p>
        <div class="column" v-for="(f, i) in subcategory.faqs" :key="f?.id">
          <p style="color: #686552;">Question {{ i + 1 }}: {{ f?.quest }}</p>
          <p>Answer : {{ f?.ans }}</p>
        </div>
      </div>
    </div>
    <div v-if="subcategory?.seo">
      <p class="text-grey-8 text-h6" style="font-weight: 400">
        SEO Information
      </p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Title</p>
          {{ subcategory?.seo?.meta_title }}
        </div>
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Keywords</p>
          {{ subcategory?.seo?.meta_keywords }}
        </div>
        <div class="col-12">
          <p class="text-grey-8" style="font-weight: 500">Meta Description</p>
          {{ subcategory?.seo?.meta_desc }}
        </div>
      </div>
    </div>
  </div>
</template>
