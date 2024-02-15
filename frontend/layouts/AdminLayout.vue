<script setup lang="ts">
import { ref } from 'vue';

// import NavMenu from 'components/NavMenu.vue';
// import BaseModal from 'components/modal/BaseModal.vue';
import { permissions } from '@/utils/enums';

const { hasPermission } = useAuth()


const leftDrawerOpen = ref(false);
function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}

const auth = authStore()
</script>

<template>
  <ClientOnly>
    <q-layout view="lHh Lpr lFf">
      <q-header>
        <q-toolbar class="bg-white text-black" style="border: 1px solid rgba(0, 0, 0, 0.106)">
          <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

          <q-toolbar-title>
            <BrandLogo />
          </q-toolbar-title>
          <div class="row q-gutter-sm">
            <div class="gt-sm">
              <FormsSearchInput />
            </div>
            <!-- <NotificationMenu /> -->
            <ProfileMenu />
          </div>
        </q-toolbar>
        <q-toolbar v-if="$q.screen.gt.xs" class="bg-white text-black" style="border: 1px solid rgba(0, 0, 0, 0.106)">
          <div>
            <NavMenu title="Admin Users"
              v-if="hasPermission(permissions.MANAGE_ADMIN_USERS) || hasPermission(permissions.MANAGE_ROLES)">
              <q-item clickable v-close-popup v-if="hasPermission(permissions.MANAGE_ADMIN_USERS)">
                <q-item-section>
                  <NuxtLink :to="routes.admin.admin_users" class="text-black" style="text-decoration: none">Admin Users
                  </NuxtLink>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="hasPermission(permissions.MANAGE_ROLES)">
                <q-item-section>
                  <NuxtLink :to="routes.admin.roles" class="text-black" style="text-decoration: none">Roles</NuxtLink>
                </q-item-section>
              </q-item>
            </NavMenu>
            <NavMenu title="Help Center"
              v-if="hasPermission(permissions.MANAGE_CONTACT_MESSAGES) || hasPermission(permissions.MANAGE_KNOWLEDGEBASE) || hasPermission(permissions.MANAGE_TICKETS)">
              <q-item style="padding: 0">
                <q-item-section style="padding: 0">
                  <q-btn class="text-black" label="Knowledgebase" unelevated icon-right="chevron_right"
                    style="width: 100%; text-transform: none">
                    <q-menu anchor="center right" style="border-radius: 14px; border-top: 4px solid black"
                      v-if="hasPermission(permissions.MANAGE_KNOWLEDGEBASE)">
                      <q-list style="min-width: 100px" dense>
                        <q-item clickable v-close-popup>
                          <q-item-section>
                            <NuxtLink :to="routes.admin.knowlegdebase.content" class="text-black"
                              style="text-decoration: none">Content</NuxtLink>
                          </q-item-section>
                        </q-item>
                        <q-item clickable v-close-popup>
                          <q-item-section>
                            <NuxtLink :to="routes.admin.knowlegdebase.category" class="text-black"
                              style="text-decoration: none">Categories</NuxtLink>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="hasPermission(permissions.MANAGE_TICKETS)">
                <q-item-section>
                  <NuxtLink :to="routes.admin.help_center.support_ticket" class="text-black"
                    style="text-decoration: none">Support ticket</NuxtLink>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="hasPermission(permissions.MANAGE_CONTACT_MESSAGES)">
                <q-item-section>
                  <NuxtLink :to="routes.admin.help_center.contact_message" class="text-black"
                    style="text-decoration: none">Contact Messages</NuxtLink>
                </q-item-section>
              </q-item>
            </NavMenu>
            <NavMenu title="Blogs" v-if="hasPermission(permissions.MANAGE_BLOGS)">
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink :to="routes.admin.blogs.posts" class="text-black" style="text-decoration: none">Blog Posts
                  </NuxtLink>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink :to="routes.admin.blogs.category" class="text-black" style="text-decoration: none">Blog
                    Categories</NuxtLink>
                </q-item-section>
              </q-item>
            </NavMenu>
            <NavMenu title="Location" v-if="hasPermission(permissions.MANAGE_LOCATION)">
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink :to="routes.admin.location.continents" class="text-black" style="text-decoration: none">
                    Continents</NuxtLink>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink :to="routes.admin.location.countries" class="text-black" style="text-decoration: none">
                    Countries</NuxtLink>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink :to="routes.admin.location.states" class="text-black" style="text-decoration: none">States
                  </NuxtLink>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink :to="routes.admin.location.cities" class="text-black" style="text-decoration: none">Cities
                  </NuxtLink>
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section>
                  <NuxtLink :to="routes.admin.location.streets" class="text-black" style="text-decoration: none">Street
                  </NuxtLink>
                </q-item-section>
              </q-item>
            </NavMenu>
            <!--        <NuxtLink v-if="hasPermission(permissions.MANAGE_USER)" :to="{
            name: 'admin.user.index',
          }" class="text-black" style="text-decoration: none;text-transform: uppercase; font-weight: 500;">

            <q-btn flat>

              Users
            </q-btn>
          </NuxtLink>
          <NavMenu title="Products" v-if="hasPermission(permissions.MANAGE_PRODUCT)">
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.product.index',
                }" class="text-black" style="text-decoration: none">Product List</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.productCategory.index',
                }" class="text-black" style="text-decoration: none">Product Category</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.productSubcategory.index',
                }" class="text-black" style="text-decoration: none">Product Subcategory</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.productTag.index',
                }" class="text-black" style="text-decoration: none">Product Tags</NuxtLink>
              </q-item-section>
            </q-item>
          </NavMenu>
          <NavMenu title="Services" v-if="hasPermission(permissions.MANAGE_SERVICE)">
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.service.index',
                }" class="text-black" style="text-decoration: none">Service List</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.serviceCategory.index',
                }" class="text-black" style="text-decoration: none">Service Category</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.serviceSubcategory.index',
                }" class="text-black" style="text-decoration: none">Service Subcategory</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.serviceTag.index',
                }" class="text-black" style="text-decoration: none">Service Tags</NuxtLink>
              </q-item-section>
            </q-item>
          </NavMenu>
          <NavMenu title="News Letters"
            v-if="hasPermission(permissions.MANAGE_SUBSCRIBERS) || hasPermission(permissions.MANAGE_TEMPLATES) || hasPermission(permissions.MANAGE_CAMPAIGNS)">
            <q-item clickable v-close-popup v-if="hasPermission(permissions.MANAGE_SUBSCRIBERS)">
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.subscriber.index',
                }" class="text-black" style="text-decoration: none">Subscribers</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup v-if="hasPermission(permissions.MANAGE_TEMPLATES)">
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.template.index',
                }" class="text-black" style="text-decoration: none">Templates</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup v-if="hasPermission(permissions.MANAGE_CAMPAIGNS)">
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.campaign.index',
                }" class="text-black" style="text-decoration: none">Campaigns</NuxtLink>
              </q-item-section>
            </q-item>
          </NavMenu>
          <NavMenu title="Media" v-if="hasPermission(permissions.MANAGE_MEDIA)">
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.media.images',
                }" class="text-black" style="text-decoration: none">Images</NuxtLink>
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <NuxtLink :to="{
                  name: 'admin.media.videos',
                }" class="text-black" style="text-decoration: none">Videos</NuxtLink>
              </q-item-section>
            </q-item>
          </NavMenu> -->
          </div>
        </q-toolbar>
      </q-header>

      <q-drawer :behavior="'mobile'" v-model="leftDrawerOpen" show-if-above bordered>
        <AdminSideMenu />
      </q-drawer>

      <q-page-container>
        <slot />
      </q-page-container>
    <ModalBase />
  </q-layout>
</ClientOnly></template>
