<script setup lang="ts">
import { Ref, ref } from 'vue';

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
    style=" border: 1px solid lightgray;border-radius: 10px;overflow: hidden;">
    <label>
      <img ref="previewImageRef" alt="Preview" style="width: 15rem;height: 13rem;" :src="url
        ?? '/images/dummy-thumb.jpg'">
    </label>
    <div>
      <q-file dense filled v-model="file" :name="name" accept="jpg,jpeg,png,webp" max-file-size="5000000"
        label="Upload Image" @update:model-value="previewSelectedImage" style="width: 100%;">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>

  </div>
</template>
