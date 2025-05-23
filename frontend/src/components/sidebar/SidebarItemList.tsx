import {
  BarChart3,
  Boxes,
  LayoutDashboard,
  LogOut,
  Settings,
  UserCircle2,
} from "lucide-react";
import Sidebar from "./Sidebar";
import SidebarItem from "./SidebarItem";
import { useAuthStore } from "../../store/useAuthStore";
import { useState } from "react";
import ConfirmModal from "../modal/ConfirmModal";
import { useLocation, useNavigate } from "react-router-dom";

export default function SidebarItemsList() {
  const { logout } = useAuthStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname;

  const handleLogout = () => {
    logout();
    setShowLogoutModal(false);
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar>
        <SidebarItem
          icon={<LayoutDashboard size={20} />}
          text="Dashboard"
          active={currentPath === "/dashboard"}
          alert={false}
          onClick={() => navigate("/dashboard")}
        />
        <SidebarItem
          icon={<BarChart3 size={20} />}
          text="Statistics"
          active={false}
          alert={false}
        />
        <SidebarItem
          icon={<UserCircle2 size={20} />}
          text="Users"
          active={currentPath === "/users"}
          alert={false}
          onClick={() => navigate("/users")}
        />
        <SidebarItem
          icon={<Boxes size={20} />}
          text="Inventory"
          active={false}
          alert={false}
        />
        <hr className="my-3" />
        <SidebarItem
          icon={<Settings size={20} />}
          text="Settings"
          active={false}
          alert={false}
        />
        <SidebarItem
          icon={<LogOut size={20} />}
          text="Logout"
          active={false}
          alert={false}
          onClick={() => setShowLogoutModal(true)} // Show modal on click
        />
      </Sidebar>

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
