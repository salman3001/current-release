<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { date } from 'quasar';
import {
  userApi
} from 'src/utils/BaseApiService';
import { useRoute, useRouter } from 'vue-router';

const uploads = ref('')


const route = useRoute()
const router = useRouter()
const { formatDate } = date

const user = ref<Record<string, any> | null>(null)
userApi.show(route.params.id as string, {
  populate: {
    social: {
      fields: ['*']
    },
    address: {
      fields: ['*'],
      populate: {
        continent: {
          fields: ['name']
        },
        country: {
          fields: ['name']
        },
        state: {
          fields: ['name']
        },
        city: {
          fields: ['name']
        },
        street: {
          fields: ['name']
        }
      }
    },
    experiences: {
      fields: ['*'],
      populate: {
        city: {
          fields: ['name']
        },
        state: {
          fields: ['name']
        },
        country: {
          fields: ['name']
        },
        industry: {
          fields: ['name']
        },
        department: {
          fields: ['name']
        },
      }
    },
    educations: {
      fields: ['*'],
    },
    languages: {
      fields: ['name']
    },
    skills: {
      fields: ['name']
    },
    favoriteLinks: {
      fields: ['link']

    },
    NotificationSetting: {
      fields: ['*']
    }
  }
}).then(({ data }) => {
  user.value = data.value
})

onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
});

</script>

