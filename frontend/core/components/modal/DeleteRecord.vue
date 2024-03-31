<script setup lang="ts">
import { Notify } from "quasar";
import { ref } from "vue";

const modal = modalStore();
const loading = ref(false);
const customFetch = useCustomFetch();

const handeler = async () => {
  loading.value = true;
  try {
    const res = await customFetch<IResType<any>>(modal?.meta?.url, {
      method: "delete",
    });
    if (res.success == true) {
      modal.meta?.onSuccess && modal.meta.onSuccess();
    }
  } catch (error: any) {
    Notify.create({
      message: "Failed to delete record",
      color: "negative",
      icon: "error",
    });
  }
  loading.value = false;
  modal.show = !modal.show;
};
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar color="primary">
      <q-toolbar-title
        ><span class="text-weight-bold">{{
          modal.meta.title
        }}</span></q-toolbar-title
      >
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>

    <q-card-section class="column items-center q-px-md-sm">
      <q-icon name="block" class="col-4" size="5rem" />
      <p>Are you sure, You want to delete this record?</p>
    </q-card-section>
    <q-card-section class="row justify-end">
      <div class="q-gutter-sm">
        <q-btn
          flat
          style="background-color: #f2f0dc"
          @click="modal.show = !modal.show"
          >Cancle</q-btn
        >
        <q-btn color="primary" v-if="loading">
          <q-circular-progress
            indeterminate
            size="20px"
            class="q-px-10"
            :thickness="1"
            color="grey-8"
            track-color="orange-2"
          />
        </q-btn>
        <q-btn color="primary" @click="handeler" :disable="loading" v-else
          >Delete</q-btn
        >
      </div>
    </q-card-section>
  </q-card>
</template>
