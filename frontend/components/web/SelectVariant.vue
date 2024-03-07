<template>
  <q-img
    v-for="mode in 4"
    :key="mode"
    src="https://picsum.photos/500/300"
    style="max-width: 150px; height: 100px"
    :fit="mode"
    class="cols-2 cols-sm-3 cols-md-4 cols-lg-5"
  >
    <div class="absolute-bottom text-subtitle1 text-center">Variant</div>
  </q-img>
</template>
