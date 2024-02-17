<script setup lang="ts">
import {
  productApi,
  productCategoryApi,
  productSubCategoryApi,
  productTagApi,
  userApi,
} from '@/utils/BaseApiService';

const form = ref({
  logo: null,
  cover: null,
  video: null,
  brocher: null,
  images: [],
  product: {
    name: '',
    userId: '',
    productCategoryId: '',
    productSubcategoryId: '',
    specificLocation: false,
    shortDesc: '',
    longDesc: '',
    status: false
  },
  variants: [{
    price: '',
    availableQty: '',
    image: null,
    properties: [{
      name: '',
      value: ''
    }]
  }],
  tags: [],
  seo: {
    metaTitle: '',
    metaKeywords: '',
    metaDesc: ''
  },
  social: {
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    pintrest: '',
    linkedin: '',
    vk: '',
    whatsapp: '',
    telegram: '',
  },
  faq: [{
    quest: '',
    ans: ''
  }]

});

const addVariant = () => {
  form.value.variants.push({ price: '', availableQty: '', image: null, properties: [{ name: '', value: '' }] })
}

const removeVariant = (index: number) => {
  form.value.variants.splice(index, 1)
}

const addVariantProperty = (variantIndex: number) => {
  form.value.variants[variantIndex].properties.push({ name: '', value: '' })
}

const removeVariantProperty = (variantIndex: number, propertyIndex: number) => {
  form.value.variants[variantIndex].properties.splice(propertyIndex, 1)
}

const { data: productCategories } = await productCategoryApi.index({
  fields: ['name', 'id'],
})

const { data: productSubcategories } = await productSubCategoryApi.index({
  fields: ['name', 'id'],
})
const { data: users } = await userApi.index({
  fields: ['first_name', 'id'],
})

const { data: tags } = await productTagApi.index({
  fields: ['name', 'id'],
})

const { execute: createProduct, loading: posting } =
  productApi.post({

  }, {
    onSuccess: () => {
      navigateTo(routes.admin.product.index)
    }
  });

const submit = () => {
  const formData = convertToFormData(form.value)
  createProduct(formData)
};

const screenShotUrls = computed(() => {
  return form.value.images.map((img: File) => URL.createObjectURL(img))
})

