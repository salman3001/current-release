<script setup lang="ts">

const props = defineProps<{
  height: string;
  width: string;
  scrollPosition?: number
  duration?: number
  visible?: boolean
}>();

const scrollRef = ref(null)


onMounted(() => {
  scrollRef.value.setScrollPosition('horizontal', 0, props.duration)
})

onUpdated(() => {
  scrollRef.value.setScrollPosition('horizontal', props.scrollPosition || 0, props.duration)
})

</script>

<template>
  <q-scroll-area ref="scrollRef" :style="{ height: height, maxWidth: width }" :visible="visible || false" :thumb-style="{
    right: '4px',
    borderRadius: '5px',
    backgroundColor: '#3a887c',
    width: '3px',
    height: '3px',
    opacity: 1,
  }" :bar-style="{
    right: '4px',
    borderRadius: '5px',
    backgroundColor: 'lightgrey',
    width: '100%',
    height: '5px',
    opacity: 1,
  }">
    <slot />
  </q-scroll-area>
</template>
