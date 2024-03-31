<script setup lang="ts">
const mode = ref<"read" | "write">("read");
const { user } = useAuth();
const custmFetch = useCustomFetch();
const loading = ref(false);

const initialForm = {
  email: user.value.email,
  firstName: user.value.first_name,
  lastName: user.value.last_name,
  phone: user.value.phone,
  businessName: (user.value as unknown as IVendorUser).business_name,
};

let form = reactive(initialForm);

const updateAccount = async () => {
  loading.value = true;

  try {
    const data = await custmFetch<IResType<any>>(
      apiRoutes.vendor_user.update(user.value.id),
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
        <div class="text-muted">
          {{ user.first_name + " " + user.last_name }}
        </div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Business Name</div>
        <div class="text-muted">{{ user!.business_name }}</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Email</div>
        <div class="text-muted">{{ user.email }}</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Phone</div>
        <div class="text-muted">{{ user.phone }}</div>
      </div>
    </div>
    <div>
      <q-btn color="primary" @click="mode = 'write'" label="Edit" icon="edit" />
    </div>
  </div>
  <q-form class="q-gutter-y-md" v-if="mode == 'write'" @submit="updateAccount">
    <div class="row q-col-gutter-sm items-center">
      <div class="col-12 col-sm-6 col-md-4">
        <div class="text-subtitle1 text-bold">Email</div>
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
      <div class="col-12 col-sm-6 col-md-4">
        <div class="text-subtitle1 text-bold">Business Name</div>
        <q-input
          outlined
          v-model="form.businessName"
          dense
          :rules="[rules.required('Required')]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <div class="text-subtitle1 text-bold">First Name</div>
        <q-input
          outlined
          v-model="form.firstName"
          dense
          :rules="[rules.required('Required')]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
        <div class="text-subtitle1 text-bold">Last Name</div>
        <q-input
          outlined
          v-model="form.lastName"
          dense
          :rules="[rules.required('Required')]"
        />
      </div>
      <div class="col-12 col-sm-6 col-md-4">
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
