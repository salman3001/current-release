<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const auth = authStore();
const isPwd = ref(true);
const tab = ref('otp')
const router = useRouter()

const form = ref({
  email: '',
  otp: '',
  password: '',
  password_confirmation: ''
});

const { execute: getOTP, loading: loadingOTP } = auth.getOtp({
  onSuccess: () => {
    tab.value = 'reset'
  }
})

const { execute: resetPwd, loading: loadingReset } = auth.verifyOtpAndUpdatePWD({
  onSuccess: () => {
    tab.value = 'otp'
    router.push({ name: 'home' })
  }
})

</script>
<template>
  <q-layout>
    <q-page-container>
      <q-page class="row items-center justify-evenly" style="
          background-image: url('/images/login-bg.png');
          background-repeat: no-repeat;
          background-position: center;
        ">
        <div class="q-pa-md">
          <q-tab-panels v-model="tab" animated>
            <q-tab-panel name="otp" class="q-py-xl">
              <q-card class="my-card q-pa-md" style="min-width: 400px; border-radius: 15px">
                <q-card-section>
                  <div class="row justify-center">
                    <BrandLogo />
                  </div>
                  <div class="text-h5 text-weight-bold text-center">
                    Forgot Password?
                  </div>
                  <div class="text-body2 text-grey-8 text-center">
                    Please enter your email to recieve password reset link
                  </div>
                </q-card-section>

                <q-card-section class="q-pt-none">
                  <q-form class="q-gutter-y-md" @submit="
                    getOTP({ email: form.email })
                    ">
                    <div>
                      <label>Email</label>
                      <q-input outlined v-model="form.email" dense
                        :rules="[rules.required('Email is required'), rules.email('Not a Valid Email')]" />
                    </div>
                    <q-btn color="primary" v-if="loadingOTP" :disable="true" style="width: 100%">
                      <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                        track-color="orange-2" style="min-width: 8rem" />
                    </q-btn>
                    <q-btn v-else type="submit" color="primary" style="width: 100%">Submit</q-btn>
                  </q-form>
                </q-card-section>
              </q-card>
            </q-tab-panel>

            <q-tab-panel name="reset">
              <q-tab-panel name="personal" class="q-py-xl">
                <q-card class="my-card q-pa-md" style="min-width: 400px; border-radius: 15px">
                  <q-card-section>
                    <div class="row justify-center">
                      <BrandLogo />
                    </div>
                    <div class="text-h5 text-weight-bold text-center">
                      Enter OTP
                    </div>
                    <div class="text-body2 text-grey-8 text-center">
                      We just sent and otp on your email
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-form class="q-gutter-y-md" @submit="() => {
                      resetPwd(form)
                    }">
                      <div>
                        <label>OTP</label>
                        <q-input outlined v-model="form.otp" dense type="number"
                          :rules="[rules.required(), rules.minLength(6, 'Invalid OTP')]" />
                      </div>
                      <div>
                        <label>New Password</label>
                        <q-input dense v-model="form.password" outlined :type="isPwd ? 'password' : 'text'"
                          :rules="[rules.required('Required'), rules.minLength(9, 'Password must contain 9 charectors')]">
                          <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                              @click="isPwd = !isPwd" />
                          </template>
                        </q-input>
                      </div>
                      <div>
                        <label>Confirm New Password</label>
                        <q-input dense v-model="form.password_confirmation" outlined :type="isPwd ? 'password' : 'text'"
                          :rules="[rules.required('Required'), rules.minLength(9, 'Password must contain 9 charectors'), rules.sameAs(form.password, 'Password doesnt match')]">
                          <template v-slot:append>
                            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                              @click="isPwd = !isPwd" />
                          </template>
                        </q-input>
                      </div>
                      <q-btn color="primary" v-if="loadingReset" :disable="true" style="width: 100%">
                        <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                          track-color="orange-2" style="min-width: 8rem" />
                      </q-btn>
                      <q-btn v-else type="submit" color="primary" style="width: 100%">Submit</q-btn>
                    </q-form>
                  </q-card-section>
                </q-card>
              </q-tab-panel>
            </q-tab-panel>
          </q-tab-panels>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
