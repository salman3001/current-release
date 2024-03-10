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
  <ScrollArea height="100vh" width="100%">
    <q-layout view="hHh lpR lFf">
      <q-header bordered reveal class="text-white" :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'">
        <q-toolbar class="q-py-sm q-py-sm-md">
          <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" class="text-primary lt-sm" />
          <div>
            <BrandLogo :to="routes.home" size="170px"></BrandLogo>
          </div>
          <div class="row q-gutter-sm justify-end items-center"
            :style="{ flexGrow: $q.screen.gt.xs ? 3 : 1, width: 'min-xontent' }">
            <div class="gt-sm col-0 col-sm-1"></div>
            <div class="gt-sm col row justify-center">
              <WebServiceSearch />
            </div>
            <div class="gt-sm col-0 col-sm-1"></div>

            <WebNotificationMenu v-if="user" />
            <NuxtLink :to="routes.auth.login">
              <q-btn color="primary" v-if="!user">Login</q-btn>
            </NuxtLink>
          </div>
        </q-toolbar>
        <q-toolbar class="lt-md q-pb-sm">
          <WebServiceSearch style="flex-grow: 1" />
        </q-toolbar>
      </q-header>

      <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered :mini="miniState"
        @mouseover="miniState = false" @mouseout="miniState = true" :width="250" :breakpoint="500">
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <div v-if="user">
              <NuxtLink :to="routes.account" :class="route.path === routes.account ? 'text-primary' : 'text-muted'
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
              <q-item clickable v-ripple @click="confirmLogout" class="text-muted">
                <q-item-section avatar>
                  <q-icon name="logout" />
                </q-item-section>

                <q-item-section> Logout </q-item-section>
              </q-item>
              <q-separator />
            </div>

            <NuxtLink :to="routes.home" :class="route.path === routes.home ? 'text-primary' : 'text-muted'
        ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="home" />
                </q-item-section>

                <q-item-section> Home </q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink :to="routes.services" :class="route.path === routes.services ? 'text-primary' : 'text-muted'
        ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="electrical_services" />
                </q-item-section>

                <q-item-section> Services </q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink :to="routes.service_requirement" :class="route.path === routes.service_requirement
        ? 'text-primary'
        : 'text-muted'
        ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="dashboard_customize" />
                </q-item-section>

                <q-item-section>Customize Services</q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink :to="routes.blogs" :class="route.path === routes.blogs ? 'text-primary' : 'text-muted'
        ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="rss_feed" />
                </q-item-section>
                <q-item-section> View Blogs </q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink :to="routes.about" :class="route.path === routes.about ? 'text-primary' : 'text-muted'
        ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="info" />
                </q-item-section>

                <q-item-section> About Us </q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink :to="routes.contact" :class="route.path === routes.contact ? 'text-primary' : 'text-muted'
        ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="support_agent" />
                </q-item-section>
                <q-item-section> Contact </q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink :to="routes.faqs" :class="route.path === routes.faqs ? 'text-primary' : 'text-muted'
        ">
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="help" />
                </q-item-section>
                <q-item-section> FAQs </q-item-section>
              </q-item>
            </NuxtLink>
            <q-item clickable v-ripple @click="$q.dark.toggle()">
              <q-item-section avatar>
                <q-icon name="light_mode" :color="$q.dark.isActive ? 'muted' : 'primary'" />
              </q-item-section>
              <q-item-section> Dark Mode </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
        <!-- drawer content -->
      </q-drawer>

      <!-- <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
      <WebCategoryList />
    </q-drawer> -->

      <q-page-container>
        <slot />
        <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[18, 18]">
          <q-btn fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller>
      </q-page-container>
    </q-layout>
  </ScrollArea>
  <ModalBase />
</template>
