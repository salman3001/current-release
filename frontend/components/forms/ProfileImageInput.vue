<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  name: string,
  error?: string
  url?: string
}>()

const emit = defineEmits<{
  (e: 'image', image: File): void
}>()

const file = ref<File | null>(null)
const previewImageRef = ref(null) as unknown as Ref<HTMLImageElement>


function previewSelectedImage() {
  if (file.value && ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.value.type)) {
    const reader = new FileReader();
    reader.readAsDataURL(file.value);
    reader.onload = function (e: any) {
      previewImageRef.value.src = e.target.result as string;
    }

    emit('image', file.value)
  }
}

</script>

<template>
  <div class="column justify-center items-center"
    style="max-width:150px; border: 1px solid lightgray;border-radius: 10px;overflow: hidden;">
    <label>
      <img ref="previewImageRef" alt="Preview" style="max-width: 100%;" :src="url
        ?? '/images/upload-preview.png'">
    </label>
    <div>
      <q-file dense filled v-model="file" :name="name" accept="jpg,jpeg,png,webp" max-file-size="5000000"
        label="Upload File" @update:model-value="previewSelectedImage" style="width: 100%;">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>

  </div>
</template>
