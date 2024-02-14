import { Notify } from "quasar";
import type { AdditionalParams } from "@/types/QueryParamsTypes";
import { BaseApiClass } from "./BaseApiClass";
import type { AsyncDataOptions, UseFetchOptions } from "#app";

class NotificationApiService extends BaseApiClass {
  public deleteAllNotifcations(
    opt?: UseFetchOptions<any>,
    asyncDataOpt?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      this.url,
      () =>
        $fetch(this.url + `/delete/all`, {
          method: "delete",
          ...(opt as any),
        }),
      {
        ...asyncDataOpt,
        immediate: false,
      }
    );
  }

  public deleteReadNotifcations(
    opt?: UseFetchOptions<any>,
    asyncDataOpt?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      this.url,
      () =>
        $fetch(this.url + `/delete/read`, {
          method: "delete",
          ...(opt as any),
        }),
      {
        ...asyncDataOpt,
        immediate: false,
      }
    );
  }

  public async getMenuNotifications(
    query?: AdditionalParams,
    opt?: UseFetchOptions<any>
  ) {
    return useFetch(this.url + "/get-menu-notifications", {
      ...opt,
      body: {
        ...query,
      },
    });
  }

  public markAsRead(
    id: string,
    body: any,
    opt?: UseFetchOptions<any>,
    asyncDataOpt?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      this.url,
      () =>
        $fetch(this.url + "/mark-as-read/" + id, {
          method: "post",
          body,
          ...(opt as any),
        }),
      {
        ...asyncDataOpt,
        immediate: false,
      }
    );
  }
}

export const notifcationApi = new NotificationApiService(
  "/api/notifications",
  "Notification"
);
