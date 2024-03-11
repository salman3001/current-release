<script setup lang="ts">
import { ref } from "vue";

const customFetch = useCustomFetch();

const modal = modalStore();

const loading = ref(false);

const form = ref({
  rating: 4,
  message: "",
});

const creatReview = async () => {
  loading.value = true;
  try {
    const data = await customFetch<IPageRes<any>>(
      apiRoutes.create_review(modal.meta.serviceId),
      {
        method: "post",
        body: form.value,
      }
    );
    if (data.success === true) {
      modal.meta.onSuccess();
      modal.show = !modal.show;
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
};
</script>

<template>
  <q-card style="width: 100%">
    <q-toolbar style="background-color: #ebeae4">
      <q-toolbar-title
        ><span class="text-weight-bold">Add Review</span></q-toolbar-title
      >
      <q-btn flat dense icon="close" v-close-popup :disabled="loading" />
    </q-toolbar>

    <q-card-section class="column q-px-md-sm">
      <q-form @submit="creatReview()">
        <div class="column items-center q-gutter-sm">
          <label for="">Rate from 1 to 5</label>
          <q-rating
            v-model="form.rating"
            :rules="[rules.required('required')]"
            size="30px"
            color="primary"
          />
        </div>
        <br />
        <br />
        <label for="">Share your throught about this service</label>
        <q-input
          type="textarea"
          outlined
          v-model="form.message"
          label="Message"
          class="col-12 col-sm-6 col-md-3"
          :rules="[rules.required('required')]"
        />
        <div class="row q-gutter-sm justify-end q-pt-lg">
          <q-btn
            color="secondary"
            style="min-width: 6rem"
            @click="modal.show = !modal.show"
            :disabled="loading"
            >Cancle</q-btn
          >
          <q-btn color="primary" v-if="loading" disabled>
            <LoadingIndicator /> Processing
          </q-btn>
          <q-btn
            color="primary"
            type="submit"
            :disabled="loading"
            v-else
            style="min-width: 6rem"
            >Submit</q-btn
          >
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>
