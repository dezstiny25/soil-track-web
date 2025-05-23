import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";

import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

const SignupForm = () => {
  const { signup, isSigningUp } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const validateForm = () => {
    if (!formData.username.trim()) return toast.error("Username is required");
    // if (!formData.email.includes("@nu-baliwag.edu.ph"))
    //   return toast.error("Email must be a valid @nu-baliwag.edu.ph address");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!formData.password.trim()) return toast.error("Password is required");
    if (formData.password.length < 8)
      return toast.error("Password must be at least 8 characters long");

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    <>
      <div className="flex flex-col justify-center text-center space-y-12">
        <h2 className="text-6xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-secondary to-accent">
          Create <br /> an Account
        </h2>

          <form onSubmit={handleSubmit} className="flex flex-col space-y-6">
            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="text"
                  className="input input-bordered rounded-xl w-full pl-10"
                  placeholder="Username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      username: e.target.value,
                    })
                  }
                  required
                />
              </div>
            </div>

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type="email"
                  className="input input-bordered rounded-xl w-full pl-10"
                  placeholder="Email"
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

            <div className="form-control">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-base-content/40" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className="input input-bordered rounded-xl w-full pl-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-base-content/40" />
                  ) : (
                    <Eye className="h-5 w-5 text-base-content/40" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn bg-primary text-white w-full hover:bg-secondary"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  {" "}
                  <Loader2 className="h-5 w-5 animate-spin" /> Loading...
                </>
              ) : (
                "Sign in"
              )}
            </button>

            <p className="text-center">
              By creating an account you agree to Tap In's{" "}
              <span className="text-secondary font-semibold">
                Terms of Services
              </span>{" "}
              and
              <span className="text-secondary font-semibold">
                {" "}
                Privacy Policy.{" "}
              </span>
            </p>
          </form>
        </div>
        

        {/* Sign Up Section */}
        <div className="text-center font-semibold">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-secondary cursor-pointer">
              Sign in
            </Link>
          </p>
        </div>
    </>
  );
};

export default SignupForm;
