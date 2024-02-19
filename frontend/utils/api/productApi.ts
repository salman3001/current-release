import { Notify } from "quasar";
import { ref } from "vue";
import { BaseApiClass } from "./BaseApiClass";
import type { UseFetchOptions } from "#app";

class ProductApiService extends BaseApiClass {
  public async deleteScreenShot(
    id: string,
    cb?: { onSuccess?: () => void; onError?: () => void },
    opt?: UseFetchOptions<any>
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
      if (error?.response) {
        loading.value = false;
        Notify.create({
          message: `Failed to fetch ${this.name}`,
          color: "negative",
          icon: "error",
        });
      }

      return { loading, data };
    }
  }
}

export const productApi = new ProductApiService("/api/product", "Product");
