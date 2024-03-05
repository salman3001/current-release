<script setup lang="ts"></script>

<template>

  <div class="row q-px-sm q-px-sm-md items-center q-gutter-sm" style="border-bottom: 1px solid lightgrey">
    <ScrollArea height="100px" width="100%" class="col">
      <div class="row no-wrap q-py-md  q-gutter-x-xl no-scroll">
        <WebCategoryIcon v-for="n in 20" />
      </div>
    </ScrollArea>
  </div>

  <div class="q-pa-md">
    <div>
      <h2 class="text-h6 text-bold q-my-none">Popular Categories</h2>
      <p class="text-muted">A list of most popular categories</p>
      <div>
        <WebCategoryCrousel />
      </div>
    </div>
  </div>

  <div class="q-pa-md">
    <div>
      <h2 class="text-h6 text-bold q-my-none">Top Rated Services</h2>
      <p class="text-muted">A list of top rated services</p>
      <div class="row q-col-gutter-lg q-mt-sm">
        <div v-for="s in 20" class="col-12 col-sm-6 col-md-4 col-lg-3">
          <WebServiceCard />
        </div>
      </div>
    </div>
  </div>

</template>
