<script setup lang="ts">
import {
  subscriberApi,
  interestApi
} from '@/utils/BaseApiService';
import { date } from 'quasar';

const route = useRoute()

const { formatDate } = date

const form = ref({
  subscriber: {
    firstName: '',
    lastName: '',
    phone: null,
    email: null,
    status: false,
    dob: '',
  },
  interests: [],
});


const { data: interests } = await interestApi.index({
  fields: ['name', 'id'],
})


const { data: subscriber } = await subscriberApi.show(route.params.id as string, {
  populate: {
    interests: {
      fields: ['name', 'id']
    }
  }
})

watch(subscriber, () => {
  form.value.subscriber.firstName = (subscriber.value as any)?.first_name || ''
  form.value.subscriber.lastName = (subscriber.value as any)?.last_name || ''
  form.value.subscriber.email = (subscriber.value as any)?.email || ''
  form.value.subscriber.phone = (subscriber.value as any)?.phone || ''
  form.value.subscriber.dob = (subscriber.value as any)?.dob ? formatDate((subscriber.value as any).dob, 'DD/MM/YYYY') : ''
  form.value.subscriber.status = (subscriber.value as any)?.status == 1 ? true : false

  form.value.interests = (subscriber.value as any)?.interests ? (subscriber.value as any).interests.map((i: any) => i?.id) : []
}, {
  immediate: true,
  deep: true
})




const { execute: createSubscriber, loading: posting } =
  subscriberApi.put({}, {
    onSuccess: () => {
      navigateTo(routes.admin.subscribers.index)
    }
  });

const submit = async () => {
  createSubscriber(route.params.id as string, form.value,)
};
</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm q-mb-xl">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.subscribers.index)

      }
        " />
      <span class="text-h6"> Edit Subscriber </span>
    </div>
    <q-form class="column q-gutter-y-xl" @submit="submit">
      <div class="q-gutter-y-md">
        <div class="row q-col-gutter-md">
          <q-input outlined v-model="form.subscriber.firstName" label="First Name" class="col-12 col-sm-6 col-md-3"
            :rules="[
              rules.required('required'),
            ]" />
          <q-input outlined :debounce="500" v-model="form.subscriber.lastName" label="Last Name"
            class="col-12 col-sm-6 col-md-3" :rules="[
              rules.required('required'),
            ]" />
          <q-input outlined type="number" v-model="form.subscriber.phone" label="Phone" class="col-12 col-sm-6 col-md-3"
            :rules="[
              rules.required('required'), rules.minLength(9, 'Phone number is not valid')
            ]" />
          <q-input outlined type="email" v-model="form.subscriber.email" label="Email" class="col-12 col-sm-6 col-md-3"
            :rules="[
              rules.required('required'), rules.email('Email Not valid'), async (v) =>
                (await rules.unique(
                  '/api/subscriber/unique-field',
                  'email',
                  v, subscriber?.email
                )) || 'Email Already Taken',
            ]" />
          <q-select v-if="interests" outlined debounce="500" v-model="form.interests" emit-value map-options
            label="Intrests" class="col-12 col-sm-6 col-md-3"
            :options="[...interests.map((l: any) => ({ label: l?.name, value: l?.id }))]" multiple use-chips />
          <q-input outlined v-model="form.subscriber.dob" label="Date of Birth" mask="##/##/####" hint="dd/mm/yyyy">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.subscriber.dob" mask="DD/MM/YYYY">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>

        </div>
        <q-toggle v-model="form.subscriber.status" label="Activate" />
      </div>
      <div class="row justify-end q-gutter-md">
        <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
          navigateTo(routes.admin.subscribers.index)
        }
          ">Cancle</q-btn>
        <q-btn color="primary" v-if="posting">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Save</q-btn>
      </div>
    </q-form>
  </div>
</template>
