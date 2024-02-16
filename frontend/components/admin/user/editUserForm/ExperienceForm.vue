<script setup lang="ts">
import { CityApi, CountriesApi, StateApi } from '@/utils/BaseApiService';
import { onMounted, ref, } from 'vue';

const editUser = editUserStore()

const prop = defineProps<{ index: number }>()

const countiresOptions = ref<any[]>([])
const stateOptions = ref<any[]>([])
const cityOptions = ref<any[]>([])


onMounted(async () => {
  editUser.getJobDepartments()
  editUser.getJobIndustry()

  if (editUser.user?.experiences[prop.index]?.country) {
    countiresOptions.value = [editUser.user?.experiences[prop.index].country]
  }

  if (editUser.user?.experiences[prop.index]?.state) {
    stateOptions.value = [editUser.user?.experiences[prop.index].state]
  }

  if (editUser.user?.experiences[prop.index]?.city) {
    cityOptions.value = [editUser.user?.experiences[prop.index].city]
  }

})

</script>

<template>
  <q-select outlined emit-value map-options v-model="editUser.workExperienceForm.workExperience[index].jobIndustryId"
    :options="editUser.jobIndustry" label="Job Industry" class="col-12 col-sm-6 col-md-3"
    :rules="[rules.required('required')]" />
  <q-input outlined v-model="editUser.workExperienceForm.workExperience[index].jobFunction" label="Job Functions"
    class="col-12 col-sm-6 col-md-3" />
  <q-input outlined v-model="editUser.workExperienceForm.workExperience[index].jobTitle" label="Job Title"
    class="col-12 col-sm-6 col-md-3" :rules="[rules.required('required')]" />
  <q-select outlined emit-value map-options v-model="editUser.workExperienceForm.workExperience[index].jobDepartmentId"
    :options="editUser.jobDepartments" label="Job Department" class="col-12 col-sm-6 col-md-3"
    :rules="[rules.required('required')]" />
  <q-input outlined v-model="editUser.workExperienceForm.workExperience[index].companyName" label="Company Name"
    class="col-12 col-sm-6 col-md-3" />
  <q-input outlined v-model="editUser.workExperienceForm.workExperience[index].companySize" label="Company Size"
    class="col-12 col-sm-6 col-md-3" />
  <q-select outlined emit-value map-options v-model="editUser.workExperienceForm.workExperience[index].countryId"
    :options="countiresOptions" @update:model-value="v => {
      editUser.workExperienceForm.workExperience[index].stateId = ''
      editUser.workExperienceForm.workExperience[index].cityId = ''
    }" label="Country" option-label="name" option-value="id" class="col-12 col-sm-6 col-md-3" @filter="(v, update) => {
  CountriesApi.index().then(({ data }) => {
    update(() => {
      countiresOptions = (data.value as any)
    });
  })

}" />
  <q-select outlined emit-value map-options option-label="name" option-value="id"
    v-model="editUser.workExperienceForm.workExperience[index].stateId" :options="stateOptions" @update:model-value="v => {
      editUser.workExperienceForm.workExperience[index].cityId = ''
    }" label="State" class="col-12 col-sm-6 col-md-3" @filter="(v, update) => {
  if (editUser.workExperienceForm.workExperience[index].countryId) {
    StateApi.index({
      filter: {
        countryId: editUser.workExperienceForm.workExperience[index].countryId
      }
    }).then(({ data }) => {
      update(() => {
        stateOptions = (data.value as any)
      });
    })
  } else {
    update(() => { });
    return
  }
}" />
  <q-select outlined emit-value map-options option-label="name" option-value="id"
    v-model="editUser.workExperienceForm.workExperience[index].cityId" :options="cityOptions" label="City"
    class="col-12 col-sm-6 col-md-3" @filter="(v, update) => {
      if (editUser.workExperienceForm.workExperience[index].stateId) {
        CityApi.index({
          filter: {
            stateId: editUser.workExperienceForm.workExperience[index].stateId
          }
        }).then(({ data }) => {
          update(() => {
            cityOptions = (data.value as any)
          });
        })
      } else {
        update(() => { });
        return
      }
    }" />
  <q-input outlined v-model="editUser.workExperienceForm.workExperience[index].zip" label="Post Code"
    class="col-12 col-sm-6 col-md-3" />
  <q-toggle class="col-12" v-model="editUser.workExperienceForm.workExperience[index].isCurrent"
    label="I am currently woring here" />
  <div class="col-12 col-sm-6 col-md-3">
    <q-input outlined v-model="editUser.workExperienceForm.workExperience[index].startDate" label="Start Date"
      mask="##/##/####" hint="dd/mm/yyyy">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="editUser.workExperienceForm.workExperience[index].startDate" mask="DD/MM/YYYY">
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
    <q-input outlined v-model="editUser.workExperienceForm.workExperience[index].endDate" label="End Date"
      mask="##/##/####" hint="dd/mm/yyyy">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
            <q-date v-model="editUser.workExperienceForm.workExperience[index].endDate" mask="DD/MM/YYYY">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
  <q-input type="textarea" outlined v-model="editUser.workExperienceForm.workExperience[index].desc" label="Description"
    class="col-12" />
</template>
