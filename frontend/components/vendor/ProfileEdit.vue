<script setup lang="ts">
const mode = ref<"read" | "write">("read");
const { user } = useAuth()
const custmFetch = useCustomFetch();
const loading = ref(false);
const getImageUrl = useGetImageUrl();

const initialForm = {
  avatar: null as any,
};

let form = reactive(initialForm);

const updateProfile = async () => {
  loading.value = true;
  const formData = convertToFormData(form);

  try {
    const data = await custmFetch<IResType<any>>(
      apiRoutes.vendor_user.update_profile(user.value.id),
      {
        method: "put",
        body: formData,
      }
    );

    if (data.success == true) {
      form = initialForm;
      mode.value = "read";
      user.value.profile = data.data;
    }
  } catch (error) {
    console.log(error);
  }
  loading.value = false;
};
</script>

<template>
  <div class="q-gutter-y-md" v-if="mode == 'read'">
    <div class="column q-gutter-sm">
      <label for="">Profile Picture</label>
      <q-img :src="getImageUrl(user.profile?.avatar?.url, '/images/sample-dp.png')" spinner-color="white"
        style="height: 100px; max-width: 100px; border: 1px solid grey" img-class="my-custom-image"
        class="rounded-borders">
      </q-img>
    </div>
    <div class="row q-gutter-md items-center">
      <!-- <div>
        <div class="text-subtitle1 text-bold">Name</div>
        <div>S{{ user.first_name + " " + user.first_name }}</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Email</div>
        <div>{{ user.email }}</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Phone</div>
        <div>{{ user.phone }}</div>
      </div> -->
    </div>
    <div>
      <q-btn color="primary" @click="mode = 'write'" label="Edit" icon="edit" />
    </div>
  </div>
  <q-form class="q-gutter-y-md" v-if="mode == 'write'" @submit="updateProfile">
    <div class="q-gutter-y-sm" style="width: max-content">
      <label for="">Profile Picture</label>
      <FormsImageInput height="100px" width="100px" name="image"
        :url="getImageUrl(user.profile?.avatar?.url, '/images/sample-dp.png')" @image="(v) => (form.avatar = v)" />
    </div>

    <div class="row q-gutter-sm items-center">
      <!-- <div>
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
      </div> -->
    </div>
    <div class="q-gutter-sm">
      <q-btn color="secondary" @click="mode = 'read'" :disabled="loading">Cancle</q-btn>
      <q-btn color="primary" type="submit" :disabled="loading">
        <LoadingIndicator v-if="loading" /> Update
      </q-btn>
    </div>
  </q-form>
</template>
