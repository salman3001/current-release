<script setup lang="ts">
import { ref } from "vue";

const user = useCookie("user") as Ref<IUser> | null;
const route = useRoute();

const leftDrawerOpen = ref(true);
// const rightDrawerOpen = ref(false);
const miniState = ref(true);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

// function toggleRightDrawer() {
//   rightDrawerOpen.value = !rightDrawerOpen.value;
// }
</script>

<template>
  <ScrollArea height="100vh" width="100%">
    <q-layout view="hHh lpR lFf">
      <q-header
        bordered
        reveal
        class="text-white"
        :class="$q.dark.isActive ? 'bg-dark' : 'bg-white'"
      >
        <q-toolbar class="q-py-sm q-py-sm-md">
          <q-btn
            dense
            flat
            round
            icon="menu"
            @click="toggleLeftDrawer"
            class="text-primary lt-md"
          />
          <div>
            <BrandLogo :to="routes.vendor.dashboard" size="170px"></BrandLogo>
          </div>
          <div
            class="row q-gutter-sm justify-end items-center"
            :style="{ flexGrow: $q.screen.gt.xs ? 3 : 1, width: 'min-xontent' }"
          >
            <div class="gt-sm col-0 col-sm-1"></div>

            <VendorNotificationMenu v-if="user" />
            <!-- <NuxtLink :to="routes.chats">
              <q-btn round flat class="btn-grey">
                <q-icon name="mail" color="nutral"> </q-icon>
              </q-btn>
            </NuxtLink> -->
            <VendorProfileMenu v-if="user" />
            <NuxtLink :to="routes.auth.login">
              <q-btn color="primary" v-if="!user">Login</q-btn>
            </NuxtLink>
          </div>
        </q-toolbar>
        <q-toolbar class="lt-md q-pb-sm">
          <WebServiceSearch
            :initail-value="route.query?.whereILike as string"
            @search="
              (v) => {
                if (v !== '') {
                  navigateTo({
                    path: routes.home,
                    query: {
                      ...route.query,
                      whereILike: `%${v}%`,
                    },
                  });
                } else {
                  navigateTo({
                    path: routes.home,
                    query: {
                      whereILike: '',
                    },
                  });
                }
              }
            "
            style="flex-grow: 1"
          />
        </q-toolbar>
      </q-header>

      <q-drawer
        show-if-above
        bordered
        v-model="leftDrawerOpen"
        side="left"
        :width="250"
        :breakpoint="500"
        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding>
            <NuxtLink
              :to="routes.vendor.dashboard"
              :class="
                route.path === routes.home ? 'text-primary' : 'text-muted'
              "
            >
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="dashboard_customize" />
                </q-item-section>

                <q-item-section> Dashboard </q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink
              :to="routes.vendor.service_requirements.list"
              :class="
                route.path === routes.service_requirement
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="list" />
                </q-item-section>

                <q-item-section>Service Requirements</q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink
              :to="routes.vendor.bookings.list"
              :class="
                route.path === routes.blogs ? 'text-primary' : 'text-muted'
              "
            >
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="rss_feed" />
                </q-item-section>
                <q-item-section> Manage Bookings </q-item-section>
              </q-item>
            </NuxtLink>

            <NuxtLink
              :to="routes.vendor.chat"
              :class="
                route.path === routes.blogs ? 'text-primary' : 'text-muted'
              "
            >
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="mail" />
                </q-item-section>
                <q-item-section> Messages</q-item-section>
              </q-item>
            </NuxtLink>
            <NuxtLink
              :to="routes.vendor.account"
              :class="
                route.path === routes.blogs ? 'text-primary' : 'text-muted'
              "
            >
              <q-item clickable v-ripple>
                <q-item-section avatar>
                  <q-icon name="account_circle" />
                </q-item-section>
                <q-item-section> Account</q-item-section>
              </q-item>
            </NuxtLink>

            <q-item clickable v-ripple @click="$q.dark.toggle()">
              <q-item-section avatar>
                <q-icon
                  name="light_mode"
                  :color="$q.dark.isActive ? 'muted' : 'primary'"
                />
              </q-item-section>
              <q-item-section> Dark Mode </q-item-section>
            </q-item>
          </q-list>
        </q-scroll-area>
      </q-drawer>
      <!-- 
      <q-drawer show-if-above v-model="rightDrawerOpen" side="right" bordered>
        <WebCategoryList />
      </q-drawer> -->

      <q-page-container class="justify-center row">
        <div
          style="max-width: 1920px; width: 100%; overflow: hidden"
          class="q-px-sm q-px-sm-md q-px-md-lg q-px-lg-xl"
        >
          <slot />
        </div>
        <q-page-scroller
          position="bottom-right"
          :scroll-offset="150"
          :offset="[18, 18]"
        >
          <q-btn fab icon="keyboard_arrow_up" color="primary" />
        </q-page-scroller>
      </q-page-container>
    </q-layout>
  </ScrollArea>
  <ModalBase />
</template>
