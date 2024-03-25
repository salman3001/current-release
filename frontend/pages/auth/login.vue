<script setup lang="ts">
import { ref } from 'vue';

const auth = authStore();
const isPwd = ref(true);
const loading = ref(false)
const config = useRuntimeConfig()
const $q = useQuasar()
const next = useRoute().query.next

const form = ref({
  email: '',
  password: '',
  userType: userTypes.USER
});

const login = async () => {
  loading.value = true
  const res = await auth.login(
    form.value.email,
    form.value.password,
    form.value.userType
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
    createFetch({
      baseURL: config.public.baseApi,
      headers: {
        authorization,
      },
    })

    if (next) {
      console.log('ran');

      navigateTo(next as string)
    } else {
      navigateTo(routes.home)
    }
  }


  loading.value = false
}


</script>

<template>
  <div class="row q--col-gutter-md q-pa-md q-pa-md-lg q-pa-md q-pa-lg-lg window-height" style="min-height: 100vh;">
    <div class="col-12 col-md-7 column full-height">
      <div class="col-1">
        <BrandLogo size="200px" :to="routes.home" />
      </div>
      <div class="col-11 row justify-center items-center q-pt-md">

        <q-card class="my-card q-pa-0 no-shadow" :class="$q.screen.lt.sm ? 'full-width' : ''"
          :style="{ translate: $q.screen.gt.md ? '0px -50px' : 'none', width: $q.screen.gt.xs ? '500px' : 'auto' }">
          <q-card-section :class="$q.screen.lt.sm ? 'q-pa-none' : ''">

            <div class="text-h4 text-weight-bold">
              Sign in
            </div>
            <p class="text-grey-8">Please enter your credentials</p>
          </q-card-section>

          <q-card-section class="q-pt-none q-pt-md" :class="$q.screen.lt.sm ? 'q-pa-none' : ''">
            <q-form class="q-gutter-y-sm" @submit.prevent="login">
              <div>
                <label>Email adress</label>
                <q-input outlined v-model="form.email" dense placeholder="name@example.com"
                  :rules="[rules.required('Required'), rules.email('Email is not valid')]" />
              </div>
              <div>
                <label>Password</label>
                <q-input dense v-model="form.password" outlined :type="isPwd ? 'password' : 'text'"
                  placeholder="*********" :rules="[rules.required('Required')]">
                  <template v-slot:append>
                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                      @click="isPwd = !isPwd" />
                  </template>
                </q-input>
                <div class="row items-center justify-end q-pt-sm">
                  <NuxtLink :to="routes.auth.forgot_password" class="text-grey-7">Forgot
                    password?</NuxtLink>
                </div>
              </div>
              <q-btn color="primary" v-if="loading" :disable="true" style="width: 100%">
                <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="primary"
                  track-color="black" style="min-width: 8rem" />
              </q-btn>
              <q-btn v-else type="submit" color="primary" style="width: 100%">Sign in</q-btn>
            </q-form>


          </q-card-section>
          <q-card-section>
            <q-separator />

          </q-card-section>

          <q-card-section class="row justify-center ">
            <q-btn outline style="text-transform: none;" color="grey-8" class="full-width"><q-icon left
                name="img:/images/google-icon.webp"></q-icon>
              <div> Sign in with Google</div>
            </q-btn>
          </q-card-section>
          <div>
            <p class="text-center">Dont have an account? <NuxtLink :to="routes.auth.sign_up">Sign up</NuxtLink>
              <br>
              <br>
            <p class="q-pt-none text-center">
              <NuxtLink :to="routes.auth.vendor_login">
                <q-btn color="primary">
                  Sign in as Vendor
                </q-btn>
              </NuxtLink>
            </p>
            </p>
          </div>

        </q-card>
      </div>
    </div>
    <div class="col-12 col-md-5 gt-sm ">
      <div class=" fit rounded-borders" :style="{ backgroundImage: 'url(/images/login-art.jpg)' }"></div>
    </div>
  </div>
</template>
