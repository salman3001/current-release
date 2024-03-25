<script setup lang="ts">
import { formatDistance } from "date-fns";
import { Socket } from "socket.io-client";

const props = defineProps<{
  selectedConversation: IConversation;
  socket: Socket | null;
  newMessage: null | IMessage;
}>();

const customFetch = useCustomFetch();
const user = useCookie("user") as unknown as Ref<IUser>;

const myIdentifier = `${user?.value.userType}-${user?.value.id}`;

const { data, pending, refresh } = await useAsyncData(async () => {
  const data = await customFetch<IPageRes<IMessage[]>>(
    apiRoutes.chat.conversations.messages(props.selectedConversation.id),
    {
      query: {
        page: 1,
        sortBy: "created_at",
        descending: "true",
      } as AdditionalParams,
    }
  );
  return data.data;
});

const dataRef = ref(data.value);

watch(data, () => {
  dataRef.value = data.value;
});

watch(
  () => props.selectedConversation,
  () => {
    refresh();
  }
);

watch(
  () => props.newMessage,
  () => {
    if (
      props.newMessage !== null &&
      props.newMessage.conversation_id == props.selectedConversation.id
    ) {
      dataRef.value?.data.unshift(props.newMessage);
      if (dataRef.value?.data.length! > 19) {
        dataRef.value?.data.pop();
      }
    }
  }
);

const getMoreMessages = async () => {
  if (data.value?.meta.next_page_url) {
    const newData = await customFetch<IPageRes<IMessage[]>>(
      apiRoutes.chat.conversations.messages(props.selectedConversation.id),
      {
        query: {
          page: dataRef.value?.meta.current_page! + 1,
          sortBy: "created_at",
          descending: "true",
        } as AdditionalParams,
      }
    );

    const joinedData = [
      ...(dataRef?.value?.data || []),
      ...newData?.data?.data,
    ];

    dataRef.value!.data = joinedData;
    dataRef.value!.meta = newData.data.meta;
  }
};
</script>

<template>
  <div v-if="pending">
    <SkeletonBase type="list" v-for="i in 5" />
  </div>
  <div v-else ref="scrollRef" class="hide-scrollbar scroll q-pa-md q-pa--md-lg" style="
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column-reverse;
      max-width: 900px;
      margin-left: auto;
      margin-right: auto;
    ">
    <!-- <q-chat-message
      v-for="m in data?.data"
      :text="[m.body]"
      :sent="m.user_identifier !== myIdentifier"
      :stamp="formatDistance(Date.now(), m.created_at, { addSuffix: true })"
    ></q-chat-message> -->
    <q-chat-message v-for="m in dataRef?.data" :text="[m.body]" :sent="m.user_identifier == myIdentifier"
      :stamp="formatDistance(Date.now(), m.created_at, { addSuffix: true })"></q-chat-message>

    <div v-if="data?.data?.length! > 1" class="row justify-center full-width">
      <LoadingIndicator v-if="pending" />
      <q-btn v-else-if="dataRef?.meta.next_page_url" color="secondary" @click="() => {
    getMoreMessages();
    // y = -10000000000;
    // page += 1;
  }
    ">Load More</q-btn>
    </div>
  </div>
</template>
