import { ReactNode } from "react";
import Logo from '../../assets/logos/green_logo.png';

interface NavbarProps {
  children: ReactNode;
  userInitials: string;
  dropdown: ReactNode;
}

export default function Navbar({ children, userInitials, dropdown }: NavbarProps) {
  return (
    <nav className="w-full bg-[#f9fbfc] flex items-center justify-between px-7 py-4">
      {/* Logo */}
      <div className="flex-shrink-0">
        <img src={Logo} alt="SoilTrack Logo" className="h-11 w-auto" />
      </div>

      {/* Center Nav Items */}
      <ul className="flex bg-[#f1f2f4] rounded-full px-1 py-1 space-x-2">
        {children}
      </ul>

      {/* Profile Dropdown */}
      <div className="relative">{dropdown}</div>
    </nav>
  );
}
