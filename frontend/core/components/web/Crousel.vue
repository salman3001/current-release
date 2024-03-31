<script setup lang="ts">
import type { RouteLocationRaw } from "vue-router";

const slide = ref(1);
const controls = ref(false);
const autoplay = ref(false);

const props = defineProps<{
  to?: RouteLocationRaw;
  height?: string;
  rounded?: boolean;
  duration?: number;
  reactOnMouse?: boolean
  imageUrls: string[]
}>();

const atMouseOver = () => {
  controls.value = true;
  autoplay.value = props.duration || 1500;
};

const atMouseLeave = () => {
  controls.value = false;
  autoplay.value = false;
};
</script>

<template>
  <q-carousel animated swipeable v-model="slide" :arrows="controls" :autoplay="autoplay" :navigation="true" infinite
    transition-prev="slide-right" transition-next="slide-left" @mouseenter.stop="atMouseOver"
    @mouseleave.stop="atMouseLeave" :height="height || '200px'" control-type="unelevated" control-color="primary">
    <template v-slot:navigation-icon="{ active, btnProps, onClick }">
      <q-btn size="xs" color="white" flat round dense @click.stop="onClick">
        <q-icon :name="btnProps.icon" :color="active ? 'primary' : 'grey-6'"></q-icon>
      </q-btn>
    </template>
    <q-carousel-slide v-for="url, i in imagesUrls" :key="i" :name="1" :img-src="url" class="cursor-pointer"
      :class="rounded ? 'rounded-borders' : ''" @click="() => {
    to && navigateTo(to);
  }
    " />
  </q-carousel>
</template>
