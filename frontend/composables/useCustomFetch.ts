import { Notify } from "quasar";
import qs from 'qs'
import type { FetchContext } from 'ofetch'

export default function (): typeof $fetch {
  const config = useRuntimeConfig();

  const token = useCookie("token");

  const authorization = `Bearer ${toRaw(token.value)}`;

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

  const onRequest = (c: FetchContext<any, any>): void => {
    const queryString = qs.stringify(c.options.query)
    const newUrl = c.request + "?" + queryString
    c.options.query = {}
    c.request = newUrl
  }

  return $fetch.create({
    baseURL: config.public.baseApi,
    headers: {
      authorization,
    },
    onResponse: !process.server ? onResponse : undefined,
    onRequest: onRequest
  });
}
