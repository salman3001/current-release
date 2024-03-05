<script setup lang="ts">


const items = [{
    src: 'https://cdn.quasar.dev/img/mountains.jpg',
    thumbnail: 'https://cdn.quasar.dev/img/mountains.jpg',
    w: 600,
    h: 400,
    alt: 'some numbers on a grey background' // optional alt attribute for thumbnail image
},
{
    src: 'https://cdn.quasar.dev/img/material.png',
    thumbnail: 'https://cdn.quasar.dev/img/material.png',
    w: 600,
    h: 400,
}
]
</script>

<template>
    <div class="q-pa-sm q-pa-sm-md q-pa-lg-xl">
        <div class="row justify-between items-center">
            <h1 class="text-h4 text-secondary">Lorem, ipsum dolor sit amet consectetur adipisicing elit.</h1>
            <div class="row items-center q-gutter-sm text-h5 text-muted">
                <NuxtLink class="text-muted underline" to="/"><q-btn left flat icon="share"> Share</q-btn></NuxtLink>
                <NuxtLink class="text-muted underline" to="/"><q-btn left flat icon="favorite"> Share</q-btn></NuxtLink>
            </div>
            <div>
                <vue-picture-swipe :items="items" :options="{
                    gallery: '#gallery--test-bgopacity',
                    children: 'a',
                    spacing: 0.5, // 50% of viewport width
                    bgOpacity: 0.2,
                    wheelToZoom: false,
                    arrowKeys: true
                }"></vue-picture-swipe>
            </div>
        </div>
    </div>
</template>