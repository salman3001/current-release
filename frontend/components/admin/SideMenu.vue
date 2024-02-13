<script setup lang="ts">
import { ref } from 'vue';
import { permissions } from '@/utils/enums';


const tab = ref('home')

const auth = authStore()

defineEmits(['close'])
</script>
<template>
  <q-card flat class="q-mt-lg">
    <div class="row justify-center">
      <BrandLogo />
    </div>


    <!-- <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="home" class="column q-py-xl q-gutter-md justify-end">
        <q-list dense style="font-size: 20px;font-weight: 400;" class="">
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_ADMIN_USERS)">
            <q-item-section style="text-align: end;">
              <router-link :to="{ name: 'admin.adminUsers.index' }" class="text-black" style="text-decoration: none">Admin
                Users</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_ROLES)">
            <q-item-section style="text-align: end;">
              <router-link :to="{ name: 'admin.roles.index' }" class="text-black"
                style="text-decoration: none">Roles</router-link>
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
              <router-link :to="{
                name: 'admin.user.index',
              }" class="text-black" style="text-decoration: none; ">Users</router-link>

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
              <router-link :to="{
                name: 'admin.knowlegebase.content.index',
              }" class="text-black" style="text-decoration: none">Knowledgebase Content</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.knowlegebase.category.index',
              }" class="text-black" style="text-decoration: none">Knowledgebase Categories</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_TICKETS)">
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.supportTicket.index',
              }" class="text-black" style="text-decoration: none">Support tickets</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_CONTACT_MESSAGES)">
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.contactMessage.index',
              }" class="text-black" style="text-decoration: none">Contact Messages</router-link>
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
              <router-link :to="{
                name: 'admin.blogs.index',
              }" class="text-black" style="text-decoration: none">Blog Posts</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.blogs.category.index',
              }" class="text-black" style="text-decoration: none">Blog Categories</router-link>
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
              <router-link :to="{
                name: 'admin.location.continent.index',
              }" class="text-black" style="text-decoration: none">Continents</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.location.country.index',
              }" class="text-black" style="text-decoration: none">Countries</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.location.state.index',
              }" class="text-black" style="text-decoration: none">States</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.location.city.index',
              }" class="text-black" style="text-decoration: none">Cities</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.location.street.index',
              }" class="text-black" style="text-decoration: none">Street</router-link>
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
              <router-link :to="{
                name: 'admin.product.index',
              }" class="text-black" style="text-decoration: none">Product List</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.productCategory.index',
              }" class="text-black" style="text-decoration: none">Product Category</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.productSubcategory.index',
              }" class="text-black" style="text-decoration: none">Product Subcategory</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.productTag.index',
              }" class="text-black" style="text-decoration: none">Product Tags</router-link>
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
              <router-link :to="{
                name: 'admin.service.index',
              }" class="text-black" style="text-decoration: none">Service List</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.serviceCategory.index',
              }" class="text-black" style="text-decoration: none">Service Category</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.serviceSubcategory.index',
              }" class="text-black" style="text-decoration: none">Service Subcategory</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.serviceTag.index',
              }" class="text-black" style="text-decoration: none">Service Tags</router-link>
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
              <router-link :to="{
                name: 'admin.subscriber.index',
              }" class="text-black" style="text-decoration: none">Subscribers</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_TEMPLATES)">
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.template.index',
              }" class="text-black" style="text-decoration: none">Templates</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup v-if="auth.hasPermission(permissions.MANAGE_CAMPAIGNS)">
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.campaign.index',
              }" class="text-black" style="text-decoration: none">Campaigns</router-link>
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
              <router-link :to="{
                name: 'admin.media.images',
              }" class="text-black" style="text-decoration: none">Images</router-link>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup>
            <q-item-section style="text-align: end;">
              <router-link :to="{
                name: 'admin.media.videos',
              }" class="text-black" style="text-decoration: none">Videos</router-link>
            </q-item-section>
          </q-item>
        </q-list>
      </q-tab-panel>

      <q-tab-panel name="password">
        <div class="text-h6">Edit Password</div>
        <EditPasswordInfo />
      </q-tab-panel>
    </q-tab-panels> -->
  </q-card>
</template>
