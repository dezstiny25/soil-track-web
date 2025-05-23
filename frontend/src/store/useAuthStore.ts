/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { AxiosError } from "axios";

interface AuthState {
  authUser: { user_id: string; email: string; userFname: string; userLname: string } | null;
  isLoggingIn: boolean;
  isSigningUp: boolean;
  isCheckingAuth: boolean;
  isLoggingOut: boolean;
  isForgotPassword: boolean;
  isChangingPassword: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: { email: string; password: string }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (
    password: string,
    token: string,
    email: string
  ) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authUser: null,
  isLoggingIn: false,
  isSigningUp: false,
  isCheckingAuth: false,
  isForgotPassword: false,
  isChangingPassword: false,
  isLoggingOut: false,

  checkAuth: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await axiosInstance.post("/auth/check");
      set({ authUser: res.data });
      
    } catch (err) {
      console.error("Error during checkAuth:", err);
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });

    try {
      await axiosInstance.post("/auth/signup", data);
      toast.success("Signed up successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to sign up!";
      toast.error(errorMessage);
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (emailOrUsername: string, password: string) => {
    set({ isLoggingIn: true });

    try {
      const res = await axiosInstance.post("/auth/login", {
        emailOrUsername,
        password,
      });
      set({ authUser: res.data });
      toast.success("Logged in successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to log in!";
      toast.error(errorMessage);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  forgotPassword: async (email: string) => {
    set({ isForgotPassword: true });
    try {
      await axiosInstance.post("/auth/forgot-password", { email });
      toast.success("Password reset email sent successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to send password reset email!";
      toast.error(errorMessage);
    } finally {
      set({ isForgotPassword: false });
    }
  },

  resetPassword: async (password: string, token: string, email: string) => {
    set({ isChangingPassword: true });

    try {
      await axiosInstance.post("/auth/reset-password", {
        password,
        token,
        email,
      });
      toast.success("Password changed successfully!");
    } catch (err) {
      const error = err as AxiosError;
      const errorMessage =
        (error.response?.data as { message: string }).message ||
        "Failed to change password!";
      toast.error(errorMessage);
    } finally {
      set({ isChangingPassword: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    toast.loading("Logging out...");

    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.dismiss();
      toast.success("Logged out successfully!");
    } catch (err) {
      console.error("Error during logout:", err);
      toast.dismiss();
      toast.error("Failed to log out!");
    } finally {
      set({ isLoggingOut: false });
    }
  },
}));
