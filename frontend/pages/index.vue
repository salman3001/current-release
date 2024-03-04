<script setup lang="ts"></script>

<template>
  <div>
    <div class="row q-px-md q-py-sm" style="border-bottom: 1px solid lightgrey">
      <h1 class="text-h6 text-bold">
        <q-icon name="category" color="purple"></q-icon> Services
      </h1>
    </div>
    <div class="full-width q-px-md" style="border-bottom: 1px solid lightgrey">
      <ScrollArea height="100px" width="100%">
        <div class="row no-wrap q-py-md q-gutter-x-xl no-scroll">
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
  </div>
</template>
