import { Outlet } from "react-router-dom";
import backgroundImage from "../assets/background/square-flower.jpg";
import { MoonIcon, SunIcon } from "lucide-react";
import useThemeStore from "../store/useThemeStore";
import linearDarkLogo from "/DARK HORIZONTAL.png";
import linearLightLogo from "/LIGHT HORIZONTAL.png";

const AuthLayout = () => {
  const { theme, setTheme } = useThemeStore();

  return (
    <div className="h-screen grid lg:grid-cols-2 py-5 px-8 bg-base-100">
        {/* Left Side */}
        <div className="relative items-center justify-center hidden lg:block rounded-badge"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
          <button onClick={setTheme} className="absolute top-4 left-4 btn btn-secondary rounded-full">
            {theme === "darkTheme" ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
          </button>
        </div>

        {/* Right Side */}
        <div className="flex justify-center rounded-badge">
          <div className="flex flex-col py-8 w-full max-w-md space-y-8 justify-center">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                <img
                  src={theme === "lightTheme" ? linearDarkLogo : linearLightLogo}
                  alt="Logo"
                  className="w-auto h-12 rounded-xl"
                />
                </div>
            </div>

            {/* Form Section */}
            <Outlet />
          </div>
        </div>
    </div>
  )
}

export default AuthLayout
