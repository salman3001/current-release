<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { productApi } from '../../../utils/BaseApiService';
import { onMounted, ref } from 'vue';

const router = useRouter();
const route = useRoute();
const uploads = ref('');


const product = ref<null | Record<string, any>>(null);
productApi.show(route.params.id as string, {
  populate: {
    user: {
      fields: ['first_name', 'last_name'],
    },
    productCategory: {
      fields: ['name'],
    },
    productSubcategory: {
      fields: ['name'],
    },
    social: {
      fields: ['*']
    },
    faq: {
      fields: ['*']
    },
    tags: {
      fields: ['name', 'id']
    },
    seo: {
      fields: ['*']
    },
    video: {
      fields: ['*']
    },
    screenshots: {
      fields: ['*']
    }
  },
}).then(({ data }) => {
  product.value = data.value;
});

onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
});
</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.product.index' });
      }
        " />
      <span class="text-h6"> View Product </span>
    </div>
    <div v-if="product" class="q-gutter-y-lg">
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          General Information
        </p>
        <div class="q-py-md" style="overflow-x: scroll">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  User
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Company
                </th>
                <th style="text-align: start; padding: 0.5rem">Category</th>
                <th style="text-align: start; padding: 0.5rem">Sub Category</th>
                <th style="text-align: start; padding: 0.5rem">Tags</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">
                  <div v-if="product?.user">
                    {{ product?.user?.first_name + " " + product?.user?.last_name }}
                  </div>
                </td>
                <td style="padding: 0.5rem">{{ product?.company_name }}</td>
                <td style="padding: 0.5rem">
                  {{ product?.productCategory?.name }}
                </td>
                <td style="padding: 0.5rem;min-width: 10rem;">
                  {{ product?.productSubcategory?.name }}
                </td>
                <td style="padding: 0.5rem;min-width: 10rem;">
                  <div class="flex q-gutter-xs">
                    <q-badge color="positive" size="30px" v-for="tag in product?.tags" :key="tag?.id">
                      {{ tag?.name }}
                    </q-badge>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">
          product Information
        </p>
        <div>
          <q-img spinner-color="white" :src="product.logo?.url
            ? uploads + product.logo?.url
            : '/images/dummy-thumb.jpg'
            " :alt="product?.name"
            style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
        </div>
        <div class="q-py-md" style="overflow-x: scroll">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Product Name
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Product Website
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Product Phone
                </th>
                <th style="text-align: start; padding: 0.5rem">Product Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">{{ product?.name }}</td>
                <td style="padding: 0.5rem">{{ product?.social?.website }}</td>
                <td style="padding: 0.5rem">{{ product?.phone }}</td>
                <td style="padding: 0.5rem">
                  {{ product?.email }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <h6 class="text-grey-8" style="font-weight: 400">Description</h6>
        <div class="q-gutter-lg">
          <div>
            <p style="color: #686552;">Short Description</p>
            <p>{{ product?.short_desc }}</p>
          </div>
          <div>
            <p style="color: #686552;">Long Description</p>
            <p>{{ product?.long_desc }}</p>
          </div>
        </div>
      </div>
      <div v-if="product?.faq" class="q-gutter-md">
        <p class="text-grey-8 text-h6" style="font-weight: 400">FAQ</p>
        <div class="column" v-for="(f, i) in product.faq" :key="f?.id">
          <p style="color: #686552;">Question {{ i + 1 }}: {{ f?.quest }}</p>
          <p>Answer : {{ f?.ans }}</p>
        </div>
      </div>
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">Media/Screenshots</p>
        <div v-if="product?.logo" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Product Logo</p>
            <div>
              <q-img spinner-color="white" :src="uploads + product.logo?.url" :alt="product?.name"
                style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
            </div>
          </div>
        </div>
        <div v-if="product?.screenshots" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Screenshots</p>
            <div class="q-gutter-md">
              <q-img spinner-color="white" v-for="(s, i) in product?.screenshots" :key="i" :src="uploads + s?.file?.url"
                style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
            </div>
          </div>
        </div>
        <div v-if="product?.cover" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Cover Photo</p>
            <div>
              <q-img spinner-color="white" :src="uploads + product.cover?.url" :alt="product?.name"
                style="height: 15rem; max-width: 30rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
            </div>
          </div>
        </div>
        <div v-if="product?.brocher" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Brochure</p>
            <div>
              <q-img spinner-color="white" :src="uploads + product.brocher?.url" :alt="product?.name"
                style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />

            </div>
          </div>
        </div>
        <div v-if="product?.video" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Video</p>
            <div>
              <video width="320" height="240" controls style="border-radius: 20px;">
                <source :src="uploads + product.video?.url" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="q-py-md full-width" v-if="product?.social">
      <p class="text-h6" style="color:#686552">Social Links

      </p>
      <div style="display: flex;flex-wrap: wrap; gap: 20px;">
        <div>
          <p style="color: #686552;">Twitter</p>
          <p>{{ product?.social?.twitter }}</p>
        </div>
        <div>
          <p style="color: #686552;">Facebook</p>
          <p>{{ product?.social?.facebook }}</p>
        </div>
        <div>
          <p style="color: #686552;">instagram</p>
          <p>{{ product?.social?.instagram }}</p>
        </div>
        <div>
          <p style="color: #686552;">Linked In</p>
          <p>{{ product?.social?.linkedin }}</p>
        </div>
        <div>
          <p style="color: #686552;">Pintrest</p>
          <p>{{ product?.social?.pintrest }}</p>
        </div>
        <div>
          <p style="color: #686552;">Telegram</p>
          <p>{{ product?.social?.telegram }}</p>
        </div>
        <div>
          <p style="color: #686552;">Vk</p>
          <p>{{ product?.social?.vk }}</p>
        </div>
        <div>
          <p style="color: #686552;">Website</p>
          <p>{{ product?.social?.website }}</p>
        </div>
        <div>
          <p style="color: #686552;">Whatsapp</p>
          <p>{{ product?.social?.whatsapp }}</p>
        </div>
      </div>
    </div>
    <div v-if="product?.seo">
      <p class="text-grey-8 text-h6" style="font-weight: 400">
        SEO Information
      </p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Title</p>
          {{ product?.seo?.meta_title }}
        </div>
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Keywords</p>
          {{ product?.seo?.meta_keywords }}
        </div>
        <div class="col-12">
          <p class="text-grey-8" style="font-weight: 500">Meta Description</p>
          {{ product?.seo?.meta_desc }}
        </div>
      </div>
    </div>
  </div>
</template>
