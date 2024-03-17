<script setup lang="ts">
import { ref } from 'vue';
import { date } from 'quasar'

const customFetch = useCustomFetch()

const modal = modalStore();
const uploadModal = ref(false)

const loading = ref(false)

const form = ref({
    title: '',
    desc: '',
    keywords: [],
    urgent: false,
    skillsRequired: ['sas'],
    budgetType: 'fixed',
    budget: '',
    expiresAt: date.formatDate(date.addToDate(Date.now(), { day: 3 }), 'DD/MM/YYYY hh:mm'),
    location: '-2.2,37.7',
    serviceCategoryId: '',
    images: null,
    documents: null,
    video: null
});

const { data: categories, pending: categoriesPending } = useAsyncData(async () => {
    const data = await customFetch<IResType<IServiceCategory[]>>(apiRoutes.service_categories)
    return data.data
})

const creatRequirement = async () => {
    loading.value = true
    try {
        const data = await customFetch<IPageRes<any>>(apiRoutes.service_requirements, {
            method: 'post',
            body: form.value,
        })
        if (data.success === true) {
            modal.meta.onSuccess()
            modal.show = !modal.show
        }
    } catch (error) {
        console.log(error);
    }
    loading.value = false
}

const totalFilesSelected = computed(() => (form.value.images?.length || 0) + (form.value.documents?.length || 0) + (form.value.video ? 1 : 0))


</script>

<template>

    <q-card style="width: 100%; max-width: 700px;" class="shadow-9 hide-scrollbar ">
        <q-toolbar color="primary">
            <q-toolbar-title><span class="text-weight-bold">Post Requirement</span></q-toolbar-title>
            <q-btn flat dense icon="close" v-close-popup />
        </q-toolbar>
        <ScrollArea height="95vh" width="100%">
            <q-card-section class="column q-px-md-md ">
                <br>
                <q-form class="q-gutter-y-sm" @submit="creatRequirement">
                    <q-input outlined v-model="form.title" label="Enter Your Title" class="col-12 col-sm-6 col-md-3"
                        :rules="[rules.required('required')]" lazy-rules="true" />
                    <q-input type="textarea" outlined v-model="form.desc" label="Requirement Detail"
                        class="col-12 col-sm-6 col-md-3" :rules="[rules.required('required')]" />
                    <q-select label="Select Category" outlined :rules="[rules.required('required')]"
                        :options="categories" option-value="id" option-label="name" emit-value map-options
                        v-model="form.serviceCategoryId" />
                    <q-select label="Keywords" class="chip-primary" outlined use-input use-chips multiple
                        hide-dropdown-con new-value-mode="add-unique" :rules="[rules.required('required')]"
                        v-model="form.keywords" />
                    <div>
                        <label>Need In short Time?</label>
                        <q-toggle val="fixed" v-model="form.urgent" />
                    </div>
                    <div>
                        <q-radio val="fixed" label="Fixed" v-model="form.budgetType" />
                        <q-radio val="hourly" label="Hourly" v-model="form.budgetType" />
                    </div>

                    <q-input type="number" outlined v-model="form.budget" label="Budget"
                        class="col-12 col-sm-6 col-md-3"
                        :rules="[rules.required('required'), rules.minValue(1, 'Budget Must be provided')]" />
                    <q-input outlined v-model="form.location" label="Location" class="col-12 col-sm-6 col-md-3"
                        :rules="[rules.required('required')]" />
                    <q-card flat class="border cursor-pointer" @click="uploadModal = true">
                        <q-card-section>
                            <div class="text-center full-width text-secondary text-h6" v-if="totalFilesSelected > 0">
                                {{ totalFilesSelected }} files selected
                            </div>
                            <div class="row justify-center ">
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
                        <q-btn color="primary" type="submit" :disabled="loading" v-else
                            style="min-width: 6rem">Submit</q-btn>
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

                <div class="column q-gutter-sm">
                    <label for="">Add Documents</label>
                    <q-file outlined multiple label="Select Images" use-chips v-model="form.documents" />
                </div>
                <div class="column q-gutter-sm">
                    <label for="">Add Video</label>
                    <q-file outlined label="Select Images" use-chips v-model="form.video" />
                </div>
                <br />
                <br />
                <div class="row q-gutter-sm justify-end q-pt-lg">

                    <q-btn color="primary" type="submit" @click="uploadModal = !uploadModal"
                        style="min-width: 6rem">Done</q-btn>
                </div>

            </q-card-section>
        </q-card>
    </q-dialog>


</template>
