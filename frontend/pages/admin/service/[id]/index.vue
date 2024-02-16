<script setup lang="ts">
import { serviceApi } from '@/utils/BaseApiService';


const route = useRoute();


const { data: service } = await serviceApi.show(route.params.id as string, {
  populate: {
    user: {
      fields: ['first_name', 'last_name'],
    },
    serviceCategory: {
      fields: ['name'],
    },
    serviceSubcategory: {
      fields: ['name'],
    },
    social: {
      fields: ['*']
    },
    faqs: {
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
})


</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.service.index)
      }
        " />
      <span class="text-h6"> View Service </span>
    </div>
    <div v-if="service" class="q-gutter-y-lg">
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
                  <div v-if="service?.user">
                    {{ service?.user?.first_name + " " + service?.user?.last_name }}
                  </div>
                </td>
                <td style="padding: 0.5rem">{{ service?.company_name }}</td>
                <td style="padding: 0.5rem">
                  {{ service?.serviceCategory?.name }}
                </td>
                <td style="padding: 0.5rem;min-width: 10rem;">
                  {{ service?.serviceSubcategory?.name }}
                </td>
                <td style="padding: 0.5rem;min-width: 10rem;">
                  <div class="flex q-gutter-xs">
                    <q-badge color="positive" size="30px" v-for="tag in service?.tags" :key="tag?.id">
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
          service Information
        </p>
        <div>
          <q-img spinner-color="white" :src="service.logo?.url
            ? $config.public.baseApi + service.logo?.url
            : '/images/dummy-thumb.jpg'
            " :alt="service?.name"
            style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
        </div>
        <div class="q-py-md" style="overflow-x: scroll">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Service Name
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Service Website
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 10rem">
                  Service Phone
                </th>
                <th style="text-align: start; padding: 0.5rem">service Email</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">{{ service?.name }}</td>
                <td style="padding: 0.5rem">{{ service?.social?.website }}</td>
                <td style="padding: 0.5rem">{{ service?.phone }}</td>
                <td style="padding: 0.5rem">
                  {{ service?.email }}
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
            <p>{{ service?.short_desc }}</p>
          </div>
          <div>
            <p style="color: #686552;">Long Description</p>
            <p>{{ service?.long_desc }}</p>
          </div>
        </div>
      </div>
      <div v-if="service?.faqs" class="q-gutter-md">
        <p class="text-grey-8 text-h6" style="font-weight: 400">FAQ</p>
        <div class="column" v-for="(f, i) in service.faqs" :key="f?.id">
          <p style="color: #686552;">Question {{ i + 1 }}: {{ f?.quest }}</p>
          <p>Answer : {{ f?.ans }}</p>
        </div>
      </div>
      <div>
        <p class="text-grey-8 text-h6" style="font-weight: 400">Media/Screenshots</p>
        <div v-if="service?.logo" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">service Logo</p>
            <div>
              <q-img spinner-color="white" :src="$config.public.baseApi + service.logo?.url" :alt="service?.name"
                style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
            </div>
          </div>
        </div>
        <div v-if="service?.screenshots" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Screenshots</p>
            <div class="q-gutter-md">
              <q-img spinner-color="white" v-for="(s, i) in service?.screenshots" :key="i" :src="$config.public.baseApi + s?.file?.url"
                style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
            </div>
          </div>
        </div>
        <div v-if="service?.cover" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Cover Photo</p>
            <div>
              <q-img spinner-color="white" :src="$config.public.baseApi + service.cover?.url" :alt="service?.name"
                style="height: 15rem; max-width: 30rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
            </div>
          </div>
        </div>
        <div v-if="service?.brocher" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Brochure</p>
            <div>
              <q-img spinner-color="white" :src="$config.public.baseApi + service.brocher?.url" :alt="service?.name"
                style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />

            </div>
          </div>
        </div>
        <div v-if="service?.video" class="q-pb-lg">
          <div class="colomn q-col-gutter-md">
            <p style="color: #686552;">Video</p>
            <div>
              <video width="320" height="240" controls style="border-radius: 20px;">
                <source :src="$config.public.baseApi + service.video?.file?.url" type="video/mp4">
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="q-py-md full-width" v-if="service?.social">
      <p class="text-h6" style="color:#686552">Social Links

      </p>
      <div style="display: flex;flex-wrap: wrap; gap: 20px;">
        <div>
          <p style="color: #686552;">Twitter</p>
          <p>{{ service?.social?.twitter }}</p>
        </div>
        <div>
          <p style="color: #686552;">Facebook</p>
          <p>{{ service?.social?.facebook }}</p>
        </div>
        <div>
          <p style="color: #686552;">instagram</p>
          <p>{{ service?.social?.instagram }}</p>
        </div>
        <div>
          <p style="color: #686552;">Linked In</p>
          <p>{{ service?.social?.linkedin }}</p>
        </div>
        <div>
          <p style="color: #686552;">Pintrest</p>
          <p>{{ service?.social?.pintrest }}</p>
        </div>
        <div>
          <p style="color: #686552;">Telegram</p>
          <p>{{ service?.social?.telegram }}</p>
        </div>
        <div>
          <p style="color: #686552;">Vk</p>
          <p>{{ service?.social?.vk }}</p>
        </div>
        <div>
          <p style="color: #686552;">Website</p>
          <p>{{ service?.social?.website }}</p>
        </div>
        <div>
          <p style="color: #686552;">Whatsapp</p>
          <p>{{ service?.social?.whatsapp }}</p>
        </div>
      </div>
    </div>
    <div v-if="service?.seo">
      <p class="text-grey-8 text-h6" style="font-weight: 400">
        SEO Information
      </p>
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Title</p>
          {{ service?.seo?.meta_title }}
        </div>
        <div class="col-12 col-sm-6">
          <p class="text-grey-8" style="font-weight: 500">Meta Keywords</p>
          {{ service?.seo?.meta_keywords }}
        </div>
        <div class="col-12">
          <p class="text-grey-8" style="font-weight: 500">Meta Description</p>
          {{ service?.seo?.meta_desc }}
        </div>
      </div>
    </div>
  </div>
</template>
