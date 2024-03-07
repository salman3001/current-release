<script setup lang="ts">
const form = ref({
  old_password: "",
  password: "",
  password_confirmation: "",
});

const isPwd = ref(false);
</script>

<template>
  <div class="q-gutter-y-lg">
    <h5>Update Password</h5>
    <q-form class="q-gutter-y-sm" style="max-width: 300px">
      <div>
        <label>Old Password</label>
        <q-input
          dense
          v-model="form.old_password"
          outlined
          type="password"
          :rules="[rules.required('Required')]"
        >
        </q-input>
      </div>
      <div>
        <label>New Password</label>
        <q-input
          dense
          v-model="form.password"
          outlined
          type="password"
          :rules="[
            rules.required('Required'),
            rules.minLength(9, 'Password must contain 9 charectors'),
          ]"
        >
        </q-input>
      </div>
      <div>
        <label>Confirm New Password</label>
        <q-input
          dense
          v-model="form.password_confirmation"
          outlined
          :type="isPwd ? 'password' : 'text'"
          :rules="[
            rules.required('Required'),
            rules.sameAs(form.password, 'Password doesnt match'),
          ]"
        >
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>
      </div>
      <q-btn
        color="primary"
        v-if="loadingReset"
        :disable="true"
        style="width: 100%"
      >
        <q-circular-progress
          indeterminate
          size="20px"
          class="q-px-10"
          :thickness="1"
          color="grey-8"
          track-color="orange-2"
          style="min-width: 8rem"
        />
      </q-btn>
      <q-btn v-else type="submit" color="primary" style="width: 100%"
        >Submit</q-btn
      >
    </q-form>
  </div>
</template>
