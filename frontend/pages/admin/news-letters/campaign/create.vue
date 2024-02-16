<script setup lang="ts">
import { campaignTypeApi, interestApi, templateApi, campaignApi } from '@/utils/BaseApiService';
import { date } from 'quasar';

const step = ref(1)
const { formatDate } = date


const form = ref({
  campaign: {
    name: '',
    subject: '',
    fromName: '',
    fromEmail: '',
    replyTo: '',
    status: false,
    deliveryDateTime: '',
    campaignTypeId: ''
  },
  interests: [],
  templateId: ''
})


const { data: interest } = await interestApi.index({
  fields: ['name', 'id']
})


const { data: campaignTypes } = await campaignTypeApi.index({
  fields: ['name', 'id']
})


const { data: templates } = await templateApi.index({
  fields: ['name', 'id']
})

const template = ref<Record<string, any> | null>(null)

const fetchTemplate = (templateId: string) => {
  templateApi.show(templateId).then(({ data }) => {
    template.value = data.value
  })
}

const selectedCampaign = computed(() => {
  if (form.value.campaign.campaignTypeId != '') {
    return campaignTypes.value?.filter((c: any) => {
      return c.id == form.value.campaign.campaignTypeId
    })[0]
  } else {
    return null
  }
})


const selectedInterests = computed(() => {
  if (form.value.interests.length > 0) {
    const vals = form.value.interests.map(formInt => {
      const val = (interest.value as any[]).filter((v: any) => v.id == formInt)
      return val[0]
    })
    return vals
  } else {
    return []
  }
})

const { loading, execute } = campaignApi.post({}, {
  onSuccess: () => {
    navigateTo(routes.admin.campaigns.index)
  }
})


</script>

