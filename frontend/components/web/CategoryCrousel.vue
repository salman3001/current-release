<script setup lang="ts">
import { ref } from "vue";

const slide = ref(1);

defineProps<{
  category: IServiceCategory[];
}>();

function isNumberInRange(
  numberToCheck: number,
  min: number,
  max: number
): boolean {
  return numberToCheck >= min && numberToCheck < max;
}
</script>

<template>
  <q-carousel
    v-model="slide"
    transition-prev="slide-right"
    transition-next="slide-left"
    swipeable
    animated
    control-color="primary"
    arrows
    height="250px"
    class="rounded-borders q-pa-none"
  >
    <template v-if="$q.screen.lt.sm">
      <q-carousel-slide v-for="(c, i) in category" :name="i + 1">
        <NuxtLink :to="routes.services_by_category(c.slug)">
          <div class="row fit justify-start q-gutter-md no-scroll no-wrap">
            <q-img
              class="rounded-borders col-12 full-height"
              :src="
                c.thumbnail?.url || '/images/service-category-placeholder.jpg'
              "
            >
              <div class="absolute-bottom text-subtitle1">
                <p class="q-ma-none">{{ c.name }}</p>
              </div>
            </q-img>
          </div>
        </NuxtLink>
      </q-carousel-slide>
    </template>
    <template
      v-for="(itr, i) in Math.ceil(category.length / 2)"
      v-else-if="$q.screen.gt.xs && $q.screen.lt.md"
    >
      <q-carousel-slide :name="i + 1">
        <div class="row fit justify-start q-gutter-md no-scroll no-wrap">
          <template v-for="(c, j) in category">
            <q-img
              class="rounded-borders col-6 full-height cursor-pointer"
              v-if="isNumberInRange(j, i * 2, i * 2 + 2)"
              :src="
                c.thumbnail?.url || '/images/service-category-placeholder.jpg'
              "
              @click="navigateTo(routes.services_by_category(c.slug))"
            >
              <div class="absolute-bottom text-subtitle1">
                <p class="q-ma-none">{{ c.name }}</p>
              </div>
            </q-img>
          </template>
        </div>
      </q-carousel-slide>
    </template>

    <template
      v-for="(itr, i) in Math.ceil(category.length / 4)"
      v-else-if="$q.screen.gt.sm"
    >
      <q-carousel-slide :name="i + 1">
        <div class="row fit justify-start q-gutter-md no-scroll no-wrap">
          <template v-for="(c, j) in category">
            <q-img
              class="rounded-borders col-4 full-height cursor-pointer"
              v-if="isNumberInRange(j, i * 4, i * 4 + 4)"
              :src="
                c.thumbnail?.url || '/images/service-category-placeholder.jpg'
              "
              @click="navigateTo(routes.services_by_category(c.slug))"
            >
              <div class="absolute-bottom text-subtitle1">
                <p class="q-ma-none">{{ c.name }}</p>
              </div>
            </q-img>
          </template>
        </div>
      </q-carousel-slide>
    </template>
  </q-carousel>
</template>
