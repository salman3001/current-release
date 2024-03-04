<script setup lang="ts">
import { ref } from "vue";

const user = useCookie("user");
const config = useRuntimeConfig();
const auth = authStore();
const route = useRoute();

const leftDrawerOpen = ref(false);
const rightDrawerOpen = ref(false);
const miniState = ref(true);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

function toggleRightDrawer() {
  rightDrawerOpen.value = !rightDrawerOpen.value;
}

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
      baseURL: config.public.baseApi,
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
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-white q-py-xs" style="border-bottom: 1px solid lightgray">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" class="text-primary lt-sm" />
        <q-toolbar-title>
          <BrandLogo :to="routes.home" size="170px"></BrandLogo>
        </q-toolbar-title>
        <div class="row q-gutter-sm justify-center items-center">
          <div class="gt-xs" style="min-width: 300px">
            <FormsSearchInput />
          </div>
          <NuxtLink :to="routes.cart">
            <q-btn round icon="shopping_cart" outline class="text-black" unelevated color="green-10">
              <q-badge floating rounded color="red">2</q-badge>

            </q-btn>
          </NuxtLink>
          <WebNotificationMenu v-if="user" />
          <NuxtLink :to="routes.auth.login">
            <q-btn color="primary" v-if="!user">Login</q-btn>
          </NuxtLink>
        </div>
        <q-btn dense flat round icon="menu" @click="toggleRightDrawer" class="text-primary lt-md" />
      </q-toolbar>
      <q-toolbar class="lt-sm">
        <FormsSearchInput class="full-width" />
      </q-toolbar>
    </q-header>

    <q-drawer mini-to-overlay show-if-above v-model="leftDrawerOpen" side="left" bordered :mini="miniState"
      @mouseover="miniState = false" @mouseout="miniState = true" :width="200" :breakpoint="500">
      <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
        <q-list padding>
          <div v-if="user">

            <NuxtLink :to="routes.account" :class="route.path === routes.account ? 'text-primary' : 'text-black'
          ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon :name="`img:${user && user?.avatar?.url
          ? $config.public.baseApi + user?.avatar?.url
          : '/images/sample-dp.png'
          }`" />
                </q-item-section>

                <q-item-section> Account </q-item-section>
              </q-item>
            </NuxtLink>
            <q-item clickable v-ripple @click="confirmLogout">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>

              <q-item-section> Logout </q-item-section>
            </q-item>
            <q-separator />
          </div>

          <NuxtLink :to="routes.home" :class="route.path === routes.home ? 'text-primary' : 'text-black'">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="home" />
              </q-item-section>

              <q-item-section> Home </q-item-section>
            </q-item>
          </NuxtLink>
          <NuxtLink :to="routes.blogs" :class="route.path === routes.blogs ? 'text-primary' : 'text-black'">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="rss_feed" />
              </q-item-section>
              <q-item-section> View Blogs </q-item-section>
            </q-item>
          </NuxtLink>
          <NuxtLink :to="routes.about" :class="route.path === routes.about ? 'text-primary' : 'text-black'">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="info" />
              </q-item-section>

              <q-item-section> About Us </q-item-section>
            </q-item>
          </NuxtLink>
          <NuxtLink :to="routes.contact" :class="route.path === routes.contact ? 'text-primary' : 'text-black'
          ">
            <q-item clickable v-ripple>
              <q-item-section avatar>
                <q-icon name="call" />
              </q-item-section>
              <q-item-section> Contact </q-item-section>
            </q-item>
          </NuxtLink>
        </q-list>
      </q-scroll-area>
      <!-- drawer content -->
    </q-drawer>

    <!-- <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <WebCategoryList />
    </q-drawer> -->

    <q-page-container :class="$q.screen.gt.xs ? 'bg-green-1' : ''" style="min-height: 100vh">
      <div :class="$q.screen.gt.xs ? 'q-ma-sm rounded-borders bg-white' : ''" style="min-height: 100vh">
        <slot />
      </div>
    </q-page-container>
  </q-layout>
</template>
