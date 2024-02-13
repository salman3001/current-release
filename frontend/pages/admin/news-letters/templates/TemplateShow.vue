<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { templateApi } from 'src/utils/BaseApiService';
import { onMounted, ref } from 'vue';

const router = useRouter();
const route = useRoute();
const uploads = ref('');


const template = ref<null | Record<string, any>>(null);
templateApi.show(route.params.id as string).then(({ data }) => {
  template.value = data.value;
});

onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
});
</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.template.index' });
      }
        " />
      <span class="text-h6"> View template </span>
    </div>
    <div v-if="template" class="q-gutter-y-lg">
      <div>
        <div class="q-py-md">
          <q-img spinner-color="white" :src="template.thumbnail?.url
            ? uploads + template.thumbnail?.url
            : '/images/dummy-thumb.jpg'
            " :alt="template?.name"
            style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
        </div>
      </div>
      <div>
        <div class="q-gutter-lg">
          <div>
            <p style="color: #686552;">Description</p>
            <p>{{ template?.desc }}</p>
          </div>
          <div>
            <p style="color: #686552;">Content</p>
            <p v-html="template.content"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
