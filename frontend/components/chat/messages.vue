<script setup lang="ts">
const props = defineProps<{
  selectedConversation: IConversation;
}>();

const customFetch = useCustomFetch();
const user = useCookie("user") as unknown as IUser;

const { data, pending } = useAsyncData(async () => {
  const data = await customFetch<IPageRes<IMessage[]>>(
    apiRoutes.chat.conversations.messages(props.selectedConversation.id),
    {
      query: {
        page: 1,
        preload: [{}],
      } as AdditionalParams,
    }
  );
  return data.data;
});
</script>
<template>
  <div v-if="pending">
    <SkeletonBase type="list" v-for="i in 5" />
  </div>
  <div v-else>
    <q-chat-message v-for="m in data?.data" name="me" :text="[m.body]" sent />
  </div>
</template>
