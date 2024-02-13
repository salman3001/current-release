<script setup lang="ts">
defineProps<{
  name: string
}>()

</script>

<template>
  <div className="relative flex max-w-[11rem]">
    <div className="flex">
      <img src={prop.url} alt="high class elite Escort in london" className="w-full" />
    </div>
    {/* backdrop */}
    <div className="absolute w-full h-full bg-gradient-to-t from-black to-transparent opacity-90"></div>
    <p className="absolute bottom-0 p-2 text-xs">{{ name }}</p>
    <button @click="() => {
      $emit('deleteFile');
    }" className="absolute p-0.5 bg-white rounded-full right-2 top-2">
      <RxCross2 color="black" />
    </button>
  </div>
</template>
