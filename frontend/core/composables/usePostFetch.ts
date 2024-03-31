import { Notify } from "quasar";
import type { FetchContext } from "ofetch";

export default function (opt?: {
  disableToast?: boolean;
  onSuccess?: () => void;
  onError?: () => void;
}) {
  const config = useRuntimeConfig();
  const token = useCookie("token");
  const authorization = `Bearer ${toRaw(token.value)}`;
  const loading = ref(false);

  const onRequest = () => {
    loading.value = true;
  };

  const onResponse = (ctx: FetchContext<IResType<any>>) => {
    const success = ctx.response?._data?.success;

    loading.value = false;

    if (success == true) {
      opt?.onSuccess && opt?.onSuccess();
    } else if (success == false) {
      opt?.onError && opt?.onError();
    }

    if (opt?.disableToast !== true) {
      const success = ctx.response?._data?.success;
      const message = ctx.response?._data?.message;

      if (message) {
        if (success) {
          Notify.create({
            message,
            icon: "done",
            color: "positive",
            position: "top-right",
          });
        } else {
          Notify.create({
            message,
            icon: "warning",
            color: "negative",
            position: "top-right",
          });
        }
      }
    }
  };

  return {
    fetch: $fetch.create({
      baseURL: config.public.baseApi,
      headers: {
        authorization,
      },
      onResponse: !process.server ? onResponse : undefined,
      onRequest: !process.server ? onRequest : undefined,
    }),
    loading: loading,
  };
}
