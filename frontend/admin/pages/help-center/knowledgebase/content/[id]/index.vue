<script setup lang="ts">
import { KnowledgebaseContentApi } from '@/utils/BaseApiService';
import { ref } from 'vue';

const route = useRoute();

const content = ref<null | Record<string, any>>(null);
KnowledgebaseContentApi.show(route.params.id as string, {
  populate: {
    language: {
      fields: ['name'],
    },
    category: {
      fields: ['name'],
    },
  },
}).then(({ data }) => {
  content.value = data.value;
});
</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon
        name="keyboard_backspace"
        size="30px"
        style="cursor: pointer"
        @click="() => {
            navigateTo(routes.admin.knowlegdebase.content)
          }
          "
      />
      <span class="text-h6"> View Content </span>
    </div>
    <div v-if="content" class="q-gutter-y-lg">
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          General Information
        </p>
        <div class="q-py-md" style="overflow-x: scroll">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th
                  style="text-align: start; padding: 0.5rem; min-width: 10rem"
                >
                  Title
                </th>
                <th
                  style="text-align: start; padding: 0.5rem; min-width: 10rem"
                >
                  Slug
                </th>
                <th style="text-align: start; padding: 0.5rem">Language</th>
                <th style="text-align: start; padding: 0.5rem">Category</th>
                <th style="text-align: start; padding: 0.5rem">Order</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">{{ content?.title }}</td>
                <td style="padding: 0.5rem">{{ content?.slug }}</td>
                <td style="padding: 0.5rem">
                  {{ content?.language?.name }}
                </td>
                <td style="padding: 0.5rem">
                  {{ content?.category?.name }}
                </td>
                <td style="padding: 0.5rem">{{ content?.order }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">Content</p>
        <div v-html="content?.content"></div>
      </div>
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          SEO Information
        </p>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6">
            <p class="text-grey-8" style="font-weight: 500">Meta Title</p>
            {{ content?.meta_title }}
          </div>
          <div class="col-12 col-sm-6">
            <p class="text-grey-8" style="font-weight: 500">Meta Keywords</p>
            {{ content?.meta_keywords }}
          </div>
          <div class="col-12">
            <p class="text-grey-8" style="font-weight: 500">Meta Description</p>
            {{ content?.meta_desc }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
