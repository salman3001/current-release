<script setup lang="ts">
import { date } from 'quasar';
import {
  AdminUserApi,
  activityLogApi
} from '@/utils/BaseApiService';

const route = useRoute()

const uploads = ref('')
const tab = ref(route.query.activity ? 'activity' : 'user')
const page = ref(1)


const { formatDate } = date

const user = ref<Record<string, any> | null>(null)
AdminUserApi.show(route.params.id as string, {
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
  }
}).then(({ data }) => {
  user.value = data.value
})

const activities = ref<{ data: any[], meta: Record<any, any> } | null>(null)

const getActivties = (page: number) => {
  activityLogApi.index({
    filter: {
      admin_user_id: route.params.id as string,
    },
    sortBy: 'created_at',
    page: page,
    rowsPerPage: '10'
  }).then(({ data }) => {
    if (activities.value?.data) {
      const newArray = activities.value.data.concat(data.value.data)
      activities.value.data = newArray
    } else {
      activities.value = data.value
    }
  })
}

watch(page, (newVal) => {
  getActivties(newVal)
})


onMounted(() => {
  uploads.value = process.env.UPLOAD as string;
  getActivties(page.value)
});

</script>

<template>
  <div class="q-pa-md q-pa-md-lg">
    <div class="row items-center q-gutter-sm">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.admin_users)
      }
        " />
      <span class="text-h6"> View User </span>
    </div>
    <q-card flat class="q-my-lg">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left"
        narrow-indicator>
        <q-tab name="user" label="View User" />
        <q-tab name="activity" label="Acttivity Logs" />
      </q-tabs>

      <q-separator />

      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="user">
          <div class="text-h6">User Information</div>
          <div class="q-gutter-y-md q-pt-xl">
            <div class="q-col-gutter-md">
              <div class="q-py-md rounded">
                <q-img :src="user?.avatar?.url
                  ? $config.public.baseApi + user?.avatar?.url
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
                <p>{{ user?.address?.address }}</p>
                <div style="overflow-x: scroll">
                  <table class="full-width">
                    <thead>
                      <tr class="text-grey-8">
                        <th style="text-align: start; padding: 0.5rem">Continent</th>
                        <th style="text-align: start; padding: 0.5rem">Country</th>
                        <th style="text-align: start; padding: 0.5rem; min-width: 5rem">
                          State
                        </th>
                        <th style="text-align: start; padding: 0.5rem; min-width: 5rem">
                          City
                        </th>
                        <th style="text-align: start; padding: 0.5rem; min-width: 5rem">
                          Street
                        </th>
                        <th style="text-align: start; padding: 0.5rem">Postcode</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style="padding: 0.5rem">{{ user?.address?.continent?.name }}</td>
                        <td style="padding: 0.5rem">{{ user?.address?.country?.name }}</td>
                        <td style="padding: 0.5rem">{{ user?.address?.state?.name }}</td>
                        <td style="padding: 0.5rem">{{ user?.address?.city?.name }}</td>
                        <td style="padding: 0.5rem">{{ user?.address?.street?.name }}</td>
                        <td style="padding: 0.5rem">
                          {{ user?.address?.zip }}
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
            </div>


            <div class="row justify-end q-gutter-md">
              <q-btn color="primary" type="submit" style="min-width: 8rem" @click="() => {
                navigateTo(routes.admin.admin_users)
              }">Go Back</q-btn>
            </div>
          </div>
        </q-tab-panel>

        <q-tab-panel name="activity">
          <q-timeline color="secondary">
            <q-timeline-entry heading>
              Activity Logs
            </q-timeline-entry>
            <div v-if="activities">
              <q-timeline-entry v-for="(a, i) in activities.data" :title="a.name"
                :subtitle="formatDate(a.created_at, 'DD/MM/YYYY hh:mm')" :key="i" />
            </div>
          </q-timeline>
          <q-btn v-if="activities && activities.meta.next_page_url" color="primary" @click="page += 1">View More</q-btn>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>
