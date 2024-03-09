export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user") as unknown as Ref<IAdminUser>;

  if (!user.value) {
    return navigateTo("/auth/admin/login" + `?next=${to.path}`);
  }

  if (user.value?.userType !== 'admin') {
    return abortNavigation();
  }
});
