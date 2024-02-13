<script setup lang="ts">
import { Ref, ref } from 'vue';

defineProps<{
  name: string,
  error?: string
  url?: string
  maxSize?: string
}>()

const emit = defineEmits<{
  (e: 'video', video: File): void
}>()

const file = ref<File | null>(null)
const previewVideoRef = ref(null) as unknown as Ref<HTMLImageElement>


function previewSelectedVideo() {
  if (file.value && ['video/mp4', 'video/mpeg'].includes(file.value.type)) {
    const reader = new FileReader();
    reader.readAsDataURL(file.value);
    reader.onload = function (e: any) {
      previewVideoRef.value.src = e.target.result as string;
    }

    emit('video', file.value)
  }
}
</script>

<template>
  <div class="column justify-center items-center full-width"
    style=" border: 1px solid lightgray;border-radius: 10px;overflow: hidden;">
    <label>
      <video ref="previewVideoRef" controls :src="url" style="width: 100%; aspect-ratio: 16/9;" />
    </label>
    <div>
      <q-file dense filled v-model="file" :name="name" accept="video/mp4,video/mpeg" :max-file-size="maxSize ?? 21000000"
        label="Upload Video" @update:model-value="previewSelectedVideo" style="width: 100%;">
        <template v-slot:prepend>
          <q-icon name="attach_file" />
        </template>
      </q-file>
    </div>

  </div>
</template>
