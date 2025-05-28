import {
  BarChart3,
  LayoutDashboard,
  Settings,
  UserCircle2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import NavbarItem from "./NavbarItem";
import { useAuthStore } from "../../store/useAuthStore";
import ConfirmModal from "../modal/ConfirmModal";

export default function NavbarItemsList() {
  const { authUser, logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  const initials = authUser?.username
    ? authUser.username
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "AB";

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navItems = (
    <>
      <NavbarItem
        icon={<LayoutDashboard size={16} />}
        text="Dashboard"
        active={currentPath === "/dashboard"}
        alert={false}
        onClick={() => navigate("/dashboard")}
      />
      <NavbarItem
        icon={<BarChart3 size={16} />}
        text="Plots"
        active={
          currentPath.startsWith("/plots") || currentPath.startsWith("/plot-analysis")
        }
        alert={false}
        onClick={() => navigate("/plots")}
      />
      <NavbarItem
        icon={<UserCircle2 size={16} />}
        text="Devices"
        active={currentPath === "/devices"}
        alert={false}
        onClick={() => navigate("/devices")}
      />
      <NavbarItem
        icon={<Settings size={16} />}
        text="Settings"
        active={currentPath === "/settings"}
        alert={false}
        onClick={() => navigate("/settings")}
      />
    </>
  );

  const dropdown = (
  <div className="relative" ref={dropdownRef}>
    <button
      onClick={toggleDropdown}
      className="flex items-center space-x-2 bg-gray-200 text-black px-2 py-1 rounded-full"
    >
      <span className="bg-gray-400 text-white font-semibold rounded-full w-8 h-8 flex items-center justify-center">
        {initials}
      </span>
      <svg
        className="w-4 h-4 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>

    {dropdownOpen && (
      <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded shadow-lg z-50">
        <button
          onClick={() => {
            setDropdownOpen(false);
            navigate("/ProfileSettings");
          }}
          className="block w-full px-4 py-2 text-left hover:bg-gray-200"
        >
          Profile Settings
        </button>
        <button
          onClick={() => {
            setDropdownOpen(false);
            navigate("/Account");
          }}
          className="block w-full px-4 py-2 text-left hover:bg-gray-200"
        >
          Account
        </button>
        <hr className="my-1" />
        <button
          onClick={() => {
            setDropdownOpen(false);
            setShowLogoutModal(true);
          }}
          className="block w-full px-4 py-2 text-left hover:bg-gray-200"
        >
          Logout
        </button>
      </div>
    )}
  </div>
);


  return (
    <>
      <Navbar userInitials={initials} dropdown={dropdown}>
        {navItems}
      </Navbar>

      <ConfirmModal
         title="Confirm Logout"
        message="Are you sure you want to logout?"
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        confirmText="Logout"
        cancelText="Cancel"
      />
    </>
  );
}
