<script setup lang="ts">
import { campaignApi } from '@/utils/BaseApiService';
import { date } from 'quasar';


const route = useRoute();
const { formatDate } = date


const { data: campaign } = await campaignApi.show(route.params.id as string, {
  populate: {
    template: {
      fields: ['*'],
    },
    interests: {
      fields: ['name']
    },
    campaignType: {
      fields: ['name']
    }
  },
})


</script>

<template>
  <div class="q-pa-md q-pa-sm-lg q-pa-md-xl">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.campaigns.index)
      }
        " />
      <span class="text-h6"> View Campaign </span>
    </div>
    <div v-if="campaign" class="q-gutter-y-lg">
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Receipts
        </p>
        <div style="overflow-x: scroll;">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  Campain Type
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  Interests
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">
                  <div>{{ campaign?.campaignType?.name }}</div>
                </td>
                <td style="padding: 0.5rem">
                  <div class="row flex-wrap justify-start q-gutter-xs">
                    <q-badge v-for="(int, idx) in campaign?.interests" color="positive" outline :label="int.name"
                      :key="idx" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Setup
        </p>
        <div style="overflow-x: scroll;">
          <table class="full-width">
            <thead>
              <tr class="text-grey-8">
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  Campain Name
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  Email Subject
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  From Name
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  From Email
                </th>
                <th style="text-align: start; padding: 0.5rem; min-width: 5rem;text-wrap: nowrap;">
                  Reply To
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 0.5rem">
                  <div>{{ campaign.name }}</div>
                </td>
                <td style="padding: 0.5rem">
                  <div>{{ campaign.subject }}</div>
                </td>
                <td style="padding: 0.5rem">
                  <div>{{ campaign.from_name }}</div>
                </td>
                <td style="padding: 0.5rem">
                  <div>{{ campaign.from_email }}</div>
                </td>
                <td style="padding: 0.5rem">
                  <div>{{ campaign.reply_to }}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Selected Template
        </p>
        <div>
          <div>
            <div class="q-py-md">
              <q-img spinner-color="white" :src="campaign?.template.thumbnail?.url
                ? $config.public.baseApi + campaign?.template.thumbnail?.url
                : '/images/dummy-thumb.jpg'
                " :alt="campaign?.template?.name"
                style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
            </div>
          </div>
          <div>
            <div class="q-gutter-lg">
              <div>
                <p style="color: #686552;">Description</p>
                <p>{{ campaign?.template?.desc }}</p>
              </div>
              <div>
                <p style="color: #686552;">Content</p>
                <p v-html="campaign?.template.content"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="q-py-md">
        <p class="text-h6" style="color:#686552">Delivery Date Time
        </p>
        <div>
          {{ formatDate(campaign.delivery_date_time, 'DD/MM/YYYY hh:MM') }}
        </div>
      </div>
    </div>
  </div>
</template>
