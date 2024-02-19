<script setup lang="ts">
import {
  productSubCategoryApi,
} from '@/utils/BaseApiService';


const form = ref({
  image: null,
  category: {
    name: '',
    shortDesc: '',
    longDesc: '',
    status: false
  },
  seo: {
    metaTitle: '',
    metaKeywords: '',
    metaDesc: ''
  },
  faq: [{
    quest: '',
    ans: ''
  }]

});


const { execute: createCategory, loading: posting } =
  productSubCategoryApi.post({}, {
    onSuccess: () => {
      navigateTo(routes.admin.product.sub_category.index)
    }
  });

const submit = () => {
  const formData = convertToFormData(form.value)
  createCategory(formData)
};

</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.product.sub_category.index)
      }
        " />
      <span class="text-h6"> Add Product Subcategory </span>
    </div>
    <q-form @submit="submit" @validation-error="srollToView">
      <div class="q-gutter-y-sm">
        <h6>General Information</h6>
        <div class="row q-col-gutter-md">
          <div class="col-12 q-mb-xl">
            <div class="q-py-xs" style="font-weight: 500;">Category Thumbnail</div>
            <FormsImageInput name="image" @image="(f) => { form.image = f as unknown as null }" style="max-width: 15rem;" />
          </div>
          <q-input outlined v-model="form.category.name" label="Category Name" class="col-12 col-sm-6 col-md-3" :rules="[
            rules.required('Product name is required'),
          ]" />
        </div>
      </div>
      <div>
        <h6>
          <q-toggle v-model="form.category.status" label="Activate" />
        </h6>
      </div>
      <div>
        <h6>Description</h6>
        <div class="row q-col-gutter-lg">
          <q-input outlined v-model="form.category.shortDesc" label="Category Short Description" class="col-12 " />
          <q-input type="textarea" outlined v-model="form.category.longDesc" label="Category Long Description"
            class="col-12" />
        </div>
      </div>
      <div class="q-pb-lg">
        <h6>FAQ</h6>
        <div v-for="(f, i) in form.faq" class="row q-col-gutter-lg q-pb-xl" :key="i">
          <q-input outlined v-model="f.quest" :label="'Question' + ' ' + (i + 1)" class="col-12" :rules="[
            rules.required('required'),
          ]">
            <template v-slot:append v-if="i > 0">
              <q-icon name="delete" style="cursor: pointer;" @click="() => {
                form.faq.splice(i, 1)
              }" />
              <q-tooltip anchor="top middle" self="top middle" class="bg-secondary"> Remove Question ?
              </q-tooltip>
            </template>
          </q-input>
          <q-input type="textarea" outlined v-model="f.ans" :label="'Answer' + ' ' + (i + 1)" class="col-12" />
        </div>
        <div class="q-pt-md">
          <q-btn color="primary" style="min-width: 8rem" @click="() => {
            form.faq.push({
              quest: '',
              ans: ''
            })
          }">+ Add Question</q-btn>
        </div>
      </div>
      <div class="column q-gutter-y-md">
        <h6>Seo Information</h6>
        <div class="row q-col-gutter-xl">
          <q-input outlined v-model="form.seo.metaTitle" label="Meta Title" class="col-12 col-sm-6" />
          <q-input outlined v-model="form.seo.metaKeywords" label="Meta Keywords" class="col-12 col-sm-6" />
          <q-input type="textarea" outlined v-model="form.seo.metaDesc" label="Meta Description" class="col-12" />

        </div>
      </div>
      <div class="row justify-end q-gutter-md q-pt-xl">
        <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
          navigateTo(routes.admin.product.sub_category.index)
        }
          ">Cancle</q-btn>
        <q-btn color="primary" v-if="posting">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Save</q-btn>
      </div>
    </q-form>
  </div>
</template>
