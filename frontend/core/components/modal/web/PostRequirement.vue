<script setup lang="ts">
import { ref } from "vue";
import { useServiceCategoryApi, useServiceRequirementApi, useServiceTagApi } from "~/composables";


const modal = modalStore();
const uploadModal = ref(false);


const { form, create, loading } = useServiceRequirementApi.cretae()
const { list: getCetgoryList } = useServiceCategoryApi.list({})
const { list: getTagList } = useServiceTagApi.list({})

const { data, pending } = useAsyncData(
  async () => {
    const [categeories, tags] = await Promise.all([await getCetgoryList(), await getTagList()])
    return {
      categories: categeories.data,
      tags: tags.data
    }
  }
);

const creatRequirement = async () => {
  await create({
    onSuccess: () => {
      modal.meta.onSuccess();
      modal.show = !modal.show;
    },
  })
};

const totalFilesSelected = computed(
  () => (form.images as unknown as [])?.length || 0
  // +
  // (form.value.documents?.length || 0) +
  // (form.value.video ? 1 : 0)
);
</script>

<template>
  <q-card style="width: 100%; max-width: 700px" class="shadow-9 hide-scrollbar">
    <q-toolbar color="primary">
      <q-toolbar-title><span class="text-weight-bold">Post Requirement</span></q-toolbar-title>
      <q-btn flat dense icon="close" v-close-popup />
    </q-toolbar>
    <ScrollArea height="95vh" width="100%">
      <q-card-section class="column q-px-md-md">
        <br />
        <q-form class="q-gutter-y-sm" @submit="creatRequirement">
          <q-input outlined v-model="form.title" label="Enter Your Title" class="col-12 col-sm-6 col-md-3"
            :rules="[rules.required('required')]" lazy-rules="true" />
          <q-input type="textarea" outlined v-model="form.desc" label="Requirement Detail"
            class="col-12 col-sm-6 col-md-3" :rules="[rules.required('required')]" />
          <q-select label="Select Category" outlined :rules="[rules.required('required')]" :options="data?.categories"
            option-value="id" option-label="name" emit-value map-options v-model="form.serviceCategoryId" />
          <FormsSelectOrAdd label="Keywords" class="chip-primary" option-value="name" option-label="name" multiple
            outlined v-model="form.keywords" emit-value map-options :options="data?.tags" />
          <div>
            <label>Need In short Time?</label>
            <q-toggle val="fixed" v-model="form.urgent" />
          </div>
          <q-input type="number" outlined v-model="form.budget" label="Budget" class="col-12 col-sm-6 col-md-3" :rules="[
          rules.required('required'),
          rules.minValue(1, 'Budget Must be provided'),
        ]" />
          <FormsSelectOrAdd label="Budget Unit" class="chip-primary" outlined :rules="[rules.required('required')]"
            v-model="form.budgetUnit" :options="['Hourly', 'Fixed', 'Per Unit', 'Monthly']" />

          <q-input outlined v-model="form.location" label="Location" class="col-12 col-sm-6 col-md-3"
            :rules="[rules.required('required')]" />
          <q-card flat class="border cursor-pointer" @click="uploadModal = true">
            <q-card-section>
              <div class="text-center full-width text-secondary text-h6" v-if="totalFilesSelected > 0">
                {{ totalFilesSelected }} files selected
              </div>
              <div class="row justify-center">
                <q-icon name="cloud_upload" color="primary" size="52px" />
              </div>
              <div>
                <p class="text-h6 text-center">Upload Documents</p>
              </div>
            </q-card-section>
          </q-card>
          <div class="row q-gutter-sm justify-end q-pt-lg">
            <q-btn color="primary" v-if="loading" disabled>
              <LoadingIndicator /> Processing
            </q-btn>
            <q-btn color="primary" type="submit" :disabled="loading" v-else style="min-width: 6rem">Submit</q-btn>
          </div>
        </q-form>
      </q-card-section>
    </ScrollArea>
  </q-card>
  <!-- Document Upload Modal -->
  <q-dialog v-model="uploadModal">
    <q-card style="width: 100%">
      <q-toolbar color="primary">
        <q-toolbar-title><span class="text-weight-bold">Upload files</span></q-toolbar-title>
        <q-btn flat dense icon="close" v-close-popup :disabled="loading" />
      </q-toolbar>

      <q-card-section class="column q-gutter-md">
        <div class="column q-gutter-sm">
          <label for="">Add Images</label>
          <q-file outlined multiple label="Select Images" use-chips v-model="form.images" />
        </div>

        <!-- <div class="column q-gutter-sm">
          <label for="">Add Documents</label>
          <q-file
            outlined
            multiple
            label="Select Images"
            use-chips
            v-model="form.documents"
          />
        </div>
        <div class="column q-gutter-sm">
          <label for="">Add Video</label>
          <q-file
            outlined
            label="Select Images"
            use-chips
            v-model="form.video"
          />
        </div> -->
        <br />
        <br />
        <div class="row q-gutter-sm justify-end q-pt-lg">
          <q-btn color="primary" type="submit" @click="uploadModal = !uploadModal" style="min-width: 6rem">Done</q-btn>
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>
