<script setup lang="ts">
import createUserStore from 'src/stores/createUserStore';
import { onMounted, ref } from 'vue';
import { date } from 'quasar';
import {
  CityApi,
  CountriesApi,
  StateApi,
  JobIndustryApi,
  JobDepartmentApi,
  LanguageApi,
  userApi
} from 'src/utils/BaseApiService';
import { useRouter } from 'vue-router';

const createUser = createUserStore()
defineProps<{
  step: number
}>()
const country = ref('')
const state = ref('')
const city = ref('')
const JobIndustry = ref<any[]>([])
const JobDepartments = ref<any[]>([])
const JobCities = ref<any[]>([])
const JobStates = ref<any[]>([])
const JobCountries = ref<any[]>([])
const Languages = ref<any[]>([])
const imagePreviewUrl = ref('/images/upload-preview.png')

const router = useRouter()
const { formatDate } = date

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


const { execute, loading } = userApi.post({
  headers: {
    'Content-Type': 'multipart/form-data'
  }
},
  {
    onSuccess: () => {
      router.push({
        name: 'admin.user.index'
      })
    }
  }
)




onMounted(() => {
  if (createUser.form?.address?.countryId)
    CountriesApi.show(createUser.form?.address?.countryId, {
      fields: ['name']
    }).then(({ data }) => {
      country.value = (data?.value as any)?.name
    })

  if (createUser.form?.address?.stateId)
    StateApi.show(createUser.form?.address?.stateId, {
      fields: ['name']
    }).then(({ data }) => {
      state.value = (data?.value as any)?.name
    })

  if (createUser.form?.address?.cityId)
    CityApi.show(createUser.form?.address?.cityId, {
      fields: ['name']
    }).then(({ data }) => {
      city.value = (data?.value as any)?.name
    })

  createUser.form?.workExperience?.map(e => {
    if (e.jobIndustryId)
      JobIndustryApi.show(e.jobIndustryId, {
        fields: ['name']
      }).then(({ data }) => {
        JobIndustry.value.push((data?.value as any)?.name)
      })

    if (e.jobDepartmentId)
      JobDepartmentApi.show(e.jobDepartmentId, {
        fields: ['name']
      }).then(({ data }) => {
        JobDepartments.value.push((data?.value as any)?.name)
      })

    if (e.cityId)
      CityApi.show(e.cityId, {
        fields: ['name']
      }).then(({ data }) => {
        JobCities.value.push((data?.value as any)?.name)
      })

    if (e.stateId)
      StateApi.show(e.stateId, {
        fields: ['name']
      }).then(({ data }) => {
        JobStates.value.push((data?.value as any)?.name)
      })

    if (e.countryId)
      CountriesApi.show(e.countryId, {
        fields: ['name']
      }).then(({ data }) => {
        JobCountries.value.push((data?.value as any)?.name)
      })
  })


  createUser.form?.languages?.map(l => {
    LanguageApi.show(l, {
      fields: ['name']
    }).then(({ data }) => {
      Languages.value.push((data?.value as any)?.name)
    })
  })

  getImageUrl()

})

</script>

