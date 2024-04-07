<script setup lang="ts">
defineProps<{
  modelValue: string;
}>();

const emits = defineEmits<{
  (e: "update:model-value", v: string): void;
}>();
</script>

<template>
  <q-input
    outlined
    :model-value="modelValue"
    mask="##/##/#### ##:##"
    :rules="[(v:string) => rules.dateTime(v) || 'date time is not valid']"
  >
    <template v-slot:append="props">
      {{ props }}
      <q-icon name="event" class="cursor-pointer">
        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
          <div class="row">
            <q-date
              :model-value="modelValue"
              mask="DD/MM/YYYY HH:mm"
              @update:model-value="(v:string)=>emits('update:model-value',v)"
            >
            </q-date>
            <q-time
              :model-value="modelValue"
              mask="DD/MM/YYYY HH:mm"
              @update:model-value="(v:string)=>emits('update:model-value',v)"
            />
          </div>
          <div class="row items-center justify-end">
            <q-btn v-close-popup label="Done" color="primary" flat />
          </div>
        </q-popup-proxy>
      </q-icon>
    </template>
  </q-input>
</template>
