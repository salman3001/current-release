// https://nuxt.com/docs/api/configuration/nuxt-config

import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@pinia/nuxt", "nuxt-quasar-ui"],
  experimental: {
    defaults: {
      useAsyncData: {
        deep: false,
      },
      useFetch: {
        //
      },
    },
  },
  runtimeConfig: {
    public: {
      baseApi: "http://127.0.0.1:3333", // this must be http://127.0.0.1:3333 not localhost
      webBaseUrl: "http://127.0.0.1:3000/",
      vendorBaseUrl: "http://127.0.0.1:3001",
      adminBaseUrl: "http://127.0.0.1:3002",
    },
  },
  quasar: {
    plugins: ["Notify"],
    sassVariables: join(currentDir, "./assets/css/styles.scss"),
    cssAddon: true,
  },
  devServer: {},
  imports: {
    dirs: ["stores"],
  },
});
