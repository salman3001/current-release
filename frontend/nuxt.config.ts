// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["nuxt-icon", "@pinia/nuxt", "nuxt-quasar-ui"],
  runtimeConfig: {
    public: {
      baseApi: "http://localhost:3333",
    },
  },
  quasar: {
    plugins: ["Notify"],
    sassVariables: "./assets/css/styles.scss",
    cssAddon: true,
  },
});
