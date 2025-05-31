import { Routes, Route, Navigate } from "react-router-dom";

import { useAuthStore } from "./store/useAuthStore";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { Loader } from "lucide-react";

import DashboardPage from "./pages/DashboardPage";
import PlotsPage from "./pages/PlotPage";
import PlotListPage from "./pages/PlotListPage";
import PlotAnalysis from "./pages/PlotAnalysis";
import MainPage from "./pages/dashboard/MainPage";
import UserPage from "./pages/dashboard/UserPage";
import AuthLayout from "./pages/AuthLayout";
import LoginForm from "./pages/auth/LoginForm";
import SignupForm from "./pages/auth/SignupForm";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import useThemeStore from "./store/useThemeStore";
import WebDevices from "./pages/web_devices";


const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { theme } = useThemeStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />}>
          <Route index element={<Navigate to="dashboard" />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="users" element={<UserPage />} />
          <Route path="plots" element={<PlotListPage />} />
          <Route path="/plots/details/:plotId" element={<PlotsPage />} />
          <Route path="/plots/:plotId/analysis" element={<PlotAnalysis />} />
          <Route path="devices" element={<WebDevices />} />
        </Route>

        <Route path="/" element={!authUser ? <AuthLayout /> : <Navigate to="/" />}>
          <Route index element={<Navigate to="login" />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="signup" element={<SignupForm />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
