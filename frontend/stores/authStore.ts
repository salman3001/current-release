import { defineStore } from "pinia";
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
      return res;
    } catch (error: any) {
      return null;
    }
  };

  const signup = async (form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    passwordConfirmation: string;
    bussinessName?: string;
    userType: "vendor" | "customer";
  }) => {
    try {
      const res = await $fetch("/api/auth/signup", {
        method: "post",
        body: form,
      });
      return res;
    } catch (error: any) {
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
      onSuccess && onSuccess();
    } catch (error: any) {}
  };

  const getOtp = (cb?: { onSuccess?: () => void; onError?: () => void }) => {
    const loading = ref(false);
    const execute = async (data: {
      email: string;
      userType: "vendor" | "customer" | "admin";
    }) => {
      try {
        loading.value = true;
        const res = await $fetch("/api/auth/get-otp", {
          method: "post",
          body: data,
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
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
        const res = await $fetch("/api/auth/verify-otp-update-password", {
          method: "post",
          body: data,
        });
        loading.value = false;
        cb?.onSuccess && cb?.onSuccess();
      } catch (error: any) {
        loading.value = false;
        cb?.onError && cb?.onError();
      }
    };
    return { execute, loading };
  };

  return {
    login,
    signup,
    getOtp,
    verifyOtpAndUpdatePWD,
    logout,
  };
});

export default authStore;
