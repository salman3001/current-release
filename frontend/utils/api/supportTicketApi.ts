import { Notify } from "quasar";
import { ref } from "vue";
import { BaseApiClass } from "./BaseApiClass";

class SupportTicketApiService extends BaseApiClass {
  public changeStatus(
    config?: AxiosRequestConfig<any> | undefined,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data: any) => {
      try {
        loading.value = true;
        const res = await api.post(
          this.url + "/change-status/" + id,
          data,
          config
        );
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
        Notify.create({
          message: `${this.name} Status Changed`,
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        if (error?.response) {
          loading.value = false;
          cb?.onError && cb?.onError();
          Notify.create({
            message:
              error?.response?.data?.message ||
              `Failed to Chnage Status ${this.name}`,
            color: "negative",
          });
        } else if (error?.request) {
          loading.value = false;
          cb?.onError && cb?.onError();
          Notify.create({
            message: `Trying to create ${this.name}.Server Not Reachable!`,
            color: "negative",
          });
        } else {
          loading.value = false;
          cb?.onError && cb?.onError();
          Notify.create({ message: error.message, color: "negative" });
        }
      }
    };

    return {
      loading,
      execute,
    };
  }

  public async getMessages(
    id?: string,
    config?: AxiosRequestConfig<any> | undefined,
    page?: number,
    limit?: number
  ) {
    const loading = ref(false);
    const data = ref(null);
    try {
      loading.value = true;
      const res = await api.get(
        this.url +
          "/messages/" +
          id +
          `?page=${page ?? 1}&limit=${limit ?? 20}`,
        {
          headers: { "content-type": "application/x-www-form-urlencoded" },
          ...config,
        }
      );
      if (res?.data) {
        data.value = res?.data;
      }
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
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

  public createMessage(
    config?: AxiosRequestConfig<any> | undefined,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data: any) => {
      try {
        loading.value = true;
        const res = await api.post(
          this.url + "/create-message/" + id,
          data,
          config
        );
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        if (error?.response) {
          loading.value = false;
          cb?.onError && cb?.onError();
          Notify.create({
            message:
              error?.response?.data?.message || "Failed to sedn Messsage",
            color: "negative",
          });
        } else if (error?.request) {
          loading.value = false;
          cb?.onError && cb?.onError();
          Notify.create({
            message: "Failed to sedn Messsage,.Server Not Reachable!",
            color: "negative",
          });
        } else {
          loading.value = false;
          cb?.onError && cb?.onError();
          Notify.create({ message: error.message, color: "negative" });
        }
      }
    };

    return {
      loading,
      execute,
    };
  }
}
export const SupportTickeApi = new SupportTicketApiService(
  "/help-center/support-ticket",
  "Ticket Messages"
);
