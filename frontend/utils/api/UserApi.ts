import { Notify } from "quasar";
import { ref } from "vue";
import { BaseApiClass } from "./BaseApiClass";
import type { AsyncDataOptions, UseFetchOptions } from "#app";

class UserApiService extends BaseApiClass {
  public updatePassword(
    id: string,
    body: any,
    opt?: UseFetchOptions<any>,
    asyncDataOpt?: AsyncDataOptions<any>
  ) {
    return useAsyncData(
      this.url,
      () =>
        $fetch(this.url + "/update-password/" + id, {
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

export const userApi = new UserApiService("users", "User");
