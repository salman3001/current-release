<script setup lang="ts">
import { mediaApi } from 'src/utils/BaseApiService';
import { onMounted, ref } from 'vue';
import { MediaTypes } from 'src/utils/enums'
import SearchInput from 'src/components/forms/SearchInput.vue';

const videos = ref<null | Record<string, any>>(null)
const search = ref('')
const page = ref(1)
const showModal = ref(false)
const uploads = ref('');
const form = ref({
  name: '',
  type: MediaTypes.VIDEO,
  video: null,
})


const getVideos = () => {
  mediaApi.index({
    populate: {
      video: {
        fields: ['*'],
      }
    },
    page: page.value,
    search: {
      name: search.value
    },
    filter: {
      type: MediaTypes.VIDEO
    },
    rowsPerPage: '20'
  }).then(({ data }) => {
    videos.value = data.value
  })
}

const { execute, loading } = mediaApi.post({
  headers: {
    'Content-Type': 'multipart/form-data'
  }
}, {
  onSuccess: () => {
    showModal.value = false
    getVideos()
    form.value.name = ''
    form.value.video = null
  }
})

const { execute: deleteMedia } = mediaApi.delete({}, {
  onSuccess: () => {
    getVideos()
  }
})

const deleteMediaHandler = (id: string) => {
  if (confirm('Are You Sure? You Want to delete this image')) { deleteMedia(id) }
}


onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
  getVideos()
})

</script>

<template>
  <q-page class="row q-pa-lg">
    <div class="colomn q-gutter-y-lg" style="width: 100%">
      <div class="row justify-between q-gutter-y-lg">
        <SearchInput @search="(val: string) => {
          search = val
          getVideos()
        }
          " />

        <div class="row q-gutter-sm">
          <q-btn color="primary" @click="() => {
            showModal = !showModal
          }
            ">+ Add Videos</q-btn>
        </div>
      </div>
      <div class="q-pt-lg">
        <div v-if="videos" class="row q-gutter-lg">
          <div v-for="(vid, i) in videos.data" :key="i"
            style="height: 400px; max-width: 450px;width: 100%;border:1px solid lightgray; border-radius: 10px;"
            class="column justify-between relative-position q-pa-md">
            <p>{{ vid?.name }}</p>
            <q-video :src="uploads + vid.video?.file?.url" style="height: 70%;">
            </q-video>
            <q-badge color="red-6" align="middle" floating style="cursor: pointer;padding: 10px;;border-radius: 0px;"
              @click="() => { deleteMediaHandler(vid.id) }">
              <q-icon name="close" size="15px" />
            </q-badge>
            <q-input dense :model-value="uploads + vid.video?.file?.url" />
          </div>

        </div>
        <div v-if="videos" class="row full-width justify-end q-pt-lg">
          <q-pagination v-model="page" :max="Math.ceil(videos?.meta.total / videos?.meta.per_page)" max-pages="10"
            boundary-numbers direction-links outline color="grey-10" active-design="unelevated" active-color="primary"
            active-text-color="white" @update:model-value="() => {
              getVideos()
            }"></q-pagination>
        </div>
      </div>
    </div>
  </q-page>
  <q-dialog v-model="showModal">
    <q-card style="width: 100%">
      <q-toolbar style="background-color: #ebeae4">
        <q-toolbar-title><span class="text-weight-bold">Add Video</span></q-toolbar-title>
        <q-btn flat dense icon="close" v-close-popup />
      </q-toolbar>

      <q-card-section class="column q-px-md-sm">
        <q-form @submit="async () => {
          await execute(form);
        }
          ">
          <q-input outlined v-model="form.name" label="Name" :rules="[$rules.required('required')]" />
          <q-file v-model="form.video" label="Video" class="col-12 col-sm-6 col-md-3" accept="mp4" outlined
            max-file-size="20000000" :rules="[$rules.required('required')]" />
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
