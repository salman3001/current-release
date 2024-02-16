import { Notify } from "quasar";
import type { AdditionalParams } from "@/types/QueryParamsTypes";
import { BaseApiClass } from "./BaseApiClass";
import type { AsyncDataOptions, UseFetchOptions } from "#app";

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
        Notify.create({
          message: `${this.name} deleted successfully`,
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        cb?.onError && cb?.onError();
        loading.value = false;
        Notify.create({
          message: `Failed to delete ${this.name}`,
          color: "negative",
        });
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
        Notify.create({
          message: `${this.name} deleted successfully`,
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        cb?.onError && cb?.onError();
        loading.value = false;
        Notify.create({
          message: `Failed to delete ${this.name}`,
          color: "negative",
        });
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
        Notify.create({
          message: `${this.name} marked as read`,
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
        Notify.create({
          message: `Failed to mark as read ${this.name}`,
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

export const notifcationApi = new NotificationApiService(
  "/api/notifications",
  "Notification"
);
