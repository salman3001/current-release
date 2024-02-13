import { Notify } from "quasar";
import type { AdditionalParams } from "@/types/QueryParamsTypes";
import type { AsyncDataOptions, UseFetchOptions } from "#app";
import qs from "qs";

export class BaseApiClass {
  url: string;
  name: string;

  public constructor(url: string, name: string) {
    (this.url = url), (this.name = name);
  }

  public index(query?: AdditionalParams, opt?: UseFetchOptions<any>) {
    const stringQuery = qs.stringify(query);
    return useFetch(baseApiUrl + this.url + `?${stringQuery}`, {
      ...opt,
    });
  }

  public show(
    id: string,
    query?: AdditionalParams,
    opt?: UseFetchOptions<any>
  ) {
    const stringQuery = qs.stringify(query, { encode: false });
    return useFetch(baseApiUrl + this.url + `/${id}?${stringQuery}`, {
      ...opt,
    });
  }

  public post(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (data: any) => {
      try {
        loading.value = true;
        const res = await $fetch(baseApiUrl + this.url, {
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
          message: `Failed to create ${baseApiUrl + this.name}`,
          color: "negative",
        });
      }
    };

    return {
      loading,
      execute,
    };
  }

  public put(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data: any) => {
      try {
        loading.value = true;
        const res = await $fetch(baseApiUrl + this.url + `/${id}`, {
          body: data,
          method: "put",
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
        Notify.create({
          message: `${this.name} updated successfully`,
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        cb?.onError && cb?.onError();
        loading.value = false;
        Notify.create({
          message: `Failed to updtae ${this.name}`,
          color: "negative",
        });
      }
    };

    return {
      loading,
      execute,
    };
  }

  public delete(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string) => {
      try {
        loading.value = true;
        const res = await $fetch(baseApiUrl + this.url + `/${id}`, {
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

  public async exportExcel(
    query?: AdditionalParams,
    opt?: UseFetchOptions<any>
  ) {
    const loading = ref(false);
    const data = ref(null);
    try {
      loading.value = true;
      const res = await $fetch(baseApiUrl + this.url + "/export", {
        params: {
          ...query,
        },
        headers: { "content-type": "application/x-www-form-urlencoded" },
        ...(opt as any),
      });
      if (res) {
        data.value = res;
      }
      loading.value = false;
    } catch (error: any) {
      loading.value = false;
      Notify.create({
        message: `Failed to export ${this.name}`,
        color: "negative",
      });
    }

    return { loading, data };
  }

  public importExcel(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (data: any) => {
      const formdata = convertToFormData(data);
      try {
        loading.value = true;
        const res = await $fetch(baseApiUrl + this.url + "/import", {
          method: "post",
          body: formdata,
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
        Notify.create({
          message: "Data Uploaded, Refresh the page",
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
        Notify.create({
          message:
            JSON.stringify(error?.response?.data) || "Failed to Import Excel",
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
