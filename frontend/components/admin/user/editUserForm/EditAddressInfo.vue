<script setup lang="ts">
import { srollToView } from 'src/utils/scrollToView';
import { onMounted, ref } from 'vue';
import editUserStore from 'src/stores/editUserStore';
import { CityApi, ContinentsApi, CountriesApi, StateApi, StreetApi, userApi } from 'src/utils/BaseApiService';


const editUser = editUserStore()

const { execute, loading } = userApi.put();

const continentOptions = ref<any[]>([])
const countiresOptions = ref<any[]>([])
const stateOptions = ref<any[]>([])
const cityOptions = ref<any[]>([])
const streetOptions = ref<any[]>([])

const getCountinents = async () => {
  ContinentsApi.index().then(({ data }) => {
    continentOptions.value = (data.value as any)
  })
}

const getCountries = async (id: string) => {
  CountriesApi.index({
    filter: {
      continent_id: id
    }
  }).then(({ data }) => {
    countiresOptions.value = (data.value as any)
  })
}

const getStates = async (id: string) => {
  StateApi.index({
    filter: {
      country_id: id
    }
  }).then(({ data }) => {
    stateOptions.value = (data.value as any)
  })
}

const getCities = async (id: string) => {
  CityApi.index({
    filter: {
      state_id: id
    }
  }).then(({ data }) => {
    cityOptions.value = (data.value as any)
  })
}

const getStreets = async (id: string) => {
  StreetApi.index({
    filter: {
      city_id: id
    }
  }).then(({ data }) => {
    streetOptions.value = (data.value as any)
  })
}

onMounted(async () => {
  await getCountinents().then(async () => {
    if (editUser.addressForm.address.countryId) {
      await getCountries(editUser.addressForm.address.continentId).then(async () => {
        if (editUser.addressForm.address.stateId) {
          await getStates(editUser.addressForm.address.countryId).then(async () => {
            if (editUser.addressForm.address.cityId) {
              await getCities(editUser.addressForm.address.stateId).then(async () => {
                if (editUser.addressForm.address.streetId) {
                  await getStreets(editUser.addressForm.address.cityId)
                }
              })
            }
          })
        }
      })
    }
  })
})

</script>

<template>
  <div class="q-py-lg">
    <q-form class="column q-gutter-y-md" @submit="() => {
      execute(editUser?.user?.id as string, editUser.addressForm)
    }" @validation-error="srollToView">
      <div class="row q-col-gutter-md">
        <q-input outlined v-model="editUser.addressForm.address.address" class="col-12 col-md-9" label="Address" />
        <q-select outlined emit-value map-options option-label="name" option-value="id"
          v-model="editUser.addressForm.address.continentId" :options="continentOptions" label="Contient"
          class="col-12 col-sm-6 col-md-3" @update:model-value="(value) => {
            editUser.addressForm.address.countryId = '';
            editUser.addressForm.address.stateId = '';
            editUser.addressForm.address.cityId = '';
            editUser.addressForm.address.streetId = '';
            getCountries(value);
          }
            " />
        <q-select outlined emit-value map-options option-label="name" option-value="id"
          v-model="editUser.addressForm.address.countryId" label="Country" class="col-12 col-sm-6 col-md-3"
          :options="countiresOptions" @update:model-value="(value) => {
            editUser.addressForm.address.stateId = '';
            editUser.addressForm.address.cityId = '';
            editUser.addressForm.address.streetId = '';
            getStates(value);
          }
            " />
        <q-select outlined emit-value map-options option-label="name" option-value="id"
          v-model="editUser.addressForm.address.stateId" label="State" class="col-12 col-sm-6 col-md-3"
          :options="stateOptions" @update:model-value="(value) => {
            editUser.addressForm.address.cityId = '';
            editUser.addressForm.address.streetId = '';
            getCities(value);
          }
            " />
        <q-select outlined emit-value map-options option-label="name" option-value="id"
          v-model="editUser.addressForm.address.cityId" label="City" class="col-12 col-sm-6 col-md-3"
          :options="cityOptions" @update:model-value="(value) => {
            editUser.addressForm.address.streetId = '';
            getStreets(value);
          }
            " />
        <q-select outlined emit-value map-options option-label="name" option-value="id"
          v-model="editUser.addressForm.address.streetId" label="Street" class="col-12 col-sm-6 col-md-3"
          :options="streetOptions" />
        <q-input outlined v-model="editUser.addressForm.address.zip" class="col-12 col-sm-6 col-md-3" label="Post Code" />
      </div>
      <div class="row justify-end q-gutter-md">
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
      </div>
    </q-form>
  </div>
</template>
