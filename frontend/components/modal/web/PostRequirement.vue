<script setup lang="ts">
import { ref } from 'vue';
import { date } from 'quasar'

const customFetch = useCustomFetch()

const modal = modalStore();

const loading = ref(false)

const form = ref({
    title: '',
    desc: '',
    skillsRequired: ['sas'],
    budgetType: 'fixed',
    budget: '',
    expiresAt: date.formatDate(date.addToDate(Date.now(), { day: 3 }), 'DD/MM/YYYY hh:mm'),
    location: '-2.2,37.7',
    serviceCategoryId: '',
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

</script>

<template>
    <q-card style="width: 100%">
        <q-toolbar color="primary">
            <q-toolbar-title><span class="text-weight-bold">Post Requirement</span></q-toolbar-title>
            <q-btn flat dense icon="close" v-close-popup :disabled="loading" />
        </q-toolbar>

        <q-card-section class="column q-px-md-md">
            <q-form @submit="creatRequirement()" class="q-gutter-y-sm">
                <q-select label="Select Category" outlined :rules="[rules.required('required')]" :options="categories"
                    option-value="id" option-label="name" emit-value map-options v-model="form.serviceCategoryId" />
                <q-input outlined v-model="form.title" label="Title" class="col-12 col-sm-6 col-md-3"
                    :rules="[rules.required('required')]" />
                <q-input type="textarea" outlined v-model="form.desc" label="Description"
                    class="col-12 col-sm-6 col-md-3" :rules="[rules.required('required')]" />
                <div>
                    <label>Budget Type : </label>
                    <q-radio val="fixed" label="Fixed" v-model="form.budgetType" />
                    <q-radio val="hourly" label="Hourly" v-model="form.budgetType" />
                </div>

                <q-input type="number" outlined v-model="form.budget" label="Budget" class="col-12 col-sm-6 col-md-3"
                    :rules="[rules.required('required'), rules.minValue(1, 'Budget Must be provided')]" />
                <q-input outlined v-model="form.location" label="Location" class="col-12 col-sm-6 col-md-3"
                    :rules="[rules.required('required')]" />
                <div class="row q-gutter-sm justify-end q-pt-lg">
                    <q-btn color="secondary" style=" min-width: 6rem" @click="modal.show = !modal.show"
                        :disabled="loading">Cancle</q-btn>
                    <q-btn color="primary" v-if="loading" disabled>
                        <LoadingIndicator /> Processing
                    </q-btn>
                    <q-btn color="primary" type="submit" :disabled="loading" v-else
                        style="min-width: 6rem">Submit</q-btn>
                </div>
            </q-form>
        </q-card-section>
    </q-card>
</template>
