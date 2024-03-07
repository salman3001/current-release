import { Notify } from "quasar";

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

  return $fetch.create({
    baseURL: config.public.baseApi,
    headers: {
      authorization,
    },
    onResponse: !process.server ? onResponse : undefined,
  });
}
