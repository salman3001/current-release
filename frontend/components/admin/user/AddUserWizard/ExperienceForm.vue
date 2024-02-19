<script setup lang="ts">
import { CityApi, CountriesApi, StateApi } from '@/utils/BaseApiService';
import { onMounted, ref } from 'vue';

const createUser = createUserStore()

const countryOptions = ref([])
const stateOptions = ref([])
const cityOptions = ref([])


const getCountries = () => {
  CountriesApi.index().then(({ data }) => {
    countryOptions.value = (data.value as any).map((v: any) => ({
      label: v?.name,
      value: v?.id
    }))
  })
}

const getStates = (id: string) => {
  StateApi.index({
    filter: {
      countryId: id
    }
  }).then(({ data }) => {
    stateOptions.value = (data.value as any).map((v: any) => ({
      label: v?.name,
      value: v?.id
    }))
  })
}

const getCities = (id: string) => {
  CityApi.index({
    filter: {
      stateId: id
    }
  }).then(({ data }) => {
    cityOptions.value = (data.value as any).map((v: any) => ({
      label: v?.name,
      value: v?.id
    }))
  })
}

onMounted(() => {
  getCountries()
})

</script>

<template>
  <div class="column q-gutter-y-md">
    <p class="text-subtitle1">Work Experience</p>
    <div class="row q-col-gutter-md q-pb-lg" v-for="(w, i) in createUser.form.workExperience" :key="i">
      <div class="col-12 row q-col-gutter-sm items-center">
        <p class="text-grey">Work Experience {{ i + 1 }}</p>
        <div>
          <q-btn v-if="i > 0" flat icon="delete" @click="() => createUser.popWorkExperience()">Remove
          </q-btn>
        </div>
      </div>

      <q-select outlined emit-value map-options v-model="w.jobIndustryId" :options="createUser.jobIndustry"
        label="Job Industry" class="col-12 col-sm-6 col-md-3" :rules="[rules.required('required')]" />
      <q-input outlined v-model="w.jobFunction" label="Job Functions" class="col-12 col-sm-6 col-md-3" />
      <q-input outlined v-model="w.jobTitle" label="Job Title" class="col-12 col-sm-6 col-md-3"
        :rules="[rules.required('required')]" />
      <q-select outlined emit-value map-options v-model="w.jobDepartmentId" :options="createUser.jobDepartments"
        label="Job Department" class="col-12 col-sm-6 col-md-3" :rules="[rules.required('required')]" />
      <q-input outlined v-model="w.companyName" label="Company Name" class="col-12 col-sm-6 col-md-3" />
      <q-input outlined v-model="w.companySize" label="Company Size" class="col-12 col-sm-6 col-md-3" />
      <q-select outlined emit-value map-options v-model="w.countryId" :options="countryOptions" @update:model-value="(value) => {
        w.stateId = ''
        w.cityId = ''
        getStates(value)
      }" label="Country" class="col-12 col-sm-6 col-md-3" />
      <q-select outlined emit-value map-options v-model="w.stateId" :options="stateOptions" @update:model-value="(value) => {
        w.cityId = ''
        getCities(value)
      }" label="State" class="col-12 col-sm-6 col-md-3" />
      <q-select outlined emit-value map-options v-model="w.cityId" :options="cityOptions" label="City"
        class="col-12 col-sm-6 col-md-3" />
      <q-input outlined v-model="w.zip" label="Post Code" class="col-12 col-sm-6 col-md-3" />
      <q-toggle class="col-12" v-model="w.isCurrent" label="I am currently woring here" />
      <div class="col-12 col-sm-6 col-md-3">
        <q-input outlined v-model="w.startDate" label="Start Date" mask="##/##/####" hint="dd/mm/yyyy">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="w.startDate" mask="DD/MM/YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-sm-6 col-md-3">
        <q-input outlined v-model="w.endDate" label="End Date" mask="##/##/####" hint="dd/mm/yyyy">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date v-model="w.endDate" mask="DD/MM/YYYY">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <q-input type="textarea" outlined v-model="w.desc" label="Description" class="col-12" />
    </div>
    <div class="row justify-end">
      <q-btn color="primary" style="max-width: 14rem" @click="createUser.addNewWorkExperience">+ Add
        New Experience</q-btn>
    </div>
  </div>
</template>
