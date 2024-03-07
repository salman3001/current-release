// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-icon", "@pinia/nuxt", "nuxt-quasar-ui"],
  runtimeConfig: {
    public: {
      baseApi: "http://127.0.0.1:3333", // this must be http://127.0.0.1:3333 not localhost
    },
  },
  quasar: {
    plugins: ["Notify"],
    sassVariables: "./assets/css/styles.scss",
    cssAddon: true,
  },
  devServer: {},
});
