import { Notify } from "quasar";
import { ref } from "vue";
import { BaseApiClass } from "./BaseApiClass";
import type { UseFetchOptions } from "#app";

class UserApiService extends BaseApiClass {
  // public updatePassword(
  //   id: string,
  //   body: any,
  //   opt?: UseFetchOptions<any>,
  //   asyncDataOpt?: AsyncDataOptions<any>
  // ) {
  //   return useAsyncData(
  //     this.url,
  //     () =>
  //       $fetch(this.url + "/update-password/" + id, {
  //         method: "post",
  //         body,
  //         ...(opt as any),
  //       }),
  //     {
  //       ...asyncDataOpt,
  //       immediate: false,
  //     }
  //   );
  // }

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
          message: `${this.name} created successfully`,
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
        Notify.create({
          message: `Failed to create ${this.name}`,
          color: "negative",
        });
      }
    };

    return { loading, execute };
  }
}

export const userApi = new UserApiService("/api/users", "User");
