<script setup lang="ts">
const auth = authStore();
const user = useCookie("user") as Ref<IUser> | null;
const getImageUrl = useGetImageUrl();

const logout = () => {
  auth.logout("customer", () => {
    const user = useCookie("user", {
      maxAge: 60 * 60 * 24,
    });

    const token = useCookie("token", {
      maxAge: 60 * 60 * 24,
    });

    const socketToken = useCookie("socketToken");

    user.value = null;
    token.value = null;
    socketToken.value = null;

    createFetch({
      headers: {
        authorization: "",
      },
    });
    navigateTo(routes.home);
  });
};

const confirmLogout = () => {
  if (confirm("Are you sure you want to logout?")) {
    logout();
  }
};
</script>

<template>
  <q-btn round flat class="btn-grey">
    <q-avatar size="36px">
      <img :src="getImageUrl(user?.profile?.avatar?.url, '/images/sample-dp.png')" />
    </q-avatar>

    <q-menu anchor="bottom left" style="border-radius: 10px">
      <q-list dense style="min-width: 180px" class="">
        <q-item clickable v-close-popup :to="routes.account">
          <q-item-section avatar><q-icon name="manage_accounts" color="primary"></q-icon></q-item-section>
          <q-item-section> My Account </q-item-section>
        </q-item>
        <q-separator inset />
        <q-item clickable v-close-popup @click="confirmLogout">
          <q-item-section avatar><q-icon name="logout" color="primary"></q-icon></q-item-section>
          <q-item-section>Sign Out</q-item-section>
        </q-item>

        <!-- <q-separator /> -->
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
