<script setup lang="ts">
import {
  KnowledgebaseCategoryApi,
  KnowledgebaseContentApi,
  LanguageApi,
} from '@/utils/BaseApiService';
import { ref } from 'vue';


const form = ref({
  title: '',
  slug: '',
  languageId: null,
  knowledgeBaseCategoryId: null,
  order: null,
  content: '',
  metaTitle: '',
  metaKeywords: '',
  metaDesc: '',
  isActive: false,
});


const { data: categories } = KnowledgebaseCategoryApi.index({
  fields: ['name', 'id'],
})

const { data: languages } = LanguageApi.index({
  fields: ['name', 'id'],
})

const { execute: createContent, loading: IsPostingContnet } =
  KnowledgebaseContentApi.post({}, {
    onSuccess: () => {
      navigateTo(routes.admin.knowlegdebase.content)
    }
  });

const submit = async () => {
  createContent(form.value)
};
</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.knowlegdebase.content)
      }
        " />
      <span class="text-h6"> Add Content </span>
    </div>
    <q-form class="column q-gutter-y-xl" @submit="submit">
      <div class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <q-input :debounce="500" outlined v-model="form.title" label="Title" class="col-12 col-sm-6 col-md-3" :rules="[
            rules.required('required'),
            async (v) =>
              (await rules.unique(
                '/help-center/content/unique-field',
                'title',
                v
              )) || 'title Already Taken',
          ]" />
          <q-input outlined :debounce="500" v-model="form.slug" label="Slug" class="col-12 col-sm-6 col-md-3" :rules="[
            (v) => rules.slug(v) || 'Slug is not valid',
            async (v) =>
              (await rules.unique(
                '/help-center/content/unique-field',
                'slug',
                v
              )) || 'Slug Already Taken',
          ]" hint="It will be auto created if you don't add it." />
          <q-select v-if="languages" outlined debounce="500" v-model="form.languageId" emit-value map-options
            label="Lanuguage" class="col-12 col-sm-6 col-md-3"
            :options="[...languages.map((l: any) => ({ label: l?.name, value: l?.id }))]" />

          <q-select v-if="categories" outlined debounce="500" v-model="form.knowledgeBaseCategoryId" emit-value
            map-options label="Category" class="col-12 col-sm-6 col-md-3"
            :options="[...categories.map((c: any) => ({ label: c?.name, value: c?.id }))]" />
          <q-input outlined :debounce="500" v-model="form.order" type="number" label="Order"
            class="col-12 col-sm-6 col-md-3" :rules="[
              async (v) =>
                (await rules.unique(
                  '/help-center/content/unique-field',
                  'order',
                  v
                )) || 'Order number not avaialabe. Choose another one',
            ]" />
          <div class="full-width" style="display: flex; min-height: 25rem; flex-direction: column">
              <ck-editor v-model="form.content"/>
          </div>
        </div>

        <div class="column q-gutter-y-md">
          <p class="text-subtitle1">META Information</p>
          <div class="row q-col-gutter-xl">
            <q-input outlined v-model="form.metaTitle" label="Meta Title" class="col-12 col-sm-6" />
            <q-input outlined v-model="form.metaKeywords" label="Meta Keywords" class="col-12 col-sm-6" />
            <q-input type="textarea" outlined v-model="form.metaDesc" label="Meta Description" class="col-12" />
            <q-toggle label="Activate" v-model="form.isActive" />
          </div>
        </div>
      </div>
      <div class="row justify-end q-gutter-md">
        <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
          navigateTo(routes.admin.knowlegdebase.content)
        }
          ">Cancle</q-btn>
        <q-btn color="primary" v-if="IsPostingContnet">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Save</q-btn>
      </div>
    </q-form>
  </div>
</template>
