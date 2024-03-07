<script setup lang="ts">
const mode = ref<"read" | "write">("read");

const form = ref({
  email: "theroder@gmail.com",
  firstName: "Salman",
  lastName: "Khan",
  phone: "89542121",
});
</script>
<template>
  <div class="q-pa-md q-gutter-y-md" v-if="mode == 'read'">
    <q-img
      src="/images/sample-dp.png"
      spinner-color="white"
      style="height: 100px; max-width: 100px; border: 1px solid grey"
      img-class="my-custom-image"
      class="rounded-borders"
    >
    </q-img>
    <div class="row q-gutter-md items-center">
      <div>
        <div class="text-subtitle1 text-bold">Name</div>
        <div>Salman Khan</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Email</div>
        <div>theroder@gmail.com</div>
      </div>
      <div>
        <div class="text-subtitle1 text-bold">Phone</div>
        <div>91892557845</div>
      </div>
    </div>
    <div>
      <q-btn color="primary" right @click="mode = 'write'"
        ><q-icon name="edit" size="20px"></q-icon> Edit</q-btn
      >
    </div>
  </div>
  <q-form class="q-pa-md q-gutter-y-md" v-if="mode == 'write'">
    <div class="row">
      <FormsImageInput
        height="100px"
        width="100px"
        name="image"
        url="/images/sample-dp.png"
      />
    </div>

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
          :rules="[rules.required('Required')]"
        />
      </div>
    </div>
    <div class="q-gutter-sm">
      <q-btn color="secondary" @click="mode = 'read'">Cancle</q-btn>
      <q-btn color="primary">Update</q-btn>
    </div>
  </q-form>
</template>