<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.campaigns.index)

      }
        " />
      <span class="text-h6"> Add Campaign </span>
    </div>
    <div>
      <q-stepper flat v-model="step" ref="stepper" color="primary" animated>
        <q-step :name="1" title="Recipients" icon="settings" :done="step > 1">

          <q-form class="column q-gutter-y-xl" @submit="() => {
            step = 2
          }" @validation-error="srollToView">
            <div class=" row q-col-gutter-md">
              <q-select v-model="form.campaign.campaignTypeId" v-if="campaignTypes" dense options-dense emit-value
                map-options outlined :options="[{ label: 'All', value: null }, ...campaignTypes.map((r: any) => ({
                  label: r.name,
                  value: r.id,
                }))]" label="Campaign Type" class="col-12 col-sm-6 col-md-3" style="min-width: 8rem"
                :rules="[rules.required('required')]" />
              <q-select v-model="form.interests" v-if="interest" dense options-dense emit-value map-options outlined
                :options="[{ label: 'All', value: null }, ...interest.map((r: any) => ({
                  label: r.name,
                  value: r.id,
                }))]" label="Intrests" class="col-12 col-sm-6 col-md-3" style="min-width: 8rem" multiple use-chips
                :rules="[rules.required('required')]" />
            </div>
            <div class="row justify-end q-gutter-md">
              <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit"
                label="Back" class="q-ml-sm" />
              <q-btn color="primary" type="submit" style="min-width: 8rem">Next</q-btn>
            </div>
          </q-form>
        </q-step>

        <q-step :name="2" title="Setup" icon="create_new_folder" :done="step > 2">
          <q-form class="column q-gutter-y-xl" @submit="() => {
            step = 3
          }" @validation-error="srollToView">
            <div class=" row q-col-gutter-md">
              <q-input outlined v-model="form.campaign.name" label="Name" class="col-12 col-sm-6 col-md-3"
                :rules="[rules.required('required')]" />
              <q-input outlined v-model="form.campaign.subject" label="Email Subject" class="col-12 col-sm-6 col-md-3"
                :rules="[rules.required('required')]" />
              <q-input outlined v-model="form.campaign.fromName" label="From Name" class="col-12 col-sm-6 col-md-3"
                :rules="[rules.required('required')]" />
              <q-input outlined debounce="500" v-model="form.campaign.fromEmail" type="email" label="From Email"
                class="col-12 col-sm-6 col-md-3" :rules="[
                  rules.required('required'),
                  rules.email('Email is not valid'),
                ]" />
              <q-input outlined debounce="500" v-model="form.campaign.replyTo" type="email" label="Reply To"
                class="col-12 col-sm-6 col-md-3" :rules="[
                  rules.required('required'),
                  rules.email('Email is not valid'),
                ]" />
            </div>
            <div class="row justify-end q-gutter-md">
              <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit"
                label="Back" class="q-ml-sm" @click="() => {
                  step = 1
                }" />
              <q-btn color="primary" type="submit" style="min-width: 8rem">Next</q-btn>
            </div>
          </q-form>
        </q-step>

        <q-step :name="3" title="Template" icon="assignment" :done="step > 3">
          <q-form class="column q-gutter-y-xl" @submit="() => {
            step = 4
          }" @validation-error="srollToView">
            <div class=" row q-col-gutter-md">
              <q-select v-model="form.templateId" v-if="templates" dense options-dense emit-value map-options outlined
                :options="[{ label: 'All', value: null }, ...templates.map((r: any) => ({
                  label: r.name,
                  value: r.id,
                }))]" label="Select Template" class="col-12 col-sm-6 col-md-3" style="min-width: 8rem"
                :rules="[rules.required('required')]" @update:model-value="(v) => {
                  fetchTemplate(v)
                }" />
            </div>
            <div v-if="template">
              <p class="text-h6">Template Preview</p>
              <div>
                <div class="q-py-md">
                  <q-img spinner-color="white" :src="template.thumbnail?.url
                    ? $config.public.baseApi + template.thumbnail?.url
                    : '/images/dummy-thumb.jpg'
                    " :alt="template?.name"
                    style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
                </div>
              </div>
              <div>
                <div class="q-gutter-lg">
                  <div>
                    <p style="color: #686552;">Description</p>
                    <p>{{ template?.desc }}</p>
                  </div>
                  <div>
                    <p style="color: #686552;">Content</p>
                    <p v-html="template.content"></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="row justify-end q-gutter-md">
              <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit"
                label="Back" class="q-ml-sm" @click="() => {
                  step = 2
                }" />
              <q-btn color="primary" type="submit" style="min-width: 8rem">Next</q-btn>
            </div>
          </q-form>
        </q-step>

        <q-step :name="4" title="Schedule" icon="add_comment" :done="step > 4">
          <q-form class="q-col-gutter-xl" @submit="() => {
            step = 5
          }" @validation-error="srollToView">
            <p class="text-h6">Select Delivery date and time</p>
            <div class="row q-col-gutter-lg">
              <div>
                <q-date v-model="form.campaign.deliveryDateTime" mask="DD/MM/YYYY HH:mm"
                  :navigation-min-year-month="formatDate(Date.now(), 'YYYY/MM')" />
              </div>
              <div>
                <q-time v-model="form.campaign.deliveryDateTime" mask="DD/MM/YYYY HH:mm" />
              </div>
            </div>
            <div class="row justify-end q-gutter-md">
              <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit"
                label="Back" class="q-ml-sm" @click="() => {
                  step = 3
                }" />
              <q-btn color="primary" type="submit" style="min-width: 8rem">Next</q-btn>
            </div>
          </q-form>
        </q-step>
        <q-step :name="5" title="Confirm" icon="assignment" :done="step > 5">
          <q-form class="column q-gutter-y-xl" @submit="() => {
            execute(form)
          }" @validation-error="srollToView">
            <div class="q-gutter-y-lg">
              <h6>Preview</h6>
              <div class="q-py-md">
                <p class="text-h6" style="color:#686552">Personal
                  <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="() => step = 1" />
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
                          <div v-if="selectedCampaign">{{ selectedCampaign?.name }}</div>
                        </td>
                        <td style="padding: 0.5rem">
                          <div v-if="selectedInterests.length > 1" class="row flex-wrap justify-start q-gutter-xs">
                            <q-badge v-for="(int, idx) in selectedInterests" color="positive" outline :label="int.name"
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
                  <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="() => step = 2" />
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
                          <div>{{ form.campaign.name }}</div>
                        </td>
                        <td style="padding: 0.5rem">
                          <div>{{ form.campaign.subject }}</div>
                        </td>
                        <td style="padding: 0.5rem">
                          <div>{{ form.campaign.fromName }}</div>
                        </td>
                        <td style="padding: 0.5rem">
                          <div>{{ form.campaign.fromEmail }}</div>
                        </td>
                        <td style="padding: 0.5rem">
                          <div>{{ form.campaign.replyTo }}</div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="q-py-md">
                <p class="text-h6" style="color:#686552">Selected Template
                  <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="() => step = 3" />
                </p>
                <div>
                  <div>
                    <div class="q-py-md">
                      <q-img spinner-color="white" :src="template?.thumbnail?.url
                        ? $config.public.baseApi + template?.thumbnail?.url
                        : '/images/dummy-thumb.jpg'
                        " :alt="template?.name"
                        style="height: 15rem; width: 15rem;border: 1px solid #e6e4d9;border-radius: 1rem;" />
                    </div>
                  </div>
                  <div>
                    <div class="q-gutter-lg">
                      <div>
                        <p style="color: #686552;">Description</p>
                        <p>{{ template?.desc }}</p>
                      </div>
                      <div>
                        <p style="color: #686552;">Content</p>
                        <p v-html="template?.content"></p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="q-py-md">
                <p class="text-h6" style="color:#686552">Delivery Date Time
                  <q-btn color="#686552" outline size="sm" icon="edit" label="edit" @click="() => step = 4" />
                </p>
                <div>
                  {{ form.campaign.deliveryDateTime }}
                </div>
              </div>
            </div>
            <div class="row justify-end q-gutter-md">
              <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" type="submit"
                label="Back" class="q-ml-sm" @click="() => {
                  step = 4
                }" />
              <q-btn color="primary" v-if="loading">
                <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                  track-color="orange-2" style="min-width: 8rem" />
              </q-btn>
              <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Submit</q-btn>
            </div>
          </q-form>
        </q-step>
      </q-stepper>
    </div>
  </div>
</template>


