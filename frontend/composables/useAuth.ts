export default function useAuth() {
  const user = useCookie("user");
  const token = useCookie("token");
  const socketToken = useCookie("socketToken");

  const hasRole = (name: string) => {
    if (user) {
      return user?.value.role?.name === name;
    } else {
      return false;
    }
  };

  const hasPermission = (name: permissions) => {
    if (user && user?.value.role?.name === "Super Admin") {
      return true;
    }

    if (user && user?.value.role?.is_active == 0) {
      return false;
    }

    if (user) {
      const permissionValid = user?.value.role?.permissions?.filter(
        (perm: any) => perm.name == name
      );

      if (permissionValid.length > 0) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  return {
    user,
    token,
    socketToken,
    hasPermission,
    hasRole,
  };
}
