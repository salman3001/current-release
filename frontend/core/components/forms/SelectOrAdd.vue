<script setup lang="ts">
import type { QSelect } from "quasar/dist/types/";

const props = defineProps<{
  options: string[];
}>();

const filterOptions = ref(props.options);

const createValue: QSelect["onNewValue"] = (val, done) => {
  if (val.length > 2) {
    if (!props.options.includes(val)) {
      done(val, "add-unique");
    }
  }
};

const filterFn: QSelect["onFilter"] = (val, update) => {
  update(() => {
    if (val === "") {
      filterOptions.value = props.options;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = props.options.filter(
        (v) => v.toLowerCase().indexOf(needle) > -1
      );
    }
  });
};
</script>

<template>
  <q-select
    use-input
    use-chips
    input-debounce="0"
    @new-value="createValue"
    :options="filterOptions"
    @filter="filterFn"
  />
</template>
