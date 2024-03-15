<script setup lang="ts">

const slide = ref(1);
const controls = ref(false);
const autoplay = ref(false);
const color = ref("grey-4");

defineProps<{ service: IService }>();

const atMouseOver = () => {
  controls.value = true
  autoplay.value = 1500
}

const atMouseLeave = () => {
  controls.value = false
  autoplay.value = false
}
</script>

<template>
  <q-card class="my-card relative-position shadow-6 border" flat style="height: 25rem;">
    <div class="">
      <q-carousel animated swipeable v-model="slide" :arrows="controls" :autoplay="autoplay" :navigation="true" infinite
        transition-prev="slide-right" transition-next="slide-left" @mouseenter.stop="atMouseOver"
        @mouseleave.stop="atMouseLeave" height="200px" control-type="regular" control-color="primary">
        <template v-slot:navigation-icon="{ active, btnProps, onClick }">
          <q-btn size="xs" color="white" flat round dense @click.stop="onClick">
            <q-icon :name="btnProps.icon" :color="active ? 'primary' : 'grey-6'"></q-icon>
          </q-btn>
        </template>
        <q-carousel-slide :name="1" img-src="/images/sample-cover.jpg" class="rounded-borders cursor-pointer"
          @click="() => navigateTo(routes.view_service(service.slug))" />
        <q-carousel-slide :name="2" img-src="/images/login-art.jpg" class="rounded-borders cursor-pointer"
          @click="navigateTo(routes.view_service(service.slug))" />
        <q-carousel-slide :name="3" img-src="/images/sample-cover.jpg" class="rounded-borders cursor-pointer"
          @click="navigateTo(routes.view_service(service.slug))" />
        <q-carousel-slide :name="4" img-src="/images/login-art.jpg" class="rounded-borders cursor-pointer"
          @click="navigateTo(routes.view_service(service.slug))" />
      </q-carousel>
    </div>

    <q-card-section>
      <div class="row justify-between items-center">
        <NuxtLink :to="routes.view_service(service?.slug)">
          <div class="col text-h6 ellipsis text-nutral">
            {{ service?.name }}
          </div>
        </NuxtLink>
      </div>
    </q-card-section>


    <q-card-section class="q-pt-none">
      <div class="text-caption text-muted ellipsis-3-lines">
        {{ service?.short_desc }}
      </div>
    </q-card-section>
    <q-card-section class="q-pt-none">

      <div class="row justify-between">
        <div class="">
          <span> {{ service.variants?.length ? 1 && "Starting From" : "" }}</span><span class="text-bold text-h6">
            &#x20B9;{{
        service.variants?.length > 1
          ? service?.meta?.starting_from
          : service?.variants[0]?.price
      }}</span>
        </div>
        <div class="row items-center q-gutter-xs">
          <q-icon name="star" color="yellow-9" size="30px"></q-icon><span class="subtitle1">{{ service.avg_rating
            }} (28)</span>
        </div>
      </div>
    </q-card-section>
    <div class="absolute-top-right">

      <q-icon name="favorite" outline :color="color" @mouseenter="color = 'pink'" @mouseleave="color = 'grey-4'"
        class="cursor-pointer" size="30px" style="top: 25px; right: 25px; opacity: 0.8"></q-icon>
    </div>
  </q-card>
</template>
