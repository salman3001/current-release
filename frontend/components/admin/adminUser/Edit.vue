<script setup lang="ts">
import { AdminUserApi, CityApi, ContinentsApi, CountriesApi, RoleApi, StateApi, StreetApi } from '@/utils/BaseApiService';
import { ref } from 'vue';

const id = useRoute().params.id;

const form = ref({
  image: null,
  user: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    desc: '',
    isActive: false,
    roleId: '',
  },
  address: {
    address: '',
    continentId: '',
    countryId: '',
    stateId: '',
    cityId: '',
    streetId: '',
    zip: '',
  },
  social: {
    website: '',
    facebook: '',
    twitter: '',
    instagram: '',
    pintrest: '',
    linkedin: '',
    vk: '',
    whatsapp: '',
    telegram: '',
  },
});




const { execute: getCountinents, data: continentOptions } = ContinentsApi.index({}, {
  immediate: false,
  lazy: true
})

const { execute: getCountries, data: countiresOptions } = CountriesApi.index({
  filter: {
    continent_id: form.value.address.continentId
  }
}, {
  immediate: false,
  lazy: true
})


const { execute: getStates, data: stateOptions } = StateApi.index({
  filter: {
    country_id: form.value.address.countryId
  }
}, {
  immediate: false,
  lazy: true
})

const { execute: getCities, data: cityOptions } = CityApi.index({
  filter: {
    state_id: form.value.address.stateId
  }
}, {
  immediate: false,
  lazy: true
})

const { execute: getStreets, data: streetOptions } = StreetApi.index({
  filter: {
    city_id: form.value.address.cityId
  }
}, {
  immediate: false,
  lazy: true
})


const user = ref<Record<string, any> | null>(null)

AdminUserApi.show(id as string, {
  populate: {
    role: {
      fields: ['id', 'name'],
    },
    address: {
      populate: {
        continent: {
          fields: ['*'],
        },
        country: {
          fields: ['*'],
        },
        state: {
          fields: ['*'],
        },
        city: {
          fields: ['*'],
        },
        street: {
          fields: ['*'],
        },
      },
    },
    social: {
      fields: ['*'],
    },
  },
}
).then(({ data }) => {
  user.value = data.value
  form.value.user.firstName = (data?.value as any)?.first_name || '';
  form.value.user.lastName = (data?.value as any)?.last_name || '';
  form.value.user.email = (data?.value as any)?.email || '';
  form.value.user.roleId = (data?.value as any)?.role_id || '';
  form.value.user.isActive = (data?.value as any)?.is_active == 1 ? true : false;
  form.value.address.address = (data?.value as any)?.address?.address || '';
  form.value.address.continentId = (data?.value as any)?.address?.continent_id;
  form.value.address.countryId = (data?.value as any)?.address?.country_id;
  form.value.address.stateId = (data?.value as any)?.address?.state_id;
  form.value.address.cityId = (data?.value as any)?.address?.city_id;
  form.value.address.streetId = (data?.value as any)?.address?.street_id;
  form.value.address.zip = (data?.value as any)?.address?.zip || '';
  form.value.social.website = (data?.value as any)?.social?.website || '';
  form.value.social.facebook = (data?.value as any)?.social?.facebook;
  form.value.social.instagram = (data?.value as any)?.social?.instagram;
  form.value.social.linkedin = (data?.value as any)?.social?.linkedin;
  form.value.social.pintrest = (data?.value as any)?.social?.pintrest;
  form.value.social.telegram = (data?.value as any)?.social?.telegram;
  form.value.social.twitter = (data?.value as any)?.social?.twitter;
  form.value.social.vk = (data?.value as any)?.social?.vk;
  form.value.social.whatsapp = (data?.value as any)?.social?.whatsapp;


  getCountinents().then(async () => {
    if (form.value.address.countryId) {
      await getCountries().then(async () => {
        if (form.value.address.stateId) {
          await getStates().then(async () => {
            if (form.value.address.cityId) {
              await getCities().then(async () => {
                if (form.value.address.streetId) {
                  await getStreets()
                }
              })
            }
          })
        }
      })
    }
  })
})


const { data: roles } = RoleApi.index()

const { execute, loading, } = AdminUserApi.put({
}, {
  onSuccess: () => {
    navigateTo(routes.admin.admin_users)
  }
})


const submit = (e: SubmitEvent | Event) => {
  const formData = convertToFormData(form.value)
  execute(user.value?.id as string, formData)
}


</script>

