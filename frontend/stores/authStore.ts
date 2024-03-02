import { defineStore } from "pinia";
import { Notify } from "quasar";
import { ref } from "vue";

const authStore = defineStore("Auth", () => {
  const login = async (
    email: string,
    password: string,
    userType: "admin" | "vendor" | "customer"
  ) => {
    try {
      const res = await $fetch("/api/auth/login", {
        method: "post",
        body: { email, password, userType },
      });
      Notify.create({ message: "Login Successfull!", color: "positive" });
      return res;
    } catch (error: any) {
      Notify.create({ message: "Login Failed!", color: "red" });
      return null;
    }
  };

  const logout = async (
    userType: "admin" | "vendor" | "customer",
    onSuccess?: () => void
  ) => {
    try {
      await $fetch("/api/auth/logout", {
        method: "post",
        body: { userType },
      });
      Notify.create({
        message: "Logout Successfull!",
        color: "positive",
      });
      onSuccess && onSuccess();
      navigateTo(routes.auth.admin_login);
    } catch (error: any) {
      Notify.create({
        message: "Opps Something went wrong!",
        color: "negative",
      });
    }
  };

  const getOtp = (cb?: { onSuccess?: () => void; onError?: () => void }) => {
    const loading = ref(false);
    const execute = async (data: any) => {
      try {
        loading.value = true;
        const res = await $fetch("/api/auth/get-otp", {
          body: data,
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
        Notify.create({
          message: "OTP Sent",
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
        Notify.create({ message: "Otp Failed", color: "negative" });
      }
    };
    return { execute, loading };
  };

  const verifyOtpAndUpdatePWD = (cb?: {
    onSuccess?: () => void;
    onError?: () => void;
  }) => {
    const loading = ref(false);
    const execute = async (data: any) => {
      try {
        loading.value = true;
        const res = await $fetch("/api/auth/verify-otp-update-password", data);
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
        Notify.create({
          message: "Password Updated",
          color: "positive",
          icon: "done",
        });
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
        Notify.create({
          message: "Failed to update password.",
          color: "negative",
        });
      }
    };
    return { execute, loading };
  };

  return {
    login,
    getOtp,
    verifyOtpAndUpdatePWD,
    logout,
  };
});

export default authStore;
