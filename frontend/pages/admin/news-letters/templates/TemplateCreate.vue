<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
  templateApi,
} from 'src/utils/BaseApiService';
import { ref } from 'vue';
import ImageInput from 'src/components/forms/ImageInput.vue';
import { srollToView } from 'src/utils/scrollToView';
import { ckConfig } from 'src/utils/ckConfig';

const router = useRouter();

const form = ref({
  thumbnail: null,
  template: {
    name: '',
    desc: '',
    content: '',
  },
});


const { execute: createTemplate, loading: posting } =
  templateApi.post({
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }, {
    onSuccess: () => {
      router.push({ name: 'admin.template.index' });
    }
  });

const submit = () => {
  createTemplate(form.value)
};

</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.template.index' });
      }
        " />
      <span class="text-h6"> Add Template </span>
    </div>
    <q-form @submit="submit" @validation-error="srollToView">
      <div class="q-gutter-y-sm">
        <div class="row q-col-gutter-md">
          <div class="col-12 q-mb-xl">
            <div class="q-py-xs" style="font-weight: 500;">Image</div>
            <ImageInput name="image" @image="(f) => { form.thumbnail = f as unknown as null }"
              style="max-width: 15rem;" />
          </div>
          <q-input outlined v-model="form.template.name" label="Name" class="col-12 col-sm-6 col-md-3" :rules="[
            $rules.required('Name is required'),
          ]" />
        </div>
      </div>
      <div>
        <h6>Description</h6>
        <div class="row q-col-gutter-lg">
          <q-input type="textarea" outlined v-model="form.template.desc" label="Description" class="col-12 " />
          <div class="full-width" style="display: flex; min-height: 25rem; flex-direction: column;">
            <h6>Content</h6>
            <ckeditor v-model="form.template.content" :config="ckConfig"></ckeditor>
          </div>
        </div>
      </div>
      <div class="row justify-end q-gutter-md q-pt-xl">
        <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
          router.push({ name: 'admin.template.index' });
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
