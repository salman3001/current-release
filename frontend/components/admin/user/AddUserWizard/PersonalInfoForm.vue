<script setup lang="ts">
import ProfileImageInput from 'src/components/forms/ProfileImageInput.vue';
import { rules } from 'src/utils/validationRules';
import { srollToView } from 'src/utils/scrollToView'
import useAddressStore from 'src/stores/addressStore';
import createUserStore from 'src/stores/createUserStore';
import { onMounted, ref } from 'vue';

const address = useAddressStore();
const createUser = createUserStore()

defineProps<{
  step: number
}>()


onMounted(() => {
  address.getCountinents();
});

const imagePreviewUrl = ref('/images/upload-preview.png')

const getImageUrl = () => {
  if (createUser.form.image) {
    const reader = new FileReader();
    reader.readAsDataURL(createUser.form.image);
    reader.onload = function (e: any) {
      imagePreviewUrl.value = e.target.result as string;
    }
  } else {
    return
  }
}

onMounted(() => {
  getImageUrl()
})

</script>

<template>
  <q-form class="column q-gutter-y-md" @submit="() => {
    $emit('next')
  }" @validation-error="srollToView">
    <div>
      <ProfileImageInput name="image" @image="(v) => {
        createUser.form.image = v as unknown as null

      }" :url="imagePreviewUrl" />
    </div>
    <div class="q-gutter-y-md">
      <div class="row q-col-gutter-md">
        <q-input outlined v-model="createUser.form.user.firstName" label="First Name" class="col-12 col-sm-6 col-md-3"
          :rules="[$rules.required('required')]" />
        <q-input outlined v-model="createUser.form.user.lastName" label="Last Name" class="col-12 col-sm-6 col-md-3"
          :rules="[$rules.required('required')]" />
        <q-input outlined debounce="500" v-model="createUser.form.user.email" type="email" label="Email"
          class="col-12 col-sm-6 col-md-3" :rules="[
            $rules.required('required'),
            $rules.email('Email is not valid'),
            async (v) =>
              (await rules.unique('/users/unique-field', 'email', v)) ||
              'Email Already Taken',
          ]" />
        <q-input outlined debounce="500" v-model="createUser.form.user.userName" label="User Name"
          class="col-12 col-sm-6 col-md-3" :rules="[
            $rules.required('required'),
            rules.slug || 'Remove White Spaces',
            async (v) =>
              (await rules.unique('/users/unique-field', 'user_name', v)) ||
              'User Name Already Taken',
          ]" />
        <q-input outlined v-model="createUser.form.user.desc" type="textarea" class="col-12" label="Description" />
      </div>

      <div class="column q-gutter-y-md">
        <p class="text-subtitle1">Location Information</p>
        <div class="row q-col-gutter-md">
          <q-input outlined v-model="createUser.form.address.address" class="col-12 col-md-9" label="Address" />
          <q-select outlined emit-value map-options v-model="createUser.form.address.continentId"
            :options="address.selectContinents" label="Continet" class="col-12 col-sm-6 col-md-3" @update:model-value="(value) => {
              createUser.form.address.countryId = '';
              createUser.form.address.stateId = '';
              createUser.form.address.cityId = '';
              createUser.form.address.streetId = '';
              address.getCountries(value);
            }
              " />
          <q-select outlined emit-value map-options v-model="createUser.form.address.countryId" label="Country"
            class="col-12 col-sm-6 col-md-3" :options="address.selectContries" @update:model-value="(value) => {
              createUser.form.address.stateId = '';
              createUser.form.address.cityId = '';
              createUser.form.address.streetId = '';
              address.getstates(value);
            }
              " />
          <q-select outlined emit-value map-options v-model="createUser.form.address.stateId" label="State"
            class="col-12 col-sm-6 col-md-3" :options="address.selectStates" @update:model-value="(value) => {
              createUser.form.address.cityId = '';
              createUser.form.address.streetId = '';
              address.getCities(value);
            }
              " />
          <q-select outlined emit-value map-options v-model="createUser.form.address.cityId" label="City"
            class="col-12 col-sm-6 col-md-3" :options="address.selectCities" @update:model-value="(value) => {
              createUser.form.address.streetId = '';
              address.getStreets(value);
            }
              " />
          <q-select outlined emit-value map-options v-model="createUser.form.address.streetId" label="Street"
            class="col-12 col-sm-6 col-md-3" :options="address.selectStreets" />
          <q-input outlined v-model="createUser.form.address.zip" class="col-12 col-sm-6 col-md-3" label="Post Code" />
        </div>
      </div>
    </div>
    <div class="row justify-end q-gutter-md">
      <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit" label="Back"
        class="q-ml-sm" />
      <q-btn color="primary" type="submit" style="min-width: 8rem">Next</q-btn>
    </div>
  </q-form>
</template>
