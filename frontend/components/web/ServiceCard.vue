<script setup lang="ts">
const stars = ref(4);
</script>

<template>
  <q-card class="my-card" flat bordered>
    <q-img
      src="https://d3c32wtptb9fw6.cloudfront.net/2-1599220652-Barbers-and-Beauty---Hairstylists.png"
    />

    <q-card-section>
      <q-btn
        fab
        color="primary"
        icon="place"
        class="absolute"
        style="top: 0; right: 12px; transform: translateY(-50%)"
      />

      <div class="row no-wrap items-center">
        <div class="col text-h6 ellipsis">Cafe Basilico</div>
        <div
          class="col-auto text-grey text-caption q-pt-md row no-wrap items-center"
        >
          <q-icon name="place" />
          250 ft
        </div>
      </div>

      <q-rating v-model="stars" :max="5" size="32px" />
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="text-subtitle1">200Rs/-</div>
      <div class="text-caption text-grey">
        Small plates, salads & sandwiches in an intimate setting.
      </div>
    </q-card-section>

    <q-separator />

    <q-card-actions class="justify-end">
      <q-btn outline color="primary" icon="bookmark_add">
        <q-tooltip> Add to Wishlist </q-tooltip>
      </q-btn>
      <q-btn outline color="primary" icon="shopping_cart">
        <q-tooltip> Add to cart </q-tooltip>
      </q-btn>
    </q-card-actions>
  </q-card>
</template>
