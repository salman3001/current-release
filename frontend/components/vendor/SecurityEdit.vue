<script setup lang="ts">
const isPwd = ref(false);
const customFetch = useCustomFetch();
const user = useCookie("user") as unknown as Ref<IUser> | null;
const loading = ref(false);

const initialForm = {
  old_password: "",
  password: "",
  password_confirmation: "",
  userType: "vendor",
};

const form = ref(initialForm);

const updatePassword = async () => {
  loading.value = true;
  try {
    const data = await customFetch<IResType<any>>(
      apiRoutes.auth.updatePassword(user!.value.id),
      {
        method: "post",
        body: form.value,
      }
    );
    if (data.success === true) {
      form.value.password = "";
      form.value.password_confirmation = "";
      form.value.old_password = "";
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
};
</script>

<template>
  <div class="q-gutter-y-lg">
    <br />
    <h5>Update Password</h5>
    <q-form class="q-gutter-y-sm" style="max-width: 300px" @submit="updatePassword">
      <div>
        <label>Old Password</label>
        <q-input dense v-model="form.old_password" outlined type="password" :rules="[rules.required('Required')]">
        </q-input>
      </div>
      <div>
        <label>New Password</label>
        <q-input dense v-model="form.password" outlined type="password" :rules="[
      rules.required('Required'),
      rules.minLength(9, 'Password must contain 9 charectors'),
    ]">
        </q-input>
      </div>
      <div>
        <label>Confirm New Password</label>
        <q-input dense v-model="form.password_confirmation" outlined :type="isPwd ? 'password' : 'text'" :rules="[
      rules.required('Required'),
      rules.sameAs(form.password, 'Password doesnt match'),
    ]">
          <template v-slot:append>
            <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="isPwd = !isPwd" />
          </template>
        </q-input>
      </div>
      <q-btn type="submit" color="primary" style="width: 100%" :disabled="loading"><loading-indicator v-if="loading" />
        Submit</q-btn>
    </q-form>
  </div>
</template>
