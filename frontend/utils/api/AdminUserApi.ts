import type { AsyncDataOptions, UseFetchOptions } from "#app";
import { BaseApiClass } from "./BaseApiClass";

class AdminUserApiService extends BaseApiClass {
  public updatePassword(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data: any) => {
      try {
        loading.value = true;
        const res = await $fetch(this.url + "/update-password/" + id, {
          body: data,
          method: "post",
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
        Notify.create({
          message: "password updated successfully",
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
        Notify.create({
          message: "Failed to update",
          color: "negative",
        });
      }
    };

    return {
      loading,
      execute,
    };
  }
}

export const AdminUserApi = new AdminUserApiService("/admin-users", "User");
