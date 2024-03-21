<script lang="ts" setup>
const leftDrawerOpen = ref(false);
const selectedConversation = ref<IConversation | null>(null);
const getImageUrl = useGetImageUrl();
const customFetch = useCustomFetch({ disableToast: true });
const message = ref("");
const user = useCookie('user') as unknown as Ref<IUser>
const { connectSocket, disconnectSocket, socket } = useSocket()

const myIdentifier = `${user?.value?.userType}-${user?.value?.id}`

const togetlLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const createMessage = async () => {
  try {
    const res = await customFetch(
      apiRoutes.chat.conversations.create_message(
        selectedConversation.value!.id
      ),
      {
        method: "post",
        body: {
          body: message.value,
        },
      }
    );
  } catch (error) {
    console.log(error);
  }
};

onMounted(() => {
  connectSocket('/chat/')
})

onUnmounted(() => {
  disconnectSocket()
})
</script>

<template>
  <q-layout view="lHh LpR lFf" container class="bg-nutral-dim" :style="{ height: $q.screen.gt.sm ? '90vh' : '85vh' }">
    <q-header bordered class="bg-nutral">

      <q-toolbar flat class="text-nutral q-px-sm q-px-md-lg">
        <q-btn dense flat round icon="menu" @click="togetlLeftDrawer" v-if="$q.screen.lt.lg"></q-btn>
        <q-toolbar-title v-if="selectedConversation" class="row gap-50 items-center gap-100">
          <q-avatar>
            <img :src="getImageUrl(
    selectedConversation.participant_one_identifier != myIdentifier ?
      selectedConversation?.participantOne?.user?.profile?.avatar
        ?.url : selectedConversation.participant_two_identifier != myIdentifier ?
        selectedConversation?.participantOne?.user?.profile?.avatar
          ?.url : undefined,
    '/images/sample-dp.png'
  )
    " />
          </q-avatar>
          <span v-if="selectedConversation?.participant_one_identifier != myIdentifier">
            {{
    selectedConversation?.participantOne?.adminUser?.first_name ||
    selectedConversation?.participantOne?.vendorUser?.first_name
    || selectedConversation?.participantOne?.user?.first_name
  }} {{
      selectedConversation?.participantOne?.adminUser?.last_name ||
      selectedConversation?.participantOne?.vendorUser?.last_name
      || selectedConversation?.participantOne?.user?.last_name
    }}</span>
          <span v-if="selectedConversation?.participant_two_identifier != myIdentifier">
            {{
    selectedConversation?.participantTwo?.adminUser?.first_name ||
    selectedConversation?.participantTwo?.vendorUser?.first_name
    || selectedConversation?.participantTwo?.user?.first_name
  }} {{
      selectedConversation?.participantTwo?.adminUser?.last_name ||
      selectedConversation?.participantTwo?.vendorUser?.last_name
      || selectedConversation?.participantTwo?.user?.last_name
    }}</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer bordered show-if-above side="left" v-model="leftDrawerOpen" class="" style="width: 450px;">
      <ScrollArea width="100%" height="100%">
        <q-list padding>
          <ChatConversations @selected="(v) => {
    selectedConversation = v;
    message = '';
  }
    " />
        </q-list>
      </ScrollArea>
    </q-drawer>
    <q-page-container :style="{ height: $q.screen.gt.sm ? '90vh' : '82vh' }" class="column justify-between">
      <div class="bg-nutral-dim col-10" style="flex-direction: column-reverse">
        <ScrollArea :height="$q.screen.gt.sm ? '70vh' : '65vh'" width="100%">
          <div class=" q-pa-lg column q-pa-md-xl">

            <ChatMessages :selected-conversation="selectedConversation!" v-if="selectedConversation" :socket="socket" />
            <div v-else>no message</div>
          </div>
        </ScrollArea>
      </div>
      <div class="bg-nutral-dim col-2 q-pa-lg q-pa-md-xl">
        <q-input outlined v-model="message" color="primary" class="bg-nutral rounded-borders"
          v-if="selectedConversation">
          <template v-slot:after>
            <q-btn name="send" color="primary" icon="send" @click="() => {
    if (message.length > 0) {
      createMessage();
    }
    }
    " />
          </template>
        </q-input>
      </div>
    </q-page-container>
  </q-layout>
</template>
