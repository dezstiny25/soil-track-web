import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

import { Loader2, Mail } from "lucide-react";
import backgroundImage from "../../assets/background/DRAFT.png";
import linearLogo from "/DARK HORIZONTAL.png";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
  });
  const { forgotPassword, isForgotPassword } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    forgotPassword(formData.email);
  };

  return (
    <div
      className="h-screen grid lg:grid-cols-2 p-8 bg-blue-500"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Left Side */}
      <div className="items-center justify-center hidden lg:block"></div>

      {/* Right Side */}
      <div className="flex items-center justify-center bg-white rounded-badge p-8">
        <div className="flex flex-col w-full max-w-md p-8 space-y-8 justify-between">
          {/* Logo Section */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 group mb-12">
              <img
                src={linearLogo}
                alt="Logo"
                className="w-auto h-12 rounded-xl"
              />
            </div>
            <h2 className="text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-blue-500">
              Forgot <br /> Password
            </h2>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered rounded-xl w-full pl-10"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn bg-primary text-white w-full hover:bg-secondary"
              disabled={isForgotPassword}
            >
              {isForgotPassword ? (
                <>
                  {" "}
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading...
                </>
              ) : (
                "Send Reset Link"
              )}
            </button>
          </form>
          <p className="text-center">
            <a href="/login" className="text-primary">
              Go back to login{" "}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
