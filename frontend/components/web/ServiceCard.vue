<script setup lang="ts">
const slide = ref(1);
const controls = ref(false);
const color = ref("grey-9");
</script>

<template>
  <q-card class="my-card relative-position" flat>
    <div class="q-pa-md">
      <q-carousel animated v-model="slide" :arrows="controls" :navigation="true" infinite
        @mouseenter.stop="controls = true" @mouseleave.stop="controls = false" height="200px" control-type="regular"
        control-color="secondary">
        <template v-slot:navigation-icon="{ active, btnProps, onClick }">
          <q-btn size="xs" color="white" flat round dense @click.stop="onClick">
            <q-icon :name="btnProps.icon" :color="active ? 'secondary' : 'grey-6'"></q-icon>
          </q-btn>
        </template>
        <q-carousel-slide :name="1" img-src="https://cdn.quasar.dev/img/mountains.jpg"
          class="rounded-borders cursor-pointer" @click="navigateTo(routes.view_service('1'))" />
        <q-carousel-slide :name="2" img-src="https://cdn.quasar.dev/img/parallax1.jpg"
          class="rounded-borders cursor-pointer" @click="navigateTo(routes.view_service('1'))" />
        <q-carousel-slide :name="3" img-src="https://cdn.quasar.dev/img/parallax2.jpg"
          class="rounded-borders cursor-pointer" @click="navigateTo(routes.view_service('1'))" />
        <q-carousel-slide :name="4" img-src="https://cdn.quasar.dev/img/quasar.jpg"
          class="rounded-borders cursor-pointer" @click="navigateTo(routes.view_service('1'))" />
      </q-carousel>
    </div>

    <q-card-section>
      <div class="row justify-between items-center">
        <nuxt-link :to="routes.view_service('1')">
          <div class="col text-h6 ellipsis">Cafe Basilico</div>
        </nuxt-link>
        <div class="row items-center q-gutter-xs">
          <q-icon name="star" color="secondary" size="20px"></q-icon><span> 4.3</span>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-caption text-muted">
        Small plates, salads & sandwiches in an intimate setting.
      </div>
      <div class="text-subtitle1 text-bold">&#x20B9;200/-</div>
    </q-card-section>
    <div class="absolute-top-right">
      <q-icon name="favorite" :color="color" @mouseenter="color = 'pink'" @mouseleave="color = 'grey-9'"
        class="cursor-pointer" size="30px" style="top: 25px; right: 25px;opacity: 0.8;"></q-icon>
    </div>
  </q-card>
</template>
