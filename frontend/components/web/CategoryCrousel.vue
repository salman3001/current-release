<script setup lang="ts">
import { ref } from "vue";

const slide = ref(1);
</script>

<template>
  <q-carousel
    v-model="slide"
    transition-prev="slide-right"
    transition-next="slide-left"
    swipeable
    animated
    control-color="grey-6"
    control-type=""
    arrows
    height="250px"
    class="rounded-borders"
  >
    <q-carousel-slide
      v-for="(s, i) in 3"
      :name="i + 1"
      class="column no-wrap"
      v-if="$q.screen.lt.sm"
    >
      <div
        class="row fit q-pa-none justify-start items-center q-gutter-x-md q-col-gutter no-scroll no-wrap"
      >
        <q-img
          class="rounded-borders col-12 full-height"
          src="https://cdn.quasar.dev/img/mountains.jpg"
        >
          <div class="absolute-bottom text-subtitle1">
            <p class="q-ma-none">Category</p>
            <p class="q-ma-none text-caption">Description</p>
          </div>
        </q-img>
      </div>
    </q-carousel-slide>

    <q-carousel-slide
      v-for="(s, i) in 3"
      :name="i + 1"
      class="column no-wrap"
      v-else-if="$q.screen.gt.xs && $q.screen.lt.md"
    >
      <div
        class="row fit justify-start items-center q-gutter-x-md q-col-gutter no-scroll no-wrap"
      >
        <q-img
          class="rounded-borders col-6 full-height"
          src="https://cdn.quasar.dev/img/parallax2.jpg"
        >
          <div class="absolute-bottom text-subtitle1">
            <p class="q-ma-none">Category</p>
            <p class="q-ma-none text-caption">Description</p>
          </div>
        </q-img>
        <q-img
          class="rounded-borders col-6 full-height"
          src="https://cdn.quasar.dev/img/quasar.jpg"
        >
          <div class="absolute-bottom text-subtitle1">
            <p class="q-ma-none">Category</p>
            <p class="q-ma-none text-caption">Description</p>
          </div>
        </q-img>
      </div>
    </q-carousel-slide>

    <q-carousel-slide
      v-for="(s, i) in 3"
      :name="i + 1"
      class="column no-wrap"
      v-else-if="$q.screen.gt.sm"
    >
      <div
        class="row fit justify-start items-center q-gutter-x-md q-col-gutter no-scroll no-wrap"
      >
        <q-img
          class="rounded-borders col-3 full-height"
          src="https://cdn.quasar.dev/img/material.png"
        >
          <div class="absolute-bottom text-subtitle1">
            <p class="q-ma-none">Category</p>
            <p class="q-ma-none text-caption">Description</p>
          </div>
        </q-img>
        <q-img
          class="rounded-borders col-3 full-height"
          src="https://cdn.quasar.dev/img/donuts.png"
        >
          <div class="absolute-bottom text-subtitle1">
            <p class="q-ma-none">Category</p>
            <p class="q-ma-none text-caption">Description</p>
          </div>
        </q-img>
        <q-img
          class="rounded-borders col-3 full-height"
          src="https://cdn.quasar.dev/img/material.png"
        >
          <div class="absolute-bottom text-subtitle1">
            <p class="q-ma-none">Category</p>
            <p class="q-ma-none text-caption">Description</p>
          </div>
        </q-img>
        <q-img
          class="rounded-borders col-3 full-height"
          src="https://cdn.quasar.dev/img/donuts.png"
        >
          <div class="absolute-bottom text-subtitle1">
            <p class="q-ma-none">Category</p>
            <p class="q-ma-none text-caption">Description</p>
          </div>
        </q-img>
      </div>
    </q-carousel-slide>
  </q-carousel>
</template>
