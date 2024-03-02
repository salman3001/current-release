import { Notify } from "quasar";
import { ref } from "vue";
import { BaseApiClass } from "./BaseApiClass";
import type { UseFetchOptions } from "#app";

class ServiceApiService extends BaseApiClass {
  public async deleteScreenShot(
    id: string,
    opt: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const data = ref(null);
    try {
      loading.value = true;
      const res = await $fetch(this.url + "/delete-screenshot" + `/${id}`, {
        ...(opt as any),
      });
      if (res?.data) {
        data.value = res?.data;
      }
      cb?.onSuccess && cb.onSuccess();
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
    }

    return { loading, data };
  }
}

export const serviceApi = new ServiceApiService("/api/service", "Service");
