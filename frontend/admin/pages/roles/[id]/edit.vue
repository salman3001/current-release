<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Notify } from 'quasar';
import qs from 'qs'


const id = useRoute().params.id;
const loading = ref(false);
const role = ref<null | Record<string, any>>(null);
const permissionId = ref<any>(null);
const activate = ref(false);
const permissions = ref<any>(null);
const customFetch = useCustomFetch()



const submit = async () => {
  try {
    loading.value = true;
    const res = await customFetch('/api/roles/' + id, {
      body: {
        permissionId: permissionId.value,
        isActive: activate.value
      },
      method: 'put'
    }
    );
    loading.value = false;
    Notify.create({
      message: 'Role updated',
      color: 'positive',
      icon: 'check_circle',
    });
    navigateTo(routes.admin.roles)
  } catch (error: any) {
    loading.value = false;
    Notify.create({
      message: 'Failed up update Role',
      color: 'negative',
      icon: 'warning',
    });
  }
};

onMounted(async () => {
  const roleQuery = qs.stringify({
    populate: {
      permissions: {
        fields: ['id'],
      },
    },
  }, { encode: false })

  try {
    const res = await customFetch('/api/roles/' + id + `?${roleQuery}`,);
    if (res) {
      role.value = res;
      if (res.is_active == 1) {
        activate.value = true
      } else {
        activate.value = false
      }
      permissionId.value = [...res.permissions?.map((p: any) => p?.id)];
    }
  } catch (error) {
    Notify.create({
      message: 'Failed to fetch role',
      color: 'negative',
      icon: 'warning',
    });
  }

  try {
    const res = await customFetch('/api/permissions');
    if (res) {
      permissions.value = res;
    }
  } catch (error) {
    Notify.create({
      message: 'Failed to fetch permissions',
      color: 'negative',
      icon: 'warning',
    });
  }
});
</script>

<template>
  <div class="q-pa-lg">
    <div class="row items-center q-gutter-sm">
      <q-icon name="keyboard_backspace" size="30px" style="cursor: pointer" @click="() => {
        navigateTo(routes.admin.roles)
      }
        " />
      <span class="text-h6"> Edit Role </span>
    </div>
    <p class="text-secondary row items-center q-py-lg" v-if="role?.name === 'Super Admin'" style="gap: 6px;"><q-icon
        name="info" size="20px"></q-icon> Super
      Admin
      can
      not be edited</p>
    <q-form v-else class="column q-gutter-y-md" @submit="submit">
      <div class="q-py-md">
        <q-toggle label="Activae" v-model="activate" />
      </div>
      <p class="text-subtitle1">Select Permissions</p>

      <div v-if="permissions" class="row">
        <q-checkbox v-for="p in permissions" :key="p.id" :val="p.id" v-model="permissionId" :label="p.name"
          class="col-6 col-sm-4 col-md-3" />
      </div>
      <div class="row justify-end q-gutter-md">
        <q-btn style="background-color: #e6e4d9; color: #aeaca1; min-width: 8rem" @click="() => {
        navigateTo(routes.admin.roles)
      }
        ">Cancle</q-btn>
        <q-btn color="primary" v-if="loading">
          <q-circular-progress indeterminate size="20px" class="q-px-10" :thickness="1" color="grey-8"
            track-color="orange-2" style="min-width: 8rem" />
        </q-btn>
        <q-btn v-else color="primary" type="submit" style="min-width: 8rem">Update</q-btn>
      </div>
    </q-form>
  </div>
</template>
