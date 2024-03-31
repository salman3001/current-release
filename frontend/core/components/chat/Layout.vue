<script lang="ts" setup>
const leftDrawerOpen = ref(false);
const selectedConversation = ref<IConversation | null>(null);
const getImageUrl = useGetImageUrl();
const customFetch = useCustomFetch({ disableToast: true });
const message = ref("");
const newMessage = ref<null | IMessage>(null);
const user = useCookie("user") as unknown as Ref<IUser>;
const { connectSocket, disconnectSocket, socket } = useSocket();

const myIdentifier = `${user?.value?.userType}-${user?.value?.id}`;

const togetlLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const createMessage = async () => {
  if (message.value.length > 0) {
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

      message.value = "";
    } catch (error) {
      console.log(error);
    }
  }
};

onMounted(() => {
  connectSocket("/chat/");
  socket?.value?.on("new-message", (message: IMessage) => {
    newMessage.value = message;
  });
});

onUnmounted(() => {
  disconnectSocket();
  socket.value?.removeAllListeners();
});
</script>

<template>
  <q-layout
    view="lHh lpR lff"
    container
    class="bg-nutral-dim"
    :style="{ height: $q.screen.gt.sm ? '90vh' : '85vh' }"
  >
    <q-header bordered class="bg-nutral-dim">
      <q-toolbar flat class="text-nutral q-px-sm q-px-md-lg">
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="togetlLeftDrawer"
          v-if="$q.screen.lt.lg"
        ></q-btn>
        <q-toolbar-title
          v-if="selectedConversation"
          class="row gap-50 items-center gap-100"
        >
          <q-avatar>
            <q-img
              v-if="
                selectedConversation.participant_one_identifier !== myIdentifier
              "
              :src="
                getImageUrl(
                  selectedConversation?.participantOne?.user?.profile?.avatar
                    ?.url ||
                    selectedConversation?.participantOne?.vendorUser?.profile
                      ?.avatar?.url ||
                    selectedConversation?.participantOne?.adminUser?.profile
                      ?.avatar?.url,
                  '/images/sample-dp.png'
                )
              "
            />
            <q-img
              v-if="
                selectedConversation.participant_two_identifier !== myIdentifier
              "
              :src="
                getImageUrl(
                  selectedConversation?.participantOne?.user?.profile?.avatar
                    ?.url ||
                    selectedConversation?.participantOne?.vendorUser?.profile
                      ?.avatar?.url ||
                    selectedConversation?.participantOne?.adminUser?.profile
                      ?.avatar?.url,
                  '/images/sample-dp.png'
                )
              "
            />
          </q-avatar>
          <span
            v-if="
              selectedConversation?.participant_one_identifier != myIdentifier
            "
          >
            {{
              selectedConversation?.participantOne?.adminUser?.first_name ||
              selectedConversation?.participantOne?.vendorUser?.first_name ||
              selectedConversation?.participantOne?.user?.first_name
            }}
            {{
              selectedConversation?.participantOne?.adminUser?.last_name ||
              selectedConversation?.participantOne?.vendorUser?.last_name ||
              selectedConversation?.participantOne?.user?.last_name
            }}</span
          >
          <span
            v-if="
              selectedConversation?.participant_two_identifier != myIdentifier
            "
          >
            {{
              selectedConversation?.participantTwo?.adminUser?.first_name ||
              selectedConversation?.participantTwo?.vendorUser?.first_name ||
              selectedConversation?.participantTwo?.user?.first_name
            }}
            {{
              selectedConversation?.participantTwo?.adminUser?.last_name ||
              selectedConversation?.participantTwo?.vendorUser?.last_name ||
              selectedConversation?.participantTwo?.user?.last_name
            }}</span
          >
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      bordered
      show-if-above
      side="left"
      v-model="leftDrawerOpen"
      class=""
      style="width: 450px"
    >
      <ScrollArea width="100%" height="100%">
        <q-list padding>
          <ChatConversations
            :new-message="newMessage"
            :selected-coversation-id="selectedConversation?.id"
            @selected="
              (v) => {
                selectedConversation = v;
                leftDrawerOpen = $q.screen.gt.sm ? true : false;
                message = '';
              }
            "
          />
        </q-list>
      </ScrollArea>
    </q-drawer>
    <q-page-container :style="{ height: $q.screen.gt.sm ? '89vh' : '85vh' }">
      <ChatMessages
        :newMessage="newMessage"
        :selected-conversation="selectedConversation!"
        v-if="selectedConversation"
        :socket="(socket as any)"
      />
      <div
        v-else
        class="row full-width justify-center items-center"
        style="height: 80%"
      >
        <div class="column items-center">
          <q-icon ouolined name="forum" size="72px" color="secondary" />
          <p>No Chat Selected. Select A chat to send messages</p>
        </div>
      </div>
    </q-page-container>
    <q-footer elevated class="bg-nutral text-white" v-if="selectedConversation">
      <div class="row">
        <q-input
          :rows="1"
          type="textarea"
          autogrow
          outlined
          v-model="message"
          color="primary"
          class="rounded-borders"
          style="flex-grow: 5"
          placeholder="Type a message"
          @keyup.enter="createMessage()"
        >
        </q-input>

        <q-btn
          name="send"
          color="primary"
          outline
          icon="send"
          size="lg"
          style="flex-grow: 1; max-width: 100px"
          @click="createMessage()"
        />
      </div>
    </q-footer>
  </q-layout>
</template>
