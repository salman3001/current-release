import type { AdditionalParams } from "@/types/QueryParamsTypes";
import { BaseApiClass } from "./BaseApiClass";
import type { UseFetchOptions } from "#app";

class NotificationApiService extends BaseApiClass {
  public deleteAllNotifcations(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async () => {
      try {
        loading.value = true;
        const res = await $fetch(this.url + `/delete/all`, {
          method: "delete",
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        cb?.onError && cb?.onError();
        loading.value = false;
      }
    };

    return {
      loading,
      execute,
    };
  }

  public deleteReadNotifcations(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async () => {
      try {
        loading.value = true;
        const res = await $fetch(this.url + `/delete/read`, {
          method: "delete",
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        cb?.onError && cb?.onError();
        loading.value = false;
      }
    };

    return {
      loading,
      execute,
    };
  }

  public async getMenuNotifications(
    query?: AdditionalParams,
    opt?: UseFetchOptions<any>
  ) {
    return $fetch(this.url + "/get-menu-notifications", {
      query,
      ...(opt as any),
    });
  }

  public markAsRead(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data?: any) => {
      try {
        loading.value = true;
        const res = await $fetch(this.url + "/mark-as-read/" + id, {
          body: data,
          method: "post",
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
      }
    };

    return {
      loading,
      execute,
    };
  }
}

export const notifcationApi = new NotificationApiService(
  "/api/notifications",
  "Notification"
);
