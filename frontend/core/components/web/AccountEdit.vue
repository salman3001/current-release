<script setup lang="ts">
const mode = ref<"read" | "write">("read");
const user = useCookie("user") as Ref<IUser>;
const custmFetch = useCustomFetch();
const loading = ref(false);

const initialForm = {
  email: user.value.email,
  firstName: user.value.first_name,
  lastName: user.value.last_name,
  phone: user.value.phone,
};

let form = reactive(initialForm);

const updateAccount = async () => {
  loading.value = true;

  try {
    const data = await custmFetch<IResType<any>>(
      apiRoutes.users.view(user.value.id),
      {
        method: "put",
        body: form,
      }
    );

    if (data.success == true) {
      form = initialForm;
      mode.value = "read";
      user.value = data.data;
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
};
</script>

<template>
  <div class="q-gutter-y-md" v-if="mode == 'read'">
    <div class="row q-gutter-md items-center">
      <div>
        <div class="text-subtitle1 text-bold">Name</div>
        <div>{{ user.first_name + " " + user.last_name }}</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Email</div>
        <div>{{ user.email }}</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Phone</div>
        <div>{{ user.phone }}</div>
      </div>
    </div>
    <div>
      <q-btn color="primary" @click="mode = 'write'" label="Edit" icon="edit" />
    </div>
  </div>
  <q-form class="q-gutter-y-md" v-if="mode == 'write'" @submit="updateAccount">
    <div class="row q-gutter-sm items-center">
      <div>
        <div class="text-subtitle1 text-bold">Name</div>
        <q-input
          outlined
          v-model="form.email"
          dense
          placeholder="name@example.com"
          :rules="[
            rules.required('Required'),
            rules.email('Email is not valid'),
          ]"
        />
      </div>
      <div>
        <div class="text-subtitle1 text-bold">First Name</div>
        <q-input
          outlined
          v-model="form.firstName"
          dense
          :rules="[rules.required('Required')]"
        />
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Last Name</div>
        <q-input
          outlined
          v-model="form.lastName"
          dense
          :rules="[rules.required('Required')]"
        />
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Phone</div>
        <q-input
          outlined
          type="number"
          v-model="form.phone"
          dense
          :rules="[
            rules.required('Required'),
            rules.minLength(8, 'Phone number is not valid'),
          ]"
        />
      </div>
    </div>
    <div class="q-gutter-sm">
      <q-btn color="secondary" @click="mode = 'read'" :disabled="loading"
        >Cancle</q-btn
      >
      <q-btn color="primary" :disabled="loading" type="submit">
        <LoadingIndicator v-if="loading" /> Update
      </q-btn>
    </div>
  </q-form>
</template>
