<script setup lang="ts">
import { formatDistance } from "date-fns";
import { findObjectAndMoveToIndex0 } from "~/utils/helpers";

const props = defineProps<{
  selectedCoversationId?: number;
  newMessage: null | IMessage;
}>();

const emit = defineEmits<{
  (e: "selected", conversations: IConversation): void;
}>();

const route = useRoute();
const customFetch = useCustomFetch();
const getImageUrl = useGetImageUrl();
const user = useCookie("user") as unknown as Ref<IUser>;

const myIdentifier = `${user?.value?.userType}-${user?.value?.id}`;

const { data, pending, refresh } = await useAsyncData(async () => {
  const data = await customFetch<IPageRes<IConversation[]>>(
    apiRoutes.chat.conversations.list,
    {
      query: {
        page: 1,
      } as IQs,
    }
  );

  return data.data;
});

if (route.query?.newConversationId) {
  const existingConversation = data.value?.data.filter(
    (c) => c.id == (route.query.newConversationId as unknown as number)
  );
  if (existingConversation) {
    emit("selected", existingConversation[0]);
  } else {
    refresh();
  }
}

const conversationsRef = ref(data.value);

watch(data, () => {
  conversationsRef.value = data.value;
});

watch(
  () => props.newMessage,
  () => {
    if (props.newMessage !== null) {
      if (
        conversationsRef.value?.data.some(
          (c) => c.id == props.newMessage?.conversation_id
        )
      ) {
        const newData = findObjectAndMoveToIndex0(
          conversationsRef?.value!.data,
          props.newMessage,
          "id",
          "conversation_id"
        );

        conversationsRef.value.data = newData as IConversation[];
        conversationsRef.value.data[0].messages[0] = props.newMessage;
      } else {
        refresh();
      }
    }
  }
);
</script>

<template>
  <q-item v-if="pending" clickable v-ripple>
    <q-item-section class="q-gutter-xs text-muted">
      <SkeletonBase type="list" v-for="i in 5" />
    </q-item-section>
  </q-item>
  <template v-else v-for="c in conversationsRef?.data" :key="c.id">
    <q-item
      clickable
      v-ripple
      @click="emit('selected', c)"
      :class="selectedCoversationId === c.id ? 'bg-nutral-dim' : ''"
    >
      <q-item-section class="q-gutter-xs">
        <q-item-label class="gap-100 row items-center justify-between">
          <q-avatar>
            <q-img
              v-if="c.participant_one_identifier !== myIdentifier"
              :src="
                getImageUrl(
                  c?.participantOne?.user?.profile?.avatar?.url ||
                    c?.participantOne?.vendorUser?.profile?.avatar?.url ||
                    c?.participantOne?.adminUser?.profile?.avatar?.url,
                  '/images/sample-dp.png'
                )
              "
            />
            <q-img
              v-if="c.participant_two_identifier !== myIdentifier"
              :src="
                getImageUrl(
                  c?.participantOne?.user?.profile?.avatar?.url ||
                    c?.participantOne?.vendorUser?.profile?.avatar?.url ||
                    c?.participantOne?.adminUser?.profile?.avatar?.url,
                  '/images/sample-dp.png'
                )
              "
            />
          </q-avatar>
          <p style="flex-grow: 1">
            <span v-if="c?.participant_one_identifier !== myIdentifier">
              {{
                c?.participantOne?.adminUser?.first_name ||
                c?.participantOne?.vendorUser?.first_name ||
                c?.participantOne?.user?.first_name
              }}
              {{
                c?.participantOne?.adminUser?.last_name ||
                c?.participantOne?.vendorUser?.last_name ||
                c?.participantOne?.user?.last_name
              }}</span
            >
            <span v-if="c?.participant_two_identifier !== myIdentifier">
              {{
                c?.participantTwo?.adminUser?.first_name ||
                c?.participantTwo?.vendorUser?.first_name ||
                c?.participantTwo?.user?.first_name
              }}
              {{
                c?.participantTwo?.adminUser?.last_name ||
                c?.participantTwo?.vendorUser?.last_name ||
                c?.participantTwo?.user?.last_name
              }}</span
            >
            <ClientOnly>
              <p v-if="c.messages[0]" class="text-muted">
                {{
                  formatDistance(Date.now(), c.messages[0]?.created_at, {
                    includeSeconds: false,
                  })
                }}
              </p>
            </ClientOnly>
          </p>
        </q-item-label>
        <q-item-label
          v-if="c.messages[0]"
          caption
          class="text-muted ellipsis-2-lines"
          >{{ c.messages[0].body }}</q-item-label
        >
        <q-item-label
          v-else
          caption
          class="text-muted ellipsis-2-lines text-nutral"
          >send hi <q-icon name="waving_hand" /> to
          <span v-if="c?.participant_one_identifier != myIdentifier">
            {{
              c?.participantOne?.adminUser?.first_name ||
              c?.participantOne?.vendorUser?.first_name ||
              c?.participantOne?.user?.first_name
            }}
            {{
              c?.participantOne?.adminUser?.last_name ||
              c?.participantOne?.vendorUser?.last_name ||
              c?.participantOne?.user?.last_name
            }}</span
          >
          <span v-if="c?.participant_two_identifier != myIdentifier">
            {{
              c?.participantTwo?.adminUser?.first_name ||
              c?.participantTwo?.vendorUser?.first_name ||
              c?.participantTwo?.user?.first_name
            }}
            {{
              c?.participantTwo?.adminUser?.last_name ||
              c?.participantTwo?.vendorUser?.last_name ||
              c?.participantTwo?.user?.last_name
            }}</span
          ></q-item-label
        >
      </q-item-section>
    </q-item>
    <q-separator
      :color="selectedCoversationId === c.id ? 'primary' : ''"
      :style="{ height: selectedCoversationId === c.id ? '2px' : '1px' }"
    />
  </template>
</template>