<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.user.index' });
      }
        " />
      <span class="text-h6"> View User </span>
    </div>
    <div class="q-gutter-y-md q-pa-md q-pt-xl">
      <div class="q-col-gutter-md">
        <div class="q-py-md rounded">
          <q-img :src="user?.avatar?.url
            ? uploads + user?.avatar?.url
            : '/images/sample-dp.png'
            " spinner-color="white"
            style="height: 140px; max-width: 150px;border-radius: 10px;border: 1px solid gray;" />
        </div>
        <div class="q-py-md">
          <p class="text-h6" style="color:#686552">Personal</p>
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
                  <td style="padding: 0.5rem">{{ user?.first_name }}</td>
                  <td style="padding: 0.5rem">{{ user?.last_name }}</td>
                  <td style="padding: 0.5rem">
                    {{ user?.email }}
                  </td>
                  <td style="padding: 0.5rem">
                    {{ user?.user_name }}
                  </td>
                  <td style="padding: 0.5rem">{{ user?.phone }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="q-py-lg">
          <p class="text-h6" style="color:#686552">Summary</p>
          <p>
            {{ user?.desc }}
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
                  <td style="padding: 0.5rem">{{ user?.address?.city?.name }}</td>
                  <td style="padding: 0.5rem">{{ user?.address?.state?.name }}</td>
                  <td style="padding: 0.5rem">
                    {{ user?.address?.zip }}
                  </td>
                  <td style="padding: 0.5rem">
                    {{ user?.address?.country?.name }}
                  </td>

                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="q-py-md full-width">
          <p class="text-h6" style="color:#686552">Social Links

          </p>
          <div style="display: flex;flex-wrap: wrap; gap: 20px;">
            <div>
              <p style="color: #686552;">Twitter</p>
              <p>{{ user?.social?.twitter }}</p>
            </div>
            <div>
              <p style="color: #686552;">Facebook</p>
              <p>{{ user?.social?.facebook }}</p>
            </div>
            <div>
              <p style="color: #686552;">instagram</p>
              <p>{{ user?.social?.instagram }}</p>
            </div>
            <div>
              <p style="color: #686552;">Linked In</p>
              <p>{{ user?.social?.linkedin }}</p>
            </div>
            <div>
              <p style="color: #686552;">Pintrest</p>
              <p>{{ user?.social?.pintrest }}</p>
            </div>
            <div>
              <p style="color: #686552;">Telegram</p>
              <p>{{ user?.social?.telegram }}</p>
            </div>
            <div>
              <p style="color: #686552;">Vk</p>
              <p>{{ user?.social?.vk }}</p>
            </div>
            <div>
              <p style="color: #686552;">Website</p>
              <p>{{ user?.social?.website }}</p>
            </div>
            <div>
              <p style="color: #686552;">Whatsapp</p>
              <p>{{ user?.social?.whatsapp }}</p>
            </div>
          </div>
        </div>
        <div class="q-py-md">
          <p class="text-h6" style="color:#686552">Favorite Links

          </p>
          <div style="display: flex;flex-wrap:wrap ; gap: 12px;">
            <div v-for="(l, i) in user?.favoriteLinks" :key="i">
              <p style="color: #686552;">Link {{ i + 1 }}</p>
              <p>{{ l.link }}</p>
            </div>
          </div>
        </div>
        <div class="q-py-md">
          <p class="text-h6" style="color:#686552">Work Experience

          </p>
          <div class="row q-col-gutter-lg">
            <div v-for="(e, i) in user?.experiences" :key="i">
              <p style="color:#686552">Exprience {{ i + 1 }}</p>
              <div class="row q-col-gutter-lg wrap">
                <div>
                  <p style="color:#686552">Industry</p>
                  <p>{{ e?.industry?.name }}</p>
                </div>
                <div>
                  <p style="color:#686552">Job Function</p>
                  <p>{{ e.job_function }}</p>
                </div>
                <div>
                  <p style="color:#686552">Job Title</p>
                  <p>{{ e.job_title }}</p>
                </div>
                <div>
                  <p style="color:#686552">Job Department</p>
                  <p>{{ e?.department?.name }}</p>
                </div>
                <div>
                  <p style="color:#686552">Company Name</p>
                  <p>{{ e.company_name }}</p>
                </div>
                <div>
                  <p style="color:#686552">Company Size</p>
                  <p>{{ e.company_size }}</p>
                </div>
                <div>
                  <p style="color:#686552">City</p>
                  <p>{{ e?.city?.name }}</p>
                </div>
                <div>
                  <p style="color:#686552">State</p>
                  <p>{{ e?.state?.name }}</p>
                </div>
                <div>
                  <p style="color:#686552">Country</p>
                  <p>{{ e?.country?.name }}</p>
                </div>
                <div>
                  <p style="color:#686552">Start Date</p>
                  <p>{{ formatDate(e.start_date, 'DD MMM YY') }}</p>
                </div>
                <div>
                  <p style="color:#686552">End Date</p>
                  <p>{{ formatDate(e.end_date, 'DD MMM YY') }}</p>
                </div>
                <div>
                  <p style="color:#686552">Present Job</p>
                  <p>{{ e.is_current ? 'Yes' : 'No' }}</p>
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

          </p>
          <div class="row q-col-gutter-lg">
            <div v-for="(e, i) in user?.educations" :key="i">
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
                  <p>{{ e.start_date }}</p>
                </div>
                <div>
                  <p style="color:#686552">End Date</p>
                  <p>{{ e.end_date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="q-py-md">
          <p class="text-h6" style="color:#686552">Languages
          </p>
          <div class="row q-col-gutter-lg">
            <div v-for="(l, i) in user?.languages" :key="i">
              <p style="color:#686552">Language {{ i + 1 }}</p>
              <div class="row q-col-gutter-lg wrap">
                <p>{{ l.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="q-py-md">
          <p class="text-h6" style="color:#686552">Skills

          </p>
          <div class="row q-col-gutter-lg">
            <div v-for="(s, i) in user?.skills" :key="i">
              <p style="color:#686552">Skill {{ i + 1 }}</p>
              <div class="row q-col-gutter-lg wrap">
                <p>{{ s.name }}</p>
              </div>
            </div>
          </div>
        </div>
        <div class="q-py-md">
          <p class="text-h6" style="color:#686552">Privacy

          </p>
          <div class="row q-col-gutter-lg">
            <div>
              <p style="color:#686552">Public Profile</p>
              <p>{{ user?.isPublic ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>
        <div class="q-py-md">
          <p class="text-h6" style="color:#686552">Notifications

          </p>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <p style="color:#686552">When Someone Sends me message</p>
              <p>{{ user?.NotificationSetting && user?.NotificationSetting.onMessageRecieve ? 'Yes' : 'No' }}</p>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <p style="color:#686552">When Someone replies to a comment</p>
              <p>{{ user?.NotificationSetting && user?.NotificationSetting.onCommentReply ? 'Yes' : 'No' }}</p>
            </div>

          </div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-6 col-md-3">
              <p style="color:#686552">Get updates from the products you follow when they are updated.</p>
              <p>{{ user?.NotificationSetting && user?.NotificationSetting.onProductUpdate ? 'Yes' : 'No' }}</p>
            </div>
            <div class="col-12 col-sm-6 col-md-3">
              <p style="color:#686552">Personalized updates containing the best the CurrentRelease community has to
                offer.
              </p>
              <p>{{ user?.NotificationSetting && user?.NotificationSetting.onOffers ? 'Yes' : 'No' }}</p>
            </div>
          </div>
        </div>
      </div>


      <div class="row justify-end q-gutter-md">
        <q-btn color="primary" type="submit" style="min-width: 8rem" @click="() => {
          router.push({
            name: 'admin.user.index'
          })
        }">Go Back</q-btn>
      </div>
    </div>
  </div>
</template>
