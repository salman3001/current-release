export default defineNuxtRouteMiddleware((to, from) => {
    const user = useCookie("user") as unknown as Ref<IAdminUser | IUser | IVendorUser>;

    if (user.value) {
        if (user.value?.userType === 'admin') {
            return navigateTo(routes.admin.dashboard);
        }
        if (user.value?.userType === 'vendor') {
            return navigateTo(routes.vendor.dashboard);
        }

        if (user.value?.userType === 'customer') {
            return navigateTo(routes.home);
        }
    }

});