<template>
  <q-form class="q-gutter-y-md" @submit="() => {
    execute(createUser.form)
  }">
    <div class="q-col-gutter-md">
      <h5>Preview</h5>
      <div class="q-py-md rounded">
        <q-img :src="imagePreviewUrl" spinner-color="white"
          style="height: 140px; max-width: 150px;border-radius: 10px;border: 1px solid gray;" />
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Personal
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'personal')" />
        </p>
        <div style="overflow-x: scroll;">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  First Name
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  Last Name
                </th>
                <th style="text-align: start; padding: 0.5rem;min-width: 5rem;text-wrap: nowrap;">Email</th>
                <th style="text-align: start; padding: 0.5rem;min-width: 5rem;text-wrap: nowrap;">User Name</th>
                <th style="text-align: start; padding: 0.5rem;min-width: 5rem;text-wrap: nowrap;">Phone no.</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">{{ createUser.form.user.firstName }}</td>
                <td style="padding: 0.5rem">{{ createUser.form.user.lastName }}</td>
                <td style="padding: 0.5rem">
                  {{ createUser.form.user.email }}
                </td>
                <td style="padding: 0.5rem">
                  {{ createUser.form.user.userName }}
                </td>
                <td style="padding: 0.5rem">{{ createUser.form.user.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="q-py-lg">
        <p class="text-h6" style="color:#686552">Summary</p>
        <p>
          {{ createUser.form.user.desc }}
        </p>
      </div>
      <div class="q-py-lg">
        <p class="text-h6" style="color:#686552">Address</p>
        <div style="overflow-x: scroll">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem">
                  City
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem">
                  State
                </th>
                <th style="text-align: start; padding: 0.5rem">Post</th>
                <th style="text-align: start; padding: 0.5rem">Country</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">{{ city }}</td>
                <td style="padding: 0.5rem">{{ state }}</td>
                <td style="padding: 0.5rem">
                  {{ createUser.form.address.zip }}
                </td>
                <td style="padding: 0.5rem">
                  {{ country }}
                </td>

              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="q-py-md full-width">
        <p class="text-h6" style="color:#686552">Social Links
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'social')" />
        </p>
        <div style="display: flex;flex-wrap: wrap; gap: 20px;">
          <div>
            <p style="color: #686552;">Twitter</p>
            <p>{{ createUser.form.social.twitter }}</p>
          </div>
          <div>
            <p style="color: #686552;">Facebook</p>
            <p>{{ createUser.form.social.facebook }}</p>
          </div>
          <div>
            <p style="color: #686552;">instagram</p>
            <p>{{ createUser.form.social.instagram }}</p>
          </div>
          <div>
            <p style="color: #686552;">Linked In</p>
            <p>{{ createUser.form.social.linkedin }}</p>
          </div>
          <div>
            <p style="color: #686552;">Pintrest</p>
            <p>{{ createUser.form.social.pintrest }}</p>
          </div>
          <div>
            <p style="color: #686552;">Telegram</p>
            <p>{{ createUser.form.social.telegram }}</p>
          </div>
          <div>
            <p style="color: #686552;">Vk</p>
            <p>{{ createUser.form.social.vk }}</p>
          </div>
          <div>
            <p style="color: #686552;">Website</p>
            <p>{{ createUser.form.social.website }}</p>
          </div>
          <div>
            <p style="color: #686552;">Whatsapp</p>
            <p>{{ createUser.form.social.whatsapp }}</p>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Favorite Links
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'favorite')" />
        </p>
        <div style="display: flex;flex-wrap:wrap ; gap: 12px;">
          <div v-for="(l, i) in createUser.form.favoriteLinks" :key="i">
            <p style="color: #686552;">Link {{ i + 1 }}</p>
            <p>{{ l.link }}</p>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Work Experience
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'profession')" />
        </p>
        <div class="row q-col-gutter-lg">
          <div v-for="(e, i) in createUser.form.workExperience" :key="i">
            <p style="color:#686552">Exprience {{ i + 1 }}</p>
            <div class="row q-col-gutter-lg wrap">
              <div>
                <p style="color:#686552">Industry</p>
                <p>{{ JobIndustry[i] }}</p>
              </div>
              <div>
                <p style="color:#686552">Job Function</p>
                <p>{{ e.jobFunction }}</p>
              </div>
              <div>
                <p style="color:#686552">Job Title</p>
                <p>{{ e.jobTitle }}</p>
              </div>
              <div>
                <p style="color:#686552">Job Department</p>
                <p>{{ JobDepartments[i] }}</p>
              </div>
              <div>
                <p style="color:#686552">Company Name</p>
                <p>{{ e.companyName }}</p>
              </div>
              <div>
                <p style="color:#686552">Company Size</p>
                <p>{{ e.companySize }}</p>
              </div>
              <div>
                <p style="color:#686552">City</p>
                <p>{{ JobCities[i] }}</p>
              </div>
              <div>
                <p style="color:#686552">State</p>
                <p>{{ JobStates[i] }}</p>
              </div>
              <div>
                <p style="color:#686552">Country</p>
                <p>{{ JobCountries[i] }}</p>
              </div>
              <div>
                <p style="color:#686552">Start Date</p>
                <p>{{ formatDate(e.startDate, 'DD MMM YY') }}</p>
              </div>
              <div>
                <p style="color:#686552">End Date</p>
                <p>{{ formatDate(e.endDate, 'DD MMM YY') }}</p>
              </div>
              <div>
                <p style="color:#686552">Present Job</p>
                <p>{{ e.isCurrent ? 'Yes' : 'No' }}</p>
              </div>
            </div>
            <div>
              <p style="color:#686552">Description</p>
              <p>{{ e.desc }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Education
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'profession')" />
        </p>
        <div class="row q-col-gutter-lg">
          <div v-for="(e, i) in createUser.form.education" :key="i">
            <p style="color:#686552">Education {{ i + 1 }}</p>
            <div class="row q-col-gutter-lg wrap">
              <div>
                <p style="color:#686552">Degree</p>
                <p>{{ e.degree }}</p>
              </div>
              <div>
                <p style="color:#686552">Field</p>
                <p>{{ e.field }}</p>
              </div>
              <div>
                <p style="color:#686552">Start Date</p>
                <p>{{ e.startDate }}</p>
              </div>
              <div>
                <p style="color:#686552">End Date</p>
                <p>{{ e.endDate }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Languages
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'language')" />
        </p>
        <div class="row q-col-gutter-lg">
          <div v-for="(l, i) in Languages" :key="i">
            <p style="color:#686552">Language {{ i + 1 }}</p>
            <div class="row q-col-gutter-lg wrap">
              <p>{{ l }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Skills
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'skill')" />
        </p>
        <div class="row q-col-gutter-lg">
          <div v-for="(s, i) in createUser.form.skills" :key="i">
            <p style="color:#686552">Skill {{ i + 1 }}</p>
            <div class="row q-col-gutter-lg wrap">
              <p>{{ s.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Privacy
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'privacy')" />
        </p>
        <div class="row q-col-gutter-lg">
          <div>
            <p style="color:#686552">Public Profile</p>
            <p>{{ createUser.form.user.isPublic ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Notifications
          <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="$emit('edit', 'Notifications')" />
        </p>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <p style="color:#686552">When Someone Sends me message</p>
            <p>{{ createUser.form.NotificationSettings.onMessageRecieve ? 'Yes' : 'No' }}</p>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <p style="color:#686552">When Someone replies to a comment</p>
            <p>{{ createUser.form.NotificationSettings.onCommentReply ? 'Yes' : 'No' }}</p>
          </div>

        </div>
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6 col-md-3">
            <p style="color:#686552">Get updates from the products you follow when they are updated.</p>
            <p>{{ createUser.form.NotificationSettings.onProductUpdate ? 'Yes' : 'No' }}</p>
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <p style="color:#686552">Personalized updates containing the best the CurrentRelease community has to offer.
            </p>
            <p>{{ createUser.form.NotificationSettings.onOffers ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>
    </div>


    <div class="row justify-end q-gutter-md">
      <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit" label="Back"
        class="q-ml-sm" @click="() => {
          $emit('prev')
        }" />
      <q-btn v-if="loading" color="primary">
        <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
          track-color="orange-2" style="min-width: 8rem" />
      </q-btn>
      <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Create User</q-btn>
    </div>
  </q-form>
</template>
