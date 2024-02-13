<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ofetch } from 'ofetch'


const auth = authStore()
const { user } = useAuth()
const upload = ref('')


const logout = () => {
  auth.adminLogout(() => {
    const user = useCookie('user', {
      maxAge: 60 * 60 * 24
    })

    const token = useCookie('token', {
      maxAge: 60 * 60 * 24
    })

    const socketToken = useCookie('socketToken')

    user.value = null
    token.value = null
    socketToken.value = null

    globalThis.$fetch = ofetch.create({
      headers: {
        authorization: '',
      },
    })
    navigateTo(routes.auth.admin_login)
  })
}

onMounted(() => {
  upload.value = process.env.UPLOAD as string;
})
</script>
<template>
  <q-btn round class="text-black" unelevated>
    <q-avatar size="36px">
      <img :src="user && user?.avatar?.url ? baseApiUrl + user?.avatar?.url : '/images/sample-dp.png'">
    </q-avatar>

    <q-menu anchor="bottom left">
      <q-list dense style="min-width: 100px">
        <q-item clickable v-close-popup>
          <q-item-section @click="logout">Sign Out</q-item-section>
        </q-item>
        <!-- <q-item clickable v-close-popup>
          <q-item-section>New incognito tab</q-item-section>
        </q-item>
        <q-separator /> -->
        <!-- <q-item clickable v-close-popup>
          <q-item-section>Recent tabs</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>History</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Downloads</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Settings</q-item-section>
        </q-item>
        <q-separator />
        <q-item clickable v-close-popup>
          <q-item-section>Help &amp; Feedback</q-item-section>
        </q-item> -->
      </q-list>
    </q-menu>
  </q-btn>
</template>
