import type { UseFetchOptions } from "#app";
import qs from "qs";

export class BaseApiClass {
  url: string;
  name: string;

  public constructor(url: string, name: string) {
    (this.url = url), (this.name = name);
  }

  public index(query?: AdditionalParams, opt?: UseFetchOptions<any>) {
    const stringQuery = qs.stringify(query);
    return useFetch(this.url + `?${stringQuery}`, {
      ...opt,
    });
  }

  public show(
    id: string,
    query?: AdditionalParams,
    opt?: UseFetchOptions<any>
  ) {
    const stringQuery = qs.stringify(query, { encode: false });
    return useFetch(this.url + `/${id}?${stringQuery}`, {
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
        const res = await $fetch(this.url, {
          body: data,
          method: "post",
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

  public put(
    opt?: UseFetchOptions<any>,
    cb?: { onSuccess?: () => void; onError?: () => void }
  ) {
    const loading = ref(false);
    const execute = async (id: string, data: any) => {
      try {
        loading.value = true;
        const res = await $fetch(this.url + `/${id}`, {
          body: data,
          method: "put",
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        cb?.onError && cb?.onError();
        loading.value = false;
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
        const res = await $fetch(this.url + `/${id}`, {
          method: "delete",
          ...(opt as any),
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        cb?.onError && cb?.onError();
        loading.value = false;
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
      const res = await $fetch(this.url + "/export", {
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
        const res = await $fetch(this.url + "/import", {
          method: "post",
          body: formdata,
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
}
