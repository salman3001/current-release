<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { BlogApi } from '../../../utils/BaseApiService';
import { ref } from 'vue';

const router = useRouter();
const route = useRoute();

const blog = ref<null | Record<string, any>>(null);
BlogApi.show(route.params.id as string, {
  populate: {
    language: {
      fields: ['name'],
    },
    category: {
      fields: ['name'],
    },
  },
}).then(({ data }) => {
  blog.value = data.value;
});
</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.blogs.index' });
      }
        " />
      <span class="text-h6"> View Blog </span>
    </div>
    <div v-if="blog" class="q-gutter-y-lg">
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          General Information
        </p>
        <div class="q-py-md" style="overflow-x: scroll">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Title
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Slug
                </th>
                <th style="text-align: start; padding: 0.5rem">Category</th>
                <th style="text-align: start; padding: 0.5rem">Language</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">{{ blog?.title }}</td>
                <td style="padding: 0.5rem">{{ blog?.slug }}</td>
                <td style="padding: 0.5rem">
                  {{ blog?.category ? blog?.category[0]?.name : '' }}
                </td>
                <td style="padding: 0.5rem">
                  {{ blog?.language?.name }}
                </td>
                <td style="padding: 0.5rem">{{ blog?.order }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">Content</p>
        <div class="row q-col-gutter-md full-width">
          <p v-html="blog?.long_desc" class="full-width"></p>
        </div>
      </div>
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          SEO Information
        </p>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <p class="text-grey-8" style="font-weight: 500">Meta Title</p>
            {{ blog?.meta_title }}
          </div>
          <div class="col-12 col-sm-6">
            <p class="text-grey-8" style="font-weight: 500">Meta Keywords</p>
            {{ blog?.meta_keywords }}
          </div>
          <div class="col-12">
            <p class="text-grey-8" style="font-weight: 500">Meta Description</p>
            {{ blog?.meta_desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
