import { ref } from "vue";
import { BaseApiClass } from "./BaseApiClass";
import type { UseFetchOptions } from "#app";

class SupportTicketApiService extends BaseApiClass {
  public changeStatus(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data: any) => {
      try {
        loading.value = true;
        const res = await $fetch(this.url + "/change-status/" + id, {
          method: "post",
          body: data,
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

  public async getMessages(
    id?: string,
    opt?: UseFetchOptions<any>,
    page?: number,
    limit?: number
  ) {
    const loading = ref(false);
    const data = ref(null);
    try {
      loading.value = true;
      const res = await $fetch(
        this.url +
        "/messages/" +
        id +
        `?page=${page ?? 1}&limit=${limit ?? 20}`,
        {
          headers: { "content-type": "application/x-www-form-urlencoded" },
          ...(opt as any),
        }
      );
      if (res) {
        data.value = res as any;
      }
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
    }

    return { loading, data };
  }

  public createMessage(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data: any) => {
      try {
        loading.value = true;
        const res = await $fetch(this.url + "/create-message/" + id, {
          method: "post",
          body: data,
          ...(opt as any),
        });
        console.log("ran");
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
export const SupportTickeApi = new SupportTicketApiService(
  "/api/help-center/support-ticket",
  "Ticket Messages"
);
