<script setup lang="ts">
import {
  BlogApi,
  LanguageApi,
  blogCategoryApi,
} from '@/utils/BaseApiService';
import { ref } from 'vue';

definePageMeta({
  layout: 'admin-layout'
})

const id = useRoute().params.id;


const form = ref({
  title: '',
  slug: '',
  languageId: null,
  blogCategoryId: null,
  longDesc: '',
  metaTitle: '',
  metaKeywords: '',
  metaDesc: '',
  isPublished: false,
  image: null,
});

const { data: categories } = await blogCategoryApi
  .index({
    fields: ['name', 'id'],
  })


const { data: languages } = await LanguageApi.index({
  fields: ['name', 'id'],
})

const { data: blog } = await BlogApi.show(id as string, {
  populate: {
    category: {
      fields: ['name'],
    },
  },
})

watch(blog, () => {
  form.value.title = (blog.value as any)?.title;
  form.value.slug = (blog.value as any)?.slug;
  form.value.languageId = (blog.value as any)?.language_id;
  form.value.blogCategoryId = (blog.value as any)?.category
    ? (blog.value as any)?.category[0]?.id
    : null;
  form.value.longDesc = (blog.value as any)?.long_desc;
  form.value.metaTitle = (blog.value as any)?.meta_title;
  form.value.metaKeywords = (blog.value as any)?.meta_keywords;
  form.value.metaDesc = (blog.value as any)?.meta_desc;
  form.value.isPublished =
    (blog.value as any)?.is_published == 1 ? true : false;
}, {
  deep: true,
  immediate: true
})

const { execute: createBlog, loading: posting } = BlogApi.put();

const submit = async (e: SubmitEvent) => {
  const formData = convertToFormData(form.value)

  createBlog(id as string,
    formData).then(() => {
      navigateTo(routes.admin.blogs.posts)
    });
};

</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.blogs.posts)
      }
        " />
      <span class="text-h6"> Edit Blog </span>
    </div>
    <q-form class="column q-gutter-y-xl" @submit="submit">
      <div class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <q-input :debounce="500" outlined v-model="form.title" label="Title" class="col-12 col-sm-6 col-md-3" :rules="[
            rules.required('required'),
            async (v) =>
              (await rules.unique(
                '/api/blogs/unique-field',
                'title',
                v,
                blog?.title
              )) || 'title Already Taken',
          ]" />
          <q-input outlined :debounce="500" v-model="form.slug" label="Slug" class="col-12 col-sm-6 col-md-3" :rules="[
            (v) => rules.slug(v) || 'Slug is not valid',
            async (v) =>
              (await rules.unique(
                '/api/blogs/unique-field',
                'slug',
                v,
                blog?.slug
              )) || 'Slug Already Taken',
          ]" hint="It will be auto created if you don't add it." />
          <q-select v-if="languages" outlined debounce="500" v-model="form.languageId" emit-value map-options
            label="Lanuguage" class="col-12 col-sm-6 col-md-3"
            :options="[...languages.map((l: any) => ({ label: l?.name, value: l?.id }))]" />

          <q-select v-if="categories" outlined debounce="500" v-model="form.blogCategoryId" emit-value map-options
            label="Category" class="col-12 col-sm-6 col-md-3"
            :options="[...categories.map((c: any) => ({ label: c?.name, value: c?.id }))]" />
          <div style="max-width: 250px">
            <FormsImageInput name="image" width="250px" :url="blog?.thumbnail
              ? $config.public.baseApi + blog?.thumbnail?.url
              : '/images/dummy-thumb.jpg'" @image="f => form.image = f as any" />
          </div>
          <div class="full-width" style="display: flex; min-height: 25rem; flex-direction: column">
            <ck-editor @input="(v) => {
              form.longDesc = v
            }" :value="form.longDesc" />
          </div>

          <div class="column q-gutter-y-md">
            <p class="text-subtitle1">META Information</p>
            <div class="row q-col-gutter-xl">
              <q-input outlined v-model="form.metaTitle" label="Meta Title" class="col-12 col-sm-6" />
              <q-input outlined v-model="form.metaKeywords" label="Meta Keywords" class="col-12 col-sm-6" />
              <q-input type="textarea" outlined v-model="form.metaDesc" label="Meta Description" class="col-12" />
              <q-toggle label="Publsih" v-model="form.isPublished" />
            </div>
          </div>
        </div>
        <div class="row justify-end q-gutter-md">
          <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
            navigateTo(routes.admin.blogs.posts)
          }
            ">Cancle</q-btn>
          <q-btn color="primary" v-if="posting">
            <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
              track-color="orange-2" style="min-width: 8rem" />
          </q-btn>
          <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
        </div>
      </div>
    </q-form>
  </div>
</template>
