export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user") as unknown as Ref<IVendorUser>;

  if (!user.value) {
    return navigateTo("/auth/vendor/login" + `?next=${to.path}`);
  }

  if (user.value?.userType !== 'vendor') {
    return abortNavigation();
  }
});
