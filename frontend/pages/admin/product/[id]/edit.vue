<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import {
  productApi,
  productCategoryApi,
  productSubCategoryApi,
  productTagApi,
  userApi,
} from '@/utils/BaseApiService';

const route = useRoute()


const form = ref({
  logo: null,
  cover: null,
  video: null,
  brocher: null,
  images: [],
  product: {
    name: '',
    email: '',
    phone: '',
    companyName: '',
    userId: '',
    productCategoryId: '',
    productSubcategoryId: '',
    specificLocation: false,
    shortDesc: '',
    longDesc: '',
    status: false
  },
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

const { data: product } = await productApi.show(route.params.id as string, {
  populate: {
    tags: {
      fields: ['name', 'id']
    },
    social: {
      fields: ['*']
    },
    faq: {
      fields: ['*']
    },
    seo: {
      fields: ['*']
    },
    screenshots: {
      fields: ['*']
    },
    video: {
      fields: ['*']
    }
  }
})

watch(product, () => {
  //product
  form.value.product.companyName = (product.value as any)?.company_name || ''
  form.value.product.email = (product.value as any)?.email || ''
  form.value.product.longDesc = (product.value as any)?.long_desc || ''
  form.value.product.name = (product.value as any)?.name || ''
  form.value.product.phone = (product.value as any)?.phone || ''
  form.value.product.productCategoryId = (product.value as any)?.product_category_id || ''
  form.value.product.productSubcategoryId = (product.value as any)?.product_subcategory_id || ''
  form.value.product.shortDesc = (product.value as any)?.short_desc || ''
  form.value.product.specificLocation = (product.value as any)?.specific_location == 1 ? true : false
  form.value.product.status = (product.value as any)?.status == 1 ? true : false
  form.value.product.userId = (product.value as any)?.user_id || ''
  //tags
  form.value.tags = (product.value as any)?.tags ? (product.value as any)?.tags?.map((t: any) => t.id) : []
  //seo
  form.value.seo.metaDesc = (product.value as any)?.seo?.meta_desc || ''
  form.value.seo.metaKeywords = (product.value as any)?.seo?.meta_keywords || ''
  form.value.seo.metaTitle = (product.value as any)?.seo?.meta_title || ''

  //social
  form.value.social.facebook = (product.value as any)?.social?.facebook || ''
  form.value.social.instagram = (product.value as any)?.social?.instagram || ''
  form.value.social.linkedin = (product.value as any)?.social?.linkedin || ''
  form.value.social.pintrest = (product.value as any)?.social?.pintrest || ''
  form.value.social.telegram = (product.value as any)?.social?.telegram || ''
  form.value.social.twitter = (product.value as any)?.social?.twitter || ''
  form.value.social.vk = (product.value as any)?.social?.vk || ''
  form.value.social.website = (product.value as any)?.social?.website || ''
  form.value.social.whatsapp = (product.value as any)?.social?.whatsapp || ''
  //faq
  form.value.faq = (product.value as any)?.faq ? (product.value as any)?.faq?.map((f: any) => ({ quest: f.quest, ans: f.ans })) : []


}, { deep: true, immediate: true })


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

const { execute: updateProduct, loading: posting } =
  productApi.put({}, {
    onSuccess: () => {
      navigateTo(routes.admin.product.index)
    }
  });

const submit = () => {
  const formData = convertToFormData(form.value)
  updateProduct(route.params.id as string, formData)
};

const screenShotUrls = computed(() => {
  return form.value.images.map((img: File) => URL.createObjectURL(img))
})

const deleteSavedScreenshot = (id: string, index: number) => {
  if (confirm('Are you sure you want to delete the saved screenshot')) {
    productApi.deleteScreenShot(id, {
      onSuccess: () => {
        product.value?.screenshots?.splice(index, 1)
      }
    })
  }
}

</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.product.index)

      }
        " />
      <span class="text-h6"> Edit Product </span>
    </div>
    <q-form @submit="submit" @validation-error="srollToView">
      <div class="q-gutter-y-sm">
        <h6>General Information</h6>
        <div class="row q-col-gutter-md">
          <q-select v-if="users" outlined v-model="form.product.userId" emit-value map-options label="Select User"
            class="col-12 col-sm-6 col-md-3" :rules="[
              rules.required('required'),
            ]" :options="[...users.map((l: any) => ({ label: l?.first_name, value: l?.id }))]" />
          <q-input outlined v-model="form.product.companyName" label="Company Name" class="col-12 col-sm-6 col-md-3" />
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
            <FormsImageInput name="logo" @image="(f) => { form.logo = f as unknown as null }" style="max-width: 15rem;"
              :url="product?.logo && $config.public.baseApi + product?.logo?.url" />
          </div>
          <q-input outlined v-model="form.product.name" label="ProductName" class="col-12 col-sm-6 col-md-3" :rules="[
            rules.required('Product name is required'),
          ]" />
          <q-input type="email" outlined v-model="form.product.email" label="Product Email"
            class="col-12 col-sm-6 col-md-3" :rules="[
              rules.email('Not Valid Email'),
            ]" />
          <q-input type="number" outlined v-model="form.product.phone" label="Product Phone"
            class="col-12 col-sm-6 col-md-3" :rules="[
              rules.minLength(9, 'Phone number not valid'),
            ]" />
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
          <FormsImageInput name="logo" @image="(f) => { form.cover = f as unknown as null }" style="max-width: 15rem;"
            :url="product?.cover && $config.public.baseApi + product?.cover?.url" />
        </div>
        <div class="col-12 q-mb-xl">
          <div class=" q-py-xs" style="font-weight: 500;">Product Brochure</div>
          <FormsImageInput name="logo" @image="(f) => { form.brocher = f as unknown as null }" style="max-width: 15rem;"
            :url="product?.brocher && $config.public.baseApi + product?.brocher?.url" />
        </div>
        <div class="col-12 q-mb-xl">
          <div class="q-py-md" style="font-weight: 500;">Product Screenshots (Max 5 images)</div>
          <div class="row q-my-md q-col-gutter-md">
            <div v-for="(s, i) in product?.screenshots" :key="i" class="relative-position">
              <q-img alt="Preview" style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;"
                :src="$config.public.baseApi + s?.file?.url" />
              <q-badge floating color="red" style="cursor: pointer;" @click="() => deleteSavedScreenshot(s?.id, i)">
                <q-icon name="close" />
              </q-badge>
            </div>
          </div>
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
                style="display: none;" append :max-files="product?.screenshots ? 5 - product.screenshots.length : 5" />
              Upload Screenshots
            </div>
          </FormsMultiImageInput>
        </div>
        <div class="col-12 q-mb-xl" style="max-width: 25rem;">
          <div class=" q-py-xs" style="font-weight: 500;">Product Video (Mp4/Mpeg)</div>
          <FormsVideoInput name="video" @video="(v) => { form.video = v as unknown as null }"
            :url="product?.video && $config.public.baseApi + product?.video?.file?.url" />
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
