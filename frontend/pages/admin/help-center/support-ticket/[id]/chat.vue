<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  SupportTickeApi
} from '@/utils/BaseApiService';
import { onUnmounted, onUpdated, ref } from 'vue';
import { useScroll } from '@vueuse/core'
import { formatDistance, parseISO } from 'date-fns';

definePageMeta({
  layout: 'admin-layout'
})

const scrollRef = ref<HTMLElement | null>(null)
const { y } = useScroll(scrollRef)
const page = ref(1)

const route = useRoute();
const chatStore = chatMessageStore()
const message = ref('')
const updatedOnce = ref(false)

const { data: ticket } = await SupportTickeApi.show(route.params.id as string, {
  populate: {
    user: { fields: ['id', 'first_name', 'last_name'] }
  }
})

watch(ticket, async () => {
  await chatStore.getMessages((ticket.value as any).id)
  chatStore.connectSocket((ticket.value as any).id)
}, {
  deep: true,
  immediate: true
})

const { execute: createMessage, loading: sendingMessage } = SupportTickeApi.createMessage()


onUnmounted(() => {
  chatStore.disconnectSocket()
})

onUpdated(() => {
  if (!updatedOnce.value) {
    y.value = 10000000000
  }
  updatedOnce.value = true
},)

</script>

<template>
  <div class="q-pa-sm q-pa-sm-lg">

    <div class="q-pa-md row q-gutter-md ">
      <div style="width: 100%;max-width: 400px;font-size: larger;">
        <div class="row items-center q-gutter-sm q-mb-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            navigateTo(routes.admin.help_center.support_ticket)
          }
            " />
          <span class="text-h6 "> Chat Support </span>
        </div>
        <div v-if="ticket">
          <div>
            <span style="font-weight: 700;">User Name:</span> {{ ticket.user.first_name }} {{ ticket.user.last_name }}
          </div>
          <p class="text-h6 q-pt-md">subject :</p>
          <div>
            {{ ticket.subject }}
          </div>
        </div>
      </div>
      <div class="q-pa-md q-pa-sm-lg"
        style="width: 100%;max-width: 600px;height: 80vh; border: 1px solid lightgray;border-radius: 10px;display: flex;flex-direction: column;justify-content: space-between;gap: 20px;">

        <div v-if="!chatStore.messages" class="row justify-center">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </div>
        <div ref="scrollRef" v-if="chatStore.messages" class="hide-scrollbar scroll"
          style="height: 100%;display: flex; flex-direction: column-reverse;">

          <q-chat-message v-for="(m, i) in chatStore.messages?.data" :key="i" :text="[m.message]" title="sas"
            :sent="m.type == 'AdminUser'" :name="m.type == 'AdminUser' ? 'Me' : ticket?.user?.first_name"
            :stamp="formatDistance(parseISO(m.created_at), Date.now(), { addSuffix: true })" />
          <div v-if="chatStore.messages?.data.length > 1" class="row justify-center full-width">
            <q-circular-progress v-if="chatStore.loadingMore" indeterminate size="20px" class="q-px-10" :thickness="1"
              color="grey-8" track-color="orange-2" style="min-width: 8rem" />
            <q-btn v-else-if="chatStore.messages.data.length > 19" size="sm" color="secondary"
              @click="() => { chatStore.getMoreMessages(ticket?.id, page); y = -10000000000; page += 1 }">Load
              More</q-btn>
          </div>
        </div>
        <div>
          <q-input v-model="message" filled label="Reply" @keyup.enter="() => {
            createMessage(ticket?.id, { message }).then(() => {
              message = ''
              y = 10000000000
            })
          }">
            <template v-slot:append>
              <q-icon name="send" @click="() => {
                createMessage(ticket?.id, { message }).then(() => {
                  message = ''
                  y = 10000000000
                })
              }"></q-icon>
            </template>
          </q-input>
        </div>
      </div>
    </div>
  </div>
</template>
