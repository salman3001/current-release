<script setup lang="ts">
import { ref } from 'vue';
import { permissions } from '@/utils/enums';


const tab = ref('home')
const auth = useAuth()


defineEmits(['close'])
</script>
<template>
  <q-card flat class="q-mt-lg">
    <div class="row justify-center">
      <BrandLogo />
    </div>


     <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="home" class="column q-py-xl q-gutter-md justify-end">
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_ADMIN_USERS)">
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.admin_users" class="text-black" style="text-decoration: none">Admin
                Users</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_ROLES)">
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.roles" class="text-black"
                style="text-decoration: none">Roles</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;"
            v-if="auth.hasPermission(permissions.MANAGE_CONTACT_MESSAGES) || auth.hasPermission(permissions.MANAGE_KNOWLEDGEBASE) || auth.hasPermission(permissions.MANAGE_TICKETS)"
            @click="() => {
              tab = 'help-center'
            }">
            <q-item-section>Help Center</q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;" v-if="auth.hasPermission(permissions.MANAGE_BLOGS)"
            @click="() => {
              tab = 'blogs'
            }">
            <q-item-section>Blogs</q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;" v-if="auth.hasPermission(permissions.MANAGE_LOCATION)"
            @click="() => {
              tab = 'location'
            }">
            <q-item-section>Location</q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;" v-if="auth.hasPermission(permissions.MANAGE_USER)">
            <q-item-section>
              <nuxt-link :to="routes.admin.users" class="text-black" style="text-decoration: none; ">Users</nuxt-link>

            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;" v-if="auth.hasPermission(permissions.MANAGE_PRODUCT)"
            @click="() => {
              tab = 'products'
            }">
            <q-item-section>Products</q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;" v-if="auth.hasPermission(permissions.MANAGE_SERVICE)"
            @click="() => {
              tab = 'services'
            }">
            <q-item-section>Services</q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;" v-if="auth.hasPermission(permissions.MANAGE_CAMPAIGNS)"
            @click="() => {
              tab = 'news-letters'
            }">
            <q-item-section>News Letters</q-item-section>
          </q-item>
          <q-item clickable v-close-popup style="text-align: end;" v-if="auth.hasPermission(permissions.MANAGE_MEDIA)"
            @click="() => {
              tab = 'media'
            }">
            <q-item-section>Media</q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="help-center" class="column q-py-xl q-gutter-md justify-end">
        <div class="row items-center justify-end q-gutter-sm q-px-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            tab = 'home'
          }
            " />
        </div>
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.knowlegdebase.content" class="text-black" style="text-decoration: none">Knowledgebase Content</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.knowlegdebase.category" class="text-black" style="text-decoration: none">Knowledgebase Categories</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_TICKETS)">
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.help_center.support_ticket" class="text-black" style="text-decoration: none">Support tickets</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_CONTACT_MESSAGES)">
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.help_center.contact_message" class="text-black" style="text-decoration: none">Contact Messages</nuxt-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>
      <q-tab-panel name="blogs" class="column q-py-xl q-gutter-md justify-end">
        <div class="row items-center justify-end q-gutter-sm q-px-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            tab = 'home'
          }
            " />
        </div>
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.blogs.posts" class="text-black" style="text-decoration: none">Blog Posts</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.blogs.category" class="text-black" style="text-decoration: none">Blog Categories</nuxt-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>


      <q-tab-panel name="location" class="column q-py-xl q-gutter-md justify-end">
        <div class="row items-center justify-end q-gutter-sm q-px-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            tab = 'home'
          }
            " />
        </div>
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.location.continents" class="text-black" style="text-decoration: none">Continents</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.location.countries" class="text-black" style="text-decoration: none">Countries</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.location.states" class="text-black" style="text-decoration: none">States</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.location.cities" class="text-black" style="text-decoration: none">Cities</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.location.streets" class="text-black" style="text-decoration: none">Street</nuxt-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>


      <q-tab-panel name="products" class="column q-py-xl q-gutter-md justify-end">
        <div class="row items-center justify-end q-gutter-sm q-px-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            tab = 'home'
          }
            " />
        </div>
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.product.index" class="text-black" style="text-decoration: none">Product List</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.product.category.index" class="text-black" style="text-decoration: none">Product Category</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.product.sub_category.index" class="text-black" style="text-decoration: none">Product Subcategory</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.product.tag.index" class="text-black" style="text-decoration: none">Product Tags</nuxt-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="services" class="column q-py-xl q-gutter-md justify-end">
        <div class="row items-center justify-end q-gutter-sm q-px-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            tab = 'home'
          }
            " />
        </div>
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.service.index" class="text-black" style="text-decoration: none">Service List</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.service.category.index" class="text-black" style="text-decoration: none">Service Category</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.service.sub_category.index" class="text-black" style="text-decoration: none">Service Subcategory</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.service.tag.index" class="text-black" style="text-decoration: none">Service Tags</nuxt-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>


      <q-tab-panel name="news-letters" class="column q-py-xl q-gutter-md justify-end">
        <div class="row items-center justify-end q-gutter-sm q-px-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            tab = 'home'
          }
            " />
        </div>
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_SUBSCRIBERS)">
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.subscribers.index" class="text-black" style="text-decoration: none">Subscribers</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_TEMPLATES)">
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.templates.index" class="text-black" style="text-decoration: none">Templates</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_CAMPAIGNS)">
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.campaigns.index" class="text-black" style="text-decoration: none">Campaigns</nuxt-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>


      <q-tab-panel name="media" class="column q-py-xl q-gutter-md justify-end">
        <div class="row items-center justify-end q-gutter-sm q-px-md">
          <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
            tab = 'home'
          }
            " />
        </div>
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.media.images" class="text-black" style="text-decoration: none">Images</nuxt-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <nuxt-link :to="routes.admin.media.videos" class="text-black" style="text-decoration: none">Videos</nuxt-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <!-- <q-tab-panel name="password">
        <div class="text-h6">Edit Password</div>
        <AdminUserEditUserFormEditPasswordInfo/>
      </q-tab-panel> -->
    </q-tab-panels> 
  </q-card>
</template>
