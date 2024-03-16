<script setup lang="ts">
const props = defineProps<{
  category: IServiceCategory;
  selected: boolean;
}>();

const icons = ["home", "shower", "shower", "difference", "flatware", "hearing"];

const choosenIcon = Math.floor(Math.random() * icons.length);

const emit = defineEmits<{
  (e: "select", id: number): void;
}>();

const hovered = ref(false);

const iconUrl = props.category?.thumbnail?.url
  ? `img:${props.category?.thumbnail?.url}`
  : "category";
</script>

<template>
  <div
    class="column justify-center items-center text-center cursor-pointer text-muted text-caption"
    :style="{ borderBottom: hovered || selected ? '2px solid' : '' }"
    style="width: 80px; height: 70px"
    @click="
      () => {
        emit('select', category.id);
      }
    "
    :class="hovered || selected ? 'text-primary' : ''"
    @mouseenter="hovered = true"
    @mouseleave="hovered = false"
  >
    <div class="col-6">
      <q-icon :name="icons[choosenIcon]" size="30px"></q-icon>
    </div>
    <div class="col-6">
      <span class="ellipsis-2-lines" style="font-size: small; line-height: 18px"
        >{{ category?.name }}
      </span>
    </div>
  </div>
</template>
