<script setup lang="ts">
import EditPersonalInfo from 'src/components/admin/user/editUserForm/EditPersonalInfo.vue'
import EditSocialInfo from 'src/components/admin/user/editUserForm/EditSocialInfo.vue'
import EditAddressInfo from 'src/components/admin/user/editUserForm/EditAddressInfo.vue'
import EditFavoriteLinkInfo from 'src/components/admin/user/editUserForm/EditFavoriteLinkInfo.vue'
import EditExperienceInfo from 'src/components/admin/user/editUserForm/EditExperienceInfo.vue'
import EditLanguageInfo from 'src/components/admin/user/editUserForm/EditLanguageInfo.vue'
import { onBeforeMount, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import editUserStore from 'src/stores/editUserStore'
import EditSkillsInfo from 'src/components/admin/user/editUserForm/EditSkillsInfo.vue'
import EditPrivacyInfo from 'src/components/admin/user/editUserForm/EditPrivacyInfo.vue'
import EditNotificationInfo from 'src/components/admin/user/editUserForm/EditNotificationInfo.vue'
import EditPasswordInfo from 'src/components/admin/user/editUserForm/EditPasswordInfo.vue'


const router = useRouter();
const route = useRoute();
const tab = ref('personal')
const editUser = editUserStore()

onBeforeMount(async () => {
  await editUser.getInitialValues(route.params.id as string)
})
</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="row items-center q-gutter-sm">
        <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
          router.push({ name: 'admin.user.index' });
        }
          " />
        <span class="text-h6"> Edit User </span>
      </div>
      <q-card flat>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="start"
          narrow-indicator>
          <q-tab name="personal" label="Personal" />
          <q-tab name="address" label="Address" />
          <q-tab name="social" label="Social Links" />
          <q-tab name="favoritLinks" label="Favorite Links" />
          <q-tab name="experience" label="Experience" />
          <q-tab name="language" label="Language" />
          <q-tab name="skill" label="Skills" />
          <q-tab name="privacy" label="Privacy" />
          <q-tab name="notifications" label="Notifications" />
          <q-tab name="passwword" label="Reset Password" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="personal">
            <div class="text-h6">Edit Personal Information</div>
            <EditPersonalInfo />
          </q-tab-panel>

          <q-tab-panel name="address">
            <div class="text-h6">Edit Address</div>
            <EditAddressInfo />
          </q-tab-panel>

          <q-tab-panel name="social">
            <div class="text-h6">Edit Social Links</div>
            <EditSocialInfo />
          </q-tab-panel>

          <q-tab-panel name="favoritLinks">
            <div class="text-h6">Edit Favorite Links</div>
            <EditFavoriteLinkInfo />
          </q-tab-panel>
          <q-tab-panel name="experience">
            <div class="text-h6">Edit Work Experience</div>
            <EditExperienceInfo />
          </q-tab-panel>
          <q-tab-panel name="language">
            <div class="text-h6">Edit Languages</div>
            <EditLanguageInfo />
          </q-tab-panel>
          <q-tab-panel name="skill">
            <div class="text-h6">Edit Skills</div>
            <EditSkillsInfo />
          </q-tab-panel>
          <q-tab-panel name="privacy">
            <div class="text-h6">Edit Privacy</div>
            <EditPrivacyInfo />
          </q-tab-panel>
          <q-tab-panel name="notifications">
            <div class="text-h6">Edit Notifications</div>
            <EditNotificationInfo />
          </q-tab-panel>
          <q-tab-panel name="passwword">
            <div class="text-h6">Reset Password</div>
            <EditPasswordInfo />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>
