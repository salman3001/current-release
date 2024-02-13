<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { serviceCategoryApi } from 'src/utils/BaseApiService';
import { onMounted, ref } from 'vue';

const router = useRouter();
const route = useRoute();
const uploads = ref('');


const category = ref<null | Record<string, any>>(null);
serviceCategoryApi.show(route.params.id as string, {
  populate: {
    faqs: {
      fields: ['*']
    },
    seo: {
      fields: ['*']
    },
  },
}).then(({ data }) => {
  category.value = data.value;
});

onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
});
</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.serviceCategory.index' });
      }
        " />
      <span class="text-h6"> View Service Category </span>
    </div>
    <div v-if="category" class="q-gutter-y-lg">
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          General Information
        </p>
        <div class="q-py-md">
          <q-img spinner-color="white" :src="category.thumbnail?.url
            ? uploads + category.thumbnail?.url
            : '/images/dummy-thumb.jpg'
            " :alt="category?.name"
            style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
        </div>
      </div>
      <div>
        <h6 class="text-grey-8" style="font-weight: 400">Description</h6>
        <div class="q-gutter-lg">
          <div>
            <p style="color: #686552;">Short Description</p>
            <p>{{ category?.short_desc }}</p>
          </div>
          <div>
            <p style="color: #686552;">Long Description</p>
            <p>{{ category?.long_desc }}</p>
          </div>
        </div>
      </div>
      <div v-if="category?.faqs" class="q-gutter-md">
        <p class="text-grey-8 text-h6" style="font-weight: 400">FAQ</p>
        <div class="column" v-for="(f, i) in category.faqs" :key="f?.id">
          <p style="color: #686552;">Question {{ i + 1 }}: {{ f?.quest }}</p>
          <p>Answer : {{ f?.ans }}</p>
        </div>
      </div>
    </div>
    <div v-if="category?.seo">
      <p class="text-grey-8 text-h6" style="font-weight: 400">
        SEO Information
      </p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Title</p>
          {{ category?.seo?.meta_title }}
        </div>
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Keywords</p>
          {{ category?.seo?.meta_keywords }}
        </div>
        <div class="col-12">
          <p class="text-grey-8" style="font-weight: 500">Meta Description</p>
          {{ category?.seo?.meta_desc }}
        </div>
      </div>
    </div>
  </div>
</template>