<template>
  <q-form class="column q-gutter-y-md" @submit="submit">
    <p class="text-subtitle1">General Information</p>
    <div>
      <FormsProfileImageInput name="image" :url="user?.avatar
        ? BaseUploadsUrl + user?.avatar?.url
        : '/images/upload-preview.png'
        " @image="(v: any) => {
    form.image = v
  }" />
    </div>
    <div class="q-gutter-y-md">
      <div class="row q-col-gutter-md">
        <q-input outlined v-model="form.user.firstName" label="First Name" class="col-12 col-sm-6 col-md-3"
          :rules="[rules.required('required')]" />
        <q-input outlined v-model="form.user.lastName" label="Last Name" class="col-12 col-sm-6 col-md-3"
          :rules="[rules.required('required')]" />
        <q-input outlined debounce="500" v-model="form.user.email" type="email" label="Email"
          class="col-12 col-sm-6 col-md-3" :rules="[
            rules.required('required'),
            rules.email('Email is not valid'),
            async (v) =>
              (await rules.unique(
                '/admin-users/unique-field',
                'email',
                v,
                user?.email
              )) || 'Email Already Taken',
          ]" />
        <q-input outlined v-model="form.user.desc" type="textarea" class="col-12" label="Description" />
      </div>

      <div class="column q-gutter-y-md">
        <p class="text-subtitle1">Role Information</p>
        <div class="row q-col-gutter-md">
          <q-toggle v-model="form.user.isActive" label="Activate" class="col-12 col-sm-6 col-md-3" />
          <q-select v-if="roles" outlined map-options emit-value v-model="form.user.roleId" option-label="name"
            option-value="id" :options="roles" label="Role" class="col-12 col-sm-6 col-md-3" />
        </div>
      </div>
      <div class="column q-gutter-y-md">
        <p class="text-subtitle1">Location Information</p>
        <div class="row q-col-gutter-md">
          <q-input outlined v-model="form.address.address" class="col-12 col-md-9" label="Address" />
          <q-select outlined emit-value map-options option-label="name" option-value="id"
            v-model="form.address.continentId" :options="continentOptions" label="Continet"
            class="col-12 col-sm-6 col-md-3" @update:model-value="(value) => {
              form.address.countryId = '';
              form.address.stateId = '';
              form.address.cityId = '';
              form.address.streetId = '';
              getCountries(value);
            }
              " />
          <q-select outlined emit-value map-options option-label="name" option-value="id" v-model="form.address.countryId"
            label="Country" class="col-12 col-sm-6 col-md-3" :options="countiresOptions" @update:model-value="(value) => {
              form.address.stateId = '';
              form.address.cityId = '';
              form.address.streetId = '';
              getStates(value);
            }
              " />
          <q-select outlined emit-value map-options option-label="name" option-value="id" v-model="form.address.stateId"
            label="State" class="col-12 col-sm-6 col-md-3" :options="stateOptions" @update:model-value="(value) => {
              form.address.cityId = '';
              form.address.streetId = '';
              getCities(value);
            }
              " />
          <q-select outlined emit-value map-options option-label="name" option-value="id" v-model="form.address.cityId"
            label="City" class="col-12 col-sm-6 col-md-3" :options="cityOptions" @update:model-value="(value) => {
              form.address.streetId = '';
              getStreets(value);
            }
              " />
          <q-select outlined emit-value map-options option-label="name" option-value="id" v-model="form.address.streetId"
            label="Street" class="col-12 col-sm-6 col-md-3" :options="streetOptions" />
          <q-input outlined v-model="form.address.zip" class="col-12 col-sm-6 col-md-3" label="Post Code" />
        </div>
      </div>

      <div class="column q-gutter-y-md">
        <p class="text-subtitle1">Social Information</p>
        <div class="row q-col-gutter-md">
          <q-input outlined v-model="form.social.website" class="col-12 col-sm-6 col-md-3" label="Website URL" />
          <q-input outlined v-model="form.social.facebook" label="Facebook URL" class="col-12 col-sm-6 col-md-3" />
          <q-input outlined v-model="form.social.twitter" label="Twitter URL" class="col-12 col-sm-6 col-md-3" />
          <q-input outlined v-model="form.social.instagram" label="Instagram URL" class="col-12 col-sm-6 col-md-3" />
          <q-input outlined v-model="form.social.pintrest" label="Pintrest URL" class="col-12 col-sm-6 col-md-3" />
          <q-input outlined v-model="form.social.linkedin" label="Linkedin URL" class="col-12 col-sm-6 col-md-3" />
          <q-input outlined v-model="form.social.vk" class="col-12 col-sm-6 col-md-3" label="VK URL" />
          <q-input outlined v-model="form.social.whatsapp" class="col-12 col-sm-6 col-md-3" label="Whatsapp URL" />
          <q-input outlined v-model="form.social.telegram" class="col-12 col-sm-6 col-md-3" label="Telegram URL" />
        </div>
      </div>
    </div>
    <div class="row justify-end q-gutter-md">
      <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
        navigateTo(routes.admin.admin_users)
      }
        ">Cancle</q-btn>
      <q-btn color="primary" v-if="loading">
        <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
          track-color="orange-2" style="min-width: 8rem" />
      </q-btn>
      <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
    </div>
  </q-form>
</template>
