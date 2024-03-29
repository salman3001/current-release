<script setup lang="ts">


const route = useRoute();
const tab = ref('personal')
const editUser = editUserStore()

const { data } = await editUser.getInitialValues(route.params.id as string)

watch(data, () => {
  editUser.setInitialValues(data)
}, {
  deep: true,
  immediate: true
})

</script>

<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md">
      <div class="row items-center q-gutter-sm">
        <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
          navigateTo(routes.admin.users)
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
            <AdminUserEditUserFormEditPersonalInfo />
          </q-tab-panel>

          <q-tab-panel name="address">
            <div class="text-h6">Edit Address</div>
            <AdminUserEditUserFormEditAddressInfo />
          </q-tab-panel>

          <q-tab-panel name="social">
            <div class="text-h6">Edit Social Links</div>
            <AdminUserEditUserFormEditSocialInfo />
          </q-tab-panel>

          <q-tab-panel name="favoritLinks">
            <div class="text-h6">Edit Favorite Links</div>
            <AdminUserEditUserFormEditFavoriteLinkInfo />
          </q-tab-panel>
          <q-tab-panel name="experience">
            <div class="text-h6">Edit Work Experience</div>
            <AdminUserEditUserFormEditExperienceInfo />
          </q-tab-panel>
          <q-tab-panel name="language">
            <div class="text-h6">Edit Languages</div>
            <AdminUserEditUserFormEditLanguageInfo />
          </q-tab-panel>
          <q-tab-panel name="skill">
            <div class="text-h6">Edit Skills</div>
            <AdminUserEditUserFormEditSkillsInfo />
          </q-tab-panel>
          <q-tab-panel name="privacy">
            <div class="text-h6">Edit Privacy</div>
            <AdminUserEditUserFormEditPrivacyInfo />
          </q-tab-panel>
          <q-tab-panel name="notifications">
            <div class="text-h6">Edit Notifications</div>
            <AdminUserEditUserFormEditNotificationInfo />
          </q-tab-panel>
          <q-tab-panel name="passwword">
            <div class="text-h6">Reset Password</div>
            <AdminUserEditUserFormEditPasswordInfo />
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </div>
  </div>
</template>
