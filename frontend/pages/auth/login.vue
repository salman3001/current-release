<script setup lang="ts">
import { ref } from 'vue';
import { ofetch } from 'ofetch'

const auth = authStore();
const isPwd = ref(true);
const loading = ref(false)
const config = useRuntimeConfig()

const form = ref({
  email: '',
  password: '',
});

const login = async () => {
  loading.value = true
  const res = await auth.adminLogin(
    form.value.email,
    form.value.password,
  );

  if (res) {
    const user = useCookie('user', {
      maxAge: 60 * 60 * 24
    })

    const token = useCookie('token', {
      maxAge: 60 * 60 * 24
    })

    const socketToken = useCookie('socketToken', {
      maxAge: 60 * 60 * 24
    })


    user.value = res?.data.user
    token.value = res?.data.token.token
    socketToken.value = res?.data?.socketToken
    const authorization = `Bearer ${toRaw(token.value)}`
    globalThis.$fetch = ofetch.create({
      baseURL: config.public.baseApi,
      headers: {
        authorization,
      },
    })
  }

  navigateTo(routes.admin.dashboard)

  loading.value = false
}


</script>
<template>
  <div class="row q--col-gutter-md q-pa-md q-pa-md-lg q-pa-md q-pa-lg-lg window-height" style="max-height: 100vh;">
    <div class="col-12 col-md-7 column full-height">
      <div class="col-1">
        <h1 class="text-h4 text-weight-bold text-primary">Start up</h1>
      </div>
      <div class="col-11 row justify-center items-center">
        <q-card class="my-card q-pa-md ">
          <q-card-section>
            <div class="row justify-center">
              <BrandLogo />
            </div>
            <div class="text-h5 text-weight-bold text-center">
              Sign in to your account
            </div>
            <div class="text-body2 text-grey-8 text-center">
              Please enter your crendtials to login
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <form class="q-gutter-y-lg" @submit.prevent="login">
              <div>
                <label>Email</label>
                <q-input outlined v-model="form.email" dense />
              </div>
              <div>
                <label>Password</label>
                <q-input dense v-model="form.password" outlined :type="isPwd ? 'password' : 'text'">
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
                <div class="row items-center justify-end p-2">
                  <NuxtLink :to="routes.auth.admin_forgot_password" style="text-decoration: none; color: black">Forgot
                    Password</NuxtLink>
                </div>
              </div>
              <q-btn color="primary" v-if="loading" :disable="true" style="width: 100%">
                <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
                  track-color="orange-2" style="min-width: 8rem" />
              </q-btn>
              <q-btn v-else type="submit" color="primary" style="width: 100%">Submit</q-btn>
            </form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <div class="col-12 col-md-5 gt-sm ">
      <div class="bg-secondary fit rounded-borders"></div>
    </div>
  </div>
</template>
