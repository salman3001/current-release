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
    <q-layout view="hHh LpR lFf">
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
        <!-- <q-toolbar
          v-if="$q.screen.gt.xs"
          class="bg-white text-black"
          style="border: 1px solid rgba(0, 0, 0, 0.106)"
        >
          <div>
            <NavMenu title="Services">
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink
                    :to="''"
                    class="text-black"
                    style="text-decoration: none"
                    >Admin Users</NuxtLink
                  >
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section>
                  <NuxtLink
                    :to="''"
                    class="text-black"
                    style="text-decoration: none"
                    >Roles</NuxtLink
                  >
                </q-item-section>
              </q-item>
            </NavMenu>
            <NavMenu title="Help Center">
              <q-item style="padding: 0">
                <q-item-section style="padding: 0">
                  <q-btn
                    class="text-black"
                    label="Knowledgebase"
                    unelevated
                    icon-right="chevron_right"
                    style="width: 100%; text-transform: none"
                  >
                    <q-menu
                      anchor="center right"
                      style="border-radius: 14px; border-top: 4px solid black"
                    >
                      <q-list style="min-width: 100px" dense>
                        <q-item clickable v-close-popup>
                          <q-item-section>
                            <NuxtLink
                              :to="''"
                              class="text-black"
                              style="text-decoration: none"
                              >Content</NuxtLink
                            >
                          </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>
                            <NuxtLink
                              :to="''"
                              class="text-black"
                              style="text-decoration: none"
                              >Categories</NuxtLink
                            >
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink
                    :to="''"
                    class="text-black"
                    style="text-decoration: none"
                    >Support ticket</NuxtLink
                  >
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink
                    :to="''"
                    class="text-black"
                    style="text-decoration: none"
                    >Contact Messages</NuxtLink
                  >
                </q-item-section>
              </q-item>
            </NavMenu>
            <NavMenu title="Blogs" v-if="''">
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink
                    :to="''"
                    class="text-black"
                    style="text-decoration: none"
                    >Blog Posts</NuxtLink
                  >
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink
                    :to="''"
                    class="text-black"
                    style="text-decoration: none"
                    >Blog Categories</NuxtLink
                  >
                </q-item-section>
              </q-item>
            </NavMenu>
            <NuxtLink
              v-if="''"
              class="text-black"
              style="
                text-decoration: none;
                text-transform: uppercase;
                font-weight: 500;
              "
            >
              <q-btn flat> Users </q-btn>
            </NuxtLink>
          </div>
        </q-toolbar> -->
      </q-header>

      <q-drawer
        show-if-above
        bordered
        v-model="leftDrawerOpen"
        side="left"
        :width="250"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding dense>
            <q-item
              clickable
              v-ripple
              :to="routes.vendor.dashboard"
              :class="
                route.path === routes.vendor.dashboard
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item-section avatar>
                <q-icon name="dashboard_customize" />
              </q-item-section>

              <q-item-section> Dashboard </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :to="routes.vendor.services.list"
              :class="
                route.path === routes.vendor.services.list
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item-section avatar>
                <q-icon name="cleaning_services" />
              </q-item-section>

              <q-item-section>My Services</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :to="routes.vendor.service_requirements.list"
              :class="
                route.path === routes.vendor.service_requirements.list
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item-section avatar>
                <q-icon name="list" />
              </q-item-section>

              <q-item-section>Service Requirements</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :to="routes.vendor.bookings.list"
              :class="
                route.path === routes.vendor.bookings.list
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item-section avatar>
                <q-icon name="rss_feed" />
              </q-item-section>
              <q-item-section> Manage Bookings </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :to="routes.vendor.coupons.list"
              :class="
                route.path === routes.vendor.coupons.list
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item-section avatar>
                <q-icon name="rss_feed" />
              </q-item-section>
              <q-item-section> Discount Coupons </q-item-section>
            </q-item>

            <q-item
              clickable
              v-ripple
              :to="routes.vendor.chat"
              :class="
                route.path === routes.vendor.chat
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item-section avatar>
                <q-icon name="mail" />
              </q-item-section>
              <q-item-section> Messages</q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              :to="routes.vendor.account"
              :class="
                route.path === routes.vendor.account
                  ? 'text-primary'
                  : 'text-muted'
              "
            >
              <q-item-section avatar>
                <q-icon name="account_circle" />
              </q-item-section>
              <q-item-section> Account</q-item-section>
            </q-item>

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
