<script setup lang="ts">
import { useRouter } from 'vue-router';
import PersonalInfoForm from 'src/components/admin/user/AddUserWizard/PersonalInfoForm.vue'
import SocialInfo from 'src/components/admin/user/AddUserWizard/SocialInfo.vue'
import FavoriteLinkInfo from 'src/components/admin/user/AddUserWizard/FavoriteLinkInfo.vue'
import ProfessionalInfo from 'src/components/admin/user/AddUserWizard/ProfessionalInfo.vue'
import PrivacyForm from 'src/components/admin/user/AddUserWizard/PrivacyForm.vue'
import NotificationForm from 'src/components/admin/user/AddUserWizard/NotificationForm.vue'
import PasswordForm from 'src/components/admin/user/AddUserWizard/PasswordForm.vue'
import PreviewForm from 'src/components/admin/user/AddUserWizard/PreviewForm.vue'
import { ref } from 'vue';

const router = useRouter();
const step = ref(1)

const editHandler = (v: string) => {
  if (v === 'personal') {
    step.value = 1
  }

  if (v === 'social') {
    step.value = 2
  }

  if (v === 'favorite') {
    step.value = 3
  }

  if (v === 'profession') {
    step.value = 4
  }

  if (v === 'language') {
    step.value = 4
  }

  if (v === 'skill') {
    step.value = 4
  }

  if (v === 'privacy') {
    step.value = 5
  }

  if (v === 'Notifications') {
    step.value = 6
  }


}


</script>

<template>
  <div class="q-pa-md">
    <div class="row items-center q-gutter-sm">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        router.push({ name: 'admin.user.index' });
      }
        " />
      <span class="text-h6"> Add User </span>
    </div>
    <div>
      <q-stepper flat v-model="step" ref="stepper" color="primary" animated>
        <q-step :name="1" title="Personal" icon="settings" :done="step > 1">
          <PersonalInfoForm :step="step" @next="$refs.stepper.next()" />
        </q-step>

        <q-step :name="2" title="Social Links" icon="create_new_folder" :done="step > 2">
          <SocialInfo :step="step" @next="$refs.stepper.next()" @prev="$refs.stepper.previous()" />
        </q-step>

        <q-step :name="3" title="Favorite Links" icon="assignment" :done="step > 3">
          <FavoriteLinkInfo :step="step" @next="$refs.stepper.next()" @prev="$refs.stepper.previous()" />
        </q-step>

        <q-step :name="4" title="Profession" icon="add_comment" :done="step > 4">
          <ProfessionalInfo :step="step" @next="$refs.stepper.next()" @prev="$refs.stepper.previous()" />
        </q-step>
        <q-step :name="5" title="Privacy" icon="assignment" :done="step > 5">
          <PrivacyForm :step="step" @next="$refs.stepper.next()" @prev="$refs.stepper.previous()" />
        </q-step>
        <q-step :name="6" title="Notifications" icon="assignment" :done="step > 6">
          <NotificationForm :step="step" @next="$refs.stepper.next()" @prev="$refs.stepper.previous()" />

        </q-step>
        <q-step :name="7" title="Set Password" icon="assignment" :done="step > 7">
          <PasswordForm :step="step" @next="$refs.stepper.next()" @prev="$refs.stepper.previous()" />

        </q-step>
        <q-step :name="8" title="Preview" icon="assignment" :done="step > 8">
          <PreviewForm :step="step" @next="$refs.stepper.next()" @prev="$refs.stepper.previous()" @edit="editHandler" />

        </q-step>
        <template v-slot:navigation>

          <!-- <q-stepper-navigation>
            <div class="row justify-end q-gutter-md">
              <q-btn v-if="step > 1" style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem"
                @click="$refs.stepper.previous()" label="Back" class="q-ml-sm" />

              <q-btn color="primary" v-if="loading">
                <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                  track-color="orange-2" style="min-width: 8rem" />
              </q-btn>
              <q-btn v-else color="primary" type="submit" style="min-width: 8rem"
                @click="$refs.stepper.next()">Next</q-btn>
            </div>
          </q-stepper-navigation> -->
        </template>
      </q-stepper>
    </div>
  </div>
</template>


