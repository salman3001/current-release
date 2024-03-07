import type { AsyncData } from "#app";
import { FetchError, type FetchOptions } from "ofetch";
import { Notify } from "quasar";

export default function (
  url: string,
  opts?: FetchOptions
): Promise<AsyncData<unknown, FetchError<any> | null>> {
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

  return $fetch(config.public.baseApi + url, {
    onResponse: !process.server ? onResponse : undefined,
  });
}
