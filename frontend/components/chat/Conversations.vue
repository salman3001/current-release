<script setup lang="ts">
const customFetch = useCustomFetch();
const getImageUrl = useGetImageUrl();
const user = useCookie("user") as unknown as IUser;

const emit = defineEmits<{
  (e: "selected", conversations: IConversation): void;
}>();

const { data, pending } = await useAsyncData(async () => {
  const data = await customFetch<IPageRes<IConversation[]>>(
    apiRoutes.chat.conversations.list,
    {
      query: {
        page: 1,
        preload: [
          {
            participant: {
              preload: [
                {
                  user: {
                    select: ["first_name"],
                    preload: [
                      {
                        profile: {
                          select: ["avatar"],
                        },
                      },
                    ],
                  },
                  vendorUser: {
                    select: ["first_name"],
                  },
                  adminUser: {
                    select: ["first_name"],
                  },
                },
              ],
            },
          },
          {
            messages: {
              sortBy: "created_at",
              limit: 1,
            },
          },
        ],
      } as AdditionalParams,
    }
  );

  return data.data;
});

const filteredData = computed(() =>
  data.value?.data.filter((c) => {
    const participant = c.participant.filter((p) => {
      let isSameUser = false;
      if (p.userType == user.userType) {
        if ((p.userType as any) == userTypes.USER && p.userId == user.id) {
          isSameUser = true;
        }
        if (
          (p.userType as any) == userTypes.VENDER &&
          p.vendorUserId == user.id
        ) {
          isSameUser = true;
        }
        if (
          (p.userType as any) == userTypes.ADMIN &&
          p.adminUserId == user.id
        ) {
          isSameUser = true;
        }
      }
      return !isSameUser;
    });

    return { ...c, participant: participant };
  })
);
</script>

<template>
  <q-item v-if="pending" clickable v-ripple>
    <q-item-section class="q-gutter-xs text-muted">
      <SkeletonBase type="list" v-for="i in 5" />
    </q-item-section>
  </q-item>
  <template v-else v-for="c in filteredData" :key="c.id">
    <q-item clickable v-ripple @click="emit('selected', c)">
      <q-item-section class="q-gutter-xs text-muted">
        <q-item-lebel class="gap-100 row items-center justify-between">
          <q-avatar>
            <q-img
              :src="
                getImageUrl(
                  c.participant[0]?.user?.profile?.avatar?.url ||
                    c.participant[0]?.adminUser?.profile?.avatar?.url ||
                    c.participant[0]?.vendorUser?.profile?.avatar?.url,
                  '/images/sample-dp.png'
                )
              "
            />
          </q-avatar>
          <p style="flex-grow: 1">
            {{
              c.participant[0]?.adminUser?.first_name ||
              c.participant[0]?.user?.first_name ||
              c.participant[0]?.vendorUser?.first_name
            }}
          </p>
          <p>
            <ClientOnly>
              <timeago
                v-if="c.messages[0]"
                :datetime="c.messages[0]?.created_at || null"
              />
            </ClientOnly>
          </p>
        </q-item-lebel>
        <q-item-lebel
          v-if="c.messages[0]"
          caption
          class="text-muted ellipsis-2-lines"
          >{{ c.messages[0].body }}</q-item-lebel
        >
        <q-item-lebel
          v-ielse
          caption
          class="text-muted ellipsis-2-lines text-nutral"
          >send hi <q-icon name="waving_hand" /> to
          {{
            c.participant[0]?.adminUser?.first_name ||
            c.participant[0]?.user?.first_name ||
            c.participant[0]?.vendorUser?.first_name
          }}</q-item-lebel
        >
      </q-item-section>
    </q-item>
    <q-separator />
  </template>
</template>
