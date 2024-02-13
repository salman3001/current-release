<script setup>
import notificationStore from 'src/stores/notificationStore'
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter()

const notify = notificationStore()

onMounted(() => {
  notify.getMenuNotifications();
  notify.connectSocket()
})

onUnmounted(() => {
  notify.disconnectSocket()
})
</script>
<template>
  <q-btn round icon="mail" class="text-black" unelevated>
    <q-badge floating rounded color="red">{{ notify.notificationCount }}</q-badge>
    <q-menu anchor="bottom left">


      <q-list dense style="min-width: 300px;font-size: small;">
        <q-item clickable v-close-popup v-for="(n, i)  in notify.notifcations" :key="i"
          :style="{ backgroundColor: n?.read_at ? 'none' : 'rgb(237, 233, 228)' }" class="q-my-xs" @click="() => {
            router.push({
              name: 'admin.notification.index'
            })
          }">
          <q-item-section>{{ n?.data?.message }} </q-item-section>
        </q-item>
        <q-separator />
      </q-list>
      <div class="justify-center row q-py-1 q-pt-sm" style="border-top: 1px solid lightgray;">
        <router-link :to="{ name: 'admin.notification.index' }" style="text-decoration: none;">
          <q-btn flat size="small" class="text-secondary">See All</q-btn>
        </router-link>
      </div>
    </q-menu>
  </q-btn>
</template>
