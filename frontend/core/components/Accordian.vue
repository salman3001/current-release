<script setup lang="ts">
defineProps<{
  items: {
    title: string;
    desc: string;
  }[];
}>();
</script>

<template>
  <div class="text-h6">
    <q-list bordered>
      <div v-for="(item, i) in items">
        <q-expansion-item
          :key="i"
          group="somegroup"
          :label="item.title"
          default-opened
          header-class="text-primary"
        >
          <q-card>
            <q-card-section class="text-body1 text-muted">
              {{ item.desc }}
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <q-separator />
      </div>
    </q-list>
  </div>
</template>
