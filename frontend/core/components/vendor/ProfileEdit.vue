<script setup lang="ts">
const mode = ref<"read" | "write">("read");
const { user } = useAuth();
const custmFetch = useCustomFetch();
const loading = ref(false);
const getImageUrl = useGetImageUrl();

const initialForm = {
  avatar: null as any,
  profile: {
    shortDesc: "",
    longDesc: "",
  },
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

    <div class="column q-gutter-md">
      <div>
        <div class="text-subtitle1 text-bold">Bio</div>
        <div class="text-muted">
          {{ (user as IVendorUser).profile?.short_desc || "Please add a bio" }}
        </div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Description</div>
        <div class="text-muted">
          {{
    (user as IVendorUser).profile?.long_desc ||
    "Please add your Business description"
  }}
        </div>
      </div>
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
    <div class="column q-gutter-sm" style="max-width: 600px">
      <div>
        <div class="text-subtitle1 text-bold">Bio</div>
        <q-input type="textarea" outlined v-model="form.profile.shortDesc" dense placeholder="Bio" />
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Description</div>
        <q-input type="textarea" outlined v-model="form.profile.longDesc" dense placeholder="Description" />
      </div>
    </div>
    <div class="q-gutter-sm">
      <q-btn color="secondary" @click="mode = 'read'" :disabled="loading">Cancle</q-btn>
      <q-btn color="primary" type="submit" :disabled="loading">
        <LoadingIndicator v-if="loading" /> Update
      </q-btn>
    </div>
  </q-form>
  <br />
  <br />
</template>
