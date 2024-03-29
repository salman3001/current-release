<script setup lang="ts">
import { mediaApi } from '@/utils/BaseApiService';
import { MediaTypes } from '@/utils/enums'


const search = ref('')
const page = ref(1)
const showModal = ref(false)

const form = ref({
  name: '',
  type: MediaTypes.IMAGE,
  image: null
})



const { data: images, execute: getImages } = await mediaApi.index({
  populate: {
    image: {
      fields: ['*'],
    }
  },
  page: page.value,
  search: {
    name: search.value
  },
  rowsPerPage: '20',
  filter: {
    type: MediaTypes.IMAGE
  },
})

const { execute, loading } = mediaApi.post({}, {
  onSuccess: () => {
    showModal.value = false
    getImages()
    form.value.name = ''
    form.value.image = null
  }
})

const { execute: deleteMedia } = mediaApi.delete({}, {
  onSuccess: () => {
    getImages()
  }
})

const deleteMediaHandler = (id: string) => {
  if (confirm('Are You Sure? You Want to delete this image')) { deleteMedia(id) }
}

const submit = () => {
  const formdata = convertToFormData(form.value
  )
  execute(formdata)
}


</script>

<template>
  <q-page class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-lg">
        <FormsSearchInput @search="(val: string) => {
          search = val
          getImages()
        }
          " />

        <div class="row q-gutter-sm">
          <q-btn color="primary" @click="() => {
            showModal = !showModal
          }
            ">+ Add Image</q-btn>
        </div>
      </div>
      <div class="q-pt-lg">
        <div v-if="images" class="row q-col-gutter-lg">
          <div v-for="(img, i) in images.data" :key="i" style="height: 400px; max-width: 450px;width: 100%;"
            class="column justify-between relative-position">
            <q-badge color="red-6" align="middle" floating style="cursor: pointer;padding: 10px;;border-radius: 0px;top: 20px;z-index: 20;"
              @click="() => { deleteMediaHandler(img.id) }">
              <q-icon name="close" size="15px" />
            </q-badge>
            <q-img :src="$config.public.baseApi + img.image?.file?.url" fit="cover" style="height: 85%;">
              <div class="absolute-bottom text-center">{{ img?.name }}</div>
            </q-img>
            <q-input dense :model-value="$config.public.baseApi + img.image?.file?.url" />
          </div>

        </div>
        <div v-if="images" class="row full-width justify-end q-pt-lg">
          <q-pagination v-model="page" :max="Math.ceil(images?.meta.total / images?.meta.per_page)" max-pages="10"
            boundary-numbers direction-links outline color="grey-10" active-design="unelevated" active-color="primary"
            active-text-color="white" @update:model-value="() => {
              getImages()
            }"></q-pagination>
        </div>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="showModal">
    <q-card style="width: 100%">
      <q-toolbar style="background-color: #ebeae4">
        <q-toolbar-title><span class="text-weight-bold">Add Image</span></q-toolbar-title>
        <q-btn flat dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="column q-px-md-sm">
        <q-form @submit="submit">
          <q-input outlined v-model="form.name" label="Name" :rules="[rules.required('required')]" />
          <q-file v-model="form.image" label="Image" class="col-12 col-sm-6 col-md-3" accept="jpg,jpeg,png,webp" outlined
            max-file-size="3000000" :rules="[rules.required('required')]" />
          <div class="row q-gutter-sm justify-end q-pt-lg">
            <q-btn flat style="background-color: #f2f0dc; min-width: 6rem" @click="showModal = !showModal">Cancle</q-btn>
            <q-btn color="primary" v-if="loading">
              <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                track-color="orange-2" />
            </q-btn>
            <q-btn color="primary" type="submit" :disable="loading" v-else style="min-width: 6rem">Upload</q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