</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.product.index)
      }
        " />
      <span class="text-h6"> Add Product </span>
    </div>
    <q-form @submit="submit" @validation-error="srollToView">
      <div class="q-gutter-y-sm">
        <h6>General Information</h6>
        <div class="row q-col-gutter-md">
          <q-select v-if="users" outlined v-model="form.product.userId" emit-value map-options label="Select User"
            class="col-12 col-sm-6 col-md-3" :rules="[
              rules.required('required'),
            ]" :options="[...users.map((l: any) => ({ label: l?.first_name, value: l?.id }))]" />
          <q-select v-if="productCategories" outlined debounce="500" v-model="form.product.productCategoryId" emit-value
            map-options label="Select Category" class="col-12 col-sm-6 col-md-3"
            :options="[...productCategories.map((l: any) => ({ label: l?.name, value: l?.id }))]" />
          <q-select v-if="productSubcategories" outlined debounce="500" v-model="form.product.productSubcategoryId"
            emit-value map-options label="Select Sub Category" class="col-12 col-sm-6 col-md-3"
            :options="[...productSubcategories.map((l: any) => ({ label: l?.name, value: l?.id }))]" />
          <q-select v-if="tags" outlined debounce="500" v-model="form.tags" emit-value map-options label="Select Tags"
            class="col-12 col-sm-6 col-md-3" multiple use-chips
            :options="[...tags.map((l: any) => ({ label: l?.name, value: l?.id }))]" />
        </div>
      </div>
      <div class="">
        <h6>Product Information</h6>
        <div class="row q-col-gutter-md">
          <div class="col-12 q-mb-xl">
            <div class="q-py-xs" style="font-weight: 500;">Product Log</div>
            <FormsImageInput name="logo" @image="(f) => { form.logo = f as unknown as null }" style="max-width: 15rem;" />
          </div>
          <q-input outlined v-model="form.product.name" label="ProductName" class="col-12 col-sm-6 col-md-3" :rules="[
            rules.required('Product name is required'),
          ]" />
        </div>
      </div>
      <div class="q-gutter-y-md">
        <h6>Variants</h6>
        <div class="row q-pa-md q-gutter-y-md relative-position" style="border: 1px solid gray; border-radius: 10px;"
          v-for="v, vi in form.variants">
          <q-badge floating @click="removeVariant(vi)" v-if="vi > 0"><q-icon name="close"
              style="height: 20px;width: 20px;cursor: pointer;"></q-icon></q-badge>
          <p style="font-weight: bold;">Variants {{ vi + 1 }}</p>
          <div class="col-12 q-mb-xl">
            <div class="q-py-xs" style="font-weight: 500;">Image</div>
            <FormsImageInput name="Image" @image="(f) => { v.image = f as unknown as null }" style="max-width: 15rem;" />
          </div>
          <div class="full-width">
            <div class="row q-col-gutter-sm">
              <q-input type="number" outlined v-model="v.price" label="Price" class="col-12 col-sm-6 col-md-3" :rules="[
                rules.required('Price field is required'),
              ]" />
              <q-input type="number" outlined v-model="v.availableQty" label="Available Quantity"
                class="col-12 col-sm-6 col-md-3" :rules="[
                  rules.required('Quantity field is required'),
                ]" />
            </div>
            <p style="font-weight: bold;"> Variant Properties</p>
            <div class="row q-col-gutter-sm relative-position" v-for="p, pi in v.properties">
              <q-input outlined v-model="p.name" label="Name" class="col-12 col-sm-6 col-md-3" :rules="[
                rules.required('Price field is required'),
              ]" />
              <div class="relative-position justify-center items-center">
                <q-input outlined v-model="p.value" label="Value" class="col-12 col-sm-6 col-md-3" :rules="[
                  rules.required('Quantity field is required'),
                ]" />
                <q-badge floating @click="removeVariantProperty(vi, pi)" v-if="pi > 0"><q-icon name="close"
                    style="height: 20px;width: 20px;cursor: pointer;"></q-icon></q-badge>
              </div>
            </div>
            <q-btn outline size="sm" @click="addVariantProperty(vi)">+ Add Property</q-btn>

          </div>
        </div>
        <div>
          <q-btn color="primary" @click="addVariant">+ Add variant</q-btn>
        </div>
      </div>
      <div>
        <h6>
          <q-toggle v-model="form.product.specificLocation" label="Specific Location" />
        </h6>
      </div>
      <div>
        <h6>
          <q-toggle v-model="form.product.status" label="Activate" />
        </h6>
      </div>
      <div>
        <h6>Description</h6>
        <div class="row q-col-gutter-lg">
          <q-input outlined v-model="form.product.shortDesc" label="Product Short Description" class="col-12 " />
          <q-input type="textarea" outlined v-model="form.product.longDesc" label="Product Short Description"
            class="col-12" />
        </div>
      </div>
      <div>
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
      <div>
        <h6>Media/Screenshot</h6>
        <div class="col-12 q-mb-xl">
          <div class=" q-py-xs" style="font-weight: 500;">Product cover</div>
          <FormsImageInput name="logo" @image="(f) => { form.cover = f as unknown as null }" style="max-width: 15rem;" />
        </div>
        <div class="col-12 q-mb-xl">
          <div class=" q-py-xs" style="font-weight: 500;">Product Brochure</div>
          <FormsImageInput name="logo" @image="(f) => { form.brocher = f as unknown as null }"
            style="max-width: 15rem;" />
        </div>
        <div class="col-12 q-mb-xl">
          <div class="q-py-md" style="font-weight: 500;">Product Screenshots (Max 5 images)</div>
          <FormsMultiImageInput :urls="screenShotUrls" @delete="(index: number) => {
            form.images.splice(index, 1)
          }">
            <div class="column items-center q-pb-sm" style="border:1px solid #e6e4d9;border-radius: 1rem;">
              <label for="multiple-image">
                <q-img alt="Preview" style=" min-width: 15rem;width: 15rem;cursor: pointer;"
                  src="/images/screenshot-upload.svg" />
              </label>
              <q-file for="multiple-image" dense filled multiple v-model="form.images"
                accept="image/jpeg,image/png,image/webp" max-file-size="3000000" label="Upload Image"
                style="display: none;" append max-files="5" />
              Upload Screenshots
            </div>
          </FormsMultiImageInput>
        </div>
        <div class="col-12 q-mb-xl" style="max-width: 25rem;">
          <div class=" q-py-xs" style="font-weight: 500;">Product Video (Mp4/Mpeg)</div>
          <FormsVideoInput name="video" @video="(v) => { form.video = v as unknown as null }" />
        </div>
        <div class="col-12 q-mb-xl">
          <div class="q-py-md" style="font-weight: 500;">Social Information</div>
          <div class="row q-col-gutter-md">
            <q-input outlined v-model="form.social.website" class="col-12 col-sm-6 col-md-3" label="Website URL" />
            <q-input outlined v-model="form.social.facebook" label="Facebook URL" class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="form.social.twitter" label="Twitter URL" class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="form.social.instagram" label="Instagram URL" class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="form.social.pintrest" label="Pintrest URL" class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="form.social.linkedin" label="Linkedin URL" class="col-12 col-sm-6 col-md-3" />
            <q-input outlined v-model="form.social.vk" class="col-12 col-sm-6 col-md-3" label="VK URL" />
            <q-input outlined v-model="form.social.whatsapp" class="col-12 col-sm-6 col-md-3" label="Whatsapp URL" />
            <q-input outlined v-model="form.social.telegram" class="col-12 col-sm-6 col-md-3" label="Telegram URL" />
          </div>
        </div>
        <div class="column q-gutter-y-md">
          <p class="text-subtitle1">META Information</p>
          <div class="row q-col-gutter-xl">
            <q-input outlined v-model="form.seo.metaTitle" label="Meta Title" class="col-12 col-sm-6" />
            <q-input outlined v-model="form.seo.metaKeywords" label="Meta Keywords" class="col-12 col-sm-6" />
            <q-input type="textarea" outlined v-model="form.seo.metaDesc" label="Meta Description" class="col-12" />

          </div>
        </div>
      </div>
      <div class="row justify-end q-gutter-md q-pt-xl">
        <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
          navigateTo(routes.admin.product.index)
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
