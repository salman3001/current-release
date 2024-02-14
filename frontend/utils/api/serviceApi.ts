import { Notify } from "quasar";
import { ref } from "vue";
import { BaseApiClass } from "./BaseApiClass";

class ServiceApiService extends BaseApiClass {
  public async deleteScreenShot(
    id: string,
    config?: AxiosRequestConfig<any> | undefined,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const data = ref(null);
    try {
      loading.value = true;
      const res = await api.get(
        this.url + "/delete-screenshot" + `/${id}`,
        config
      );
      if (res?.data) {
        data.value = res?.data;
      }
      cb?.onSuccess && cb.onSuccess();
      loading.value = false;
    } catch (error: any) {
      if (error?.response) {
        Notify.create({
          message:
            error?.response?.data?.message || `Failed to fetch ${this.name}`,
          color: "negative",
        });
      } else if (error?.request) {
        Notify.create({
          message: `Trying to fetch ${this.name}.Server Not Reachable!`,
          color: "negative",
        });
      } else {
        Notify.create({ message: error.message, color: "negative" });
      }
    }

    return { loading, data };
  }
}

export const serviceApi = new ServiceApiService("/api/service", "Service");
