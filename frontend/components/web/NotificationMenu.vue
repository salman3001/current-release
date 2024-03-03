<script setup>

const user = useCookie('user')
const socketToken = useCookie('socketToken')
const config = useRuntimeConfig()

const notify = notificationStore()

onMounted(() => {
  notify.getMenuNotifications();
  notify.connectSocket(config.public.baseApi, user.value, socketToken.value)
})

onUnmounted(() => {
  notify.disconnectSocket()
})
</script>

<template>
  <q-btn round icon="mail" outline class="text-black" unelevated color="green-10">
    <q-badge floating rounded color="red">{{ notify.notificationCount }}</q-badge>
    <q-menu anchor="bottom left">


      <q-list dense style="min-width: 300px;font-size: small;">
        <q-item clickable v-close-popup v-for="(n, i)  in notify.notifcations" :key="i"
          :style="{ backgroundColor: n?.read_at ? 'none' : 'rgb(237, 233, 228)' }" class="q-my-xs" @click="() => {
      navigateTo(routes.admin.notifications)
    }">
          <q-item-section>{{ n?.data?.message }} </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
      <div class="justify-center row q-py-1 q-pt-sm" style="border-top: 1px solid lightgray;">
        <router-link :to="routes.admin.notifications" style="text-decoration: none;">
          <q-btn flat size="small" class="text-secondary">See All</q-btn>
        </router-link>
      </div>
    </q-menu>
  </q-btn>
</template>
