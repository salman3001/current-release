export default defineNuxtRouteMiddleware((to, from) => {
  const user = useCookie("user") as unknown as Ref<IUser>;

  if (!user.value) {
    return navigateTo("/auth/login" + `?next=${to.path}`);
  }

  if (user.value?.userType !== 'customer') {
    return abortNavigation();
  }
});
