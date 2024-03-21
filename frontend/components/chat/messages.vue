<script setup lang="ts">
import { formatDistance } from "date-fns";
import type { Socket } from "socket.io-client";


const props = defineProps<{
  selectedConversation: IConversation;
  socket: Socket | null
}>();

const customFetch = useCustomFetch();
const user = useCookie("user") as unknown as IUser;

const myIdentifier = `${user?.userType}-${user?.id}`

const { data, pending } = useAsyncData(async () => {
  const data = await customFetch<IPageRes<IMessage[]>>(
    apiRoutes.chat.conversations.messages(props.selectedConversation.id),
    {
      query: {
        page: 1,
        sortBy: 'created_at',
        descending: 'true'
      } as AdditionalParams,
    }
  );
  return data.data;
});

props.socket?.on('new-message', (message: IMessage) => {
  console.log('ran');

  if (message.conversation_id == props.selectedConversation.id) {
    data.value?.data.push(message)
  }

})
onMounted(() => {
})
</script>

<template>
  <div v-if="pending">
    <SkeletonBase type="list" v-for="i in 5" />
  </div>
  <div v-else class="row-reverse">
    <q-chat-message v-for="m in data?.data" :text="[m.body]" :sent="m.user_identifier !== myIdentifier"
      :stamp="formatDistance(Date.now(), m.created_at, { addSuffix: true })"></q-chat-message>
  </div>
</template>
