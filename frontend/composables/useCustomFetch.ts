import type { AsyncData, UseFetchOptions } from "#app";
import { FetchError } from "ofetch";
import { Notify } from "quasar";

export default function <T>(
  url: string,
  opts?: UseFetchOptions<any> | undefined
): AsyncData<T, FetchError<any> | null> {
  const config = useRuntimeConfig();

  const onResponse = (ctx: any) => {
    const success = ctx.response._data?.success;
    const message = ctx.response._data?.message;

    if (message) {
      if (success) {
        Notify.create({
          message,
          icon: "done",
          color: "positive",
        });
      } else {
        Notify.create({
          message,
          icon: "warning",
          color: "negative",
        });
      }
    }
  };

  return useFetch(config.public.baseApi + url, {
    onResponse: !process.server ? onResponse : undefined,
    ...opts,
  });
}
