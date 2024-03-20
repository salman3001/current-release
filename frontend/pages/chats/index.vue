<script lang="ts" setup>
const leftDrawerOpen = ref(false);
const selectedConversation = ref<IConversation | null>(null);
const getImageUrl = useGetImageUrl();
const customFetch = useCustomFetch({ disableToast: true });
const message = ref("");

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
</script>

<template>
  <q-layout
    view="lHh LpR lFf"
    container
    class="bg-nutral-dim"
    :style="{ height: $q.screen.gt.sm ? '90vh' : '85vh' }"
  >
    <q-header bordered class="bg-nutral">
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
            <img
              :src="
                getImageUrl(
                  selectedConversation?.participant[0]?.user?.profile?.avatar
                    ?.url ||
                    selectedConversation?.participant[0]?.adminUser?.profile
                      ?.avatar?.url ||
                    selectedConversation?.participant[0]?.vendorUser?.profile
                      ?.avatar?.url,
                  '/images/sample-dp.png'
                )
              "
            />
          </q-avatar>
          <span>
            {{
              selectedConversation?.participant[0]?.adminUser?.first_name ||
              selectedConversation?.participant[0]?.user?.first_name ||
              selectedConversation?.participant[0]?.vendorUser?.first_name
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
    >
      <ScrollArea width="100%" height="100%">
        <q-list padding>
          <ChatConversations
            @selected="
              (v) => {
                selectedConversation = v;
                message = '';
              }
            "
          />
        </q-list>
      </ScrollArea>
    </q-drawer>
    <q-page-container
      :style="{ height: $q.screen.gt.sm ? '90vh' : '82vh' }"
      class="column justify-between"
    >
      <div
        class="bg-nutral-dim col-10 q-pa-lg column q-pa-md-xl"
        style="flex-direction: column-reverse"
      >
        <ChatMessages
          :selected-conversation="selectedConversation!"
          v-if="selectedConversation"
        />
        <div v-else>no message</div>
      </div>
      <div class="bg-nutral-dim col-2 q-pa-lg q-pa-md-xl">
        <q-input
          outlined
          v-model="message"
          color="primary"
          class="bg-nutral rounded-borders"
          v-if="selectedConversation"
        >
          <template v-slot:after>
            <q-btn
              name="send"
              color="primary"
              icon="send"
              @click="
                () => {
                  if (message.length > 0) {
                    createMessage();
                  }
                }
              "
            />
          </template>
        </q-input>
      </div>
    </q-page-container>
  </q-layout>
</template>
