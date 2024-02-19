export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user");

  if (!user.value) {
    return abortNavigation();
  }

  if (!user.value?.is_admin === 1) {
    return abortNavigation();
  }
});
