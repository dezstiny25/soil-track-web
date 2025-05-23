import { ReactNode } from "react";

interface NavbarItemProps {
  icon: ReactNode;
  text: string;
  active: boolean;
  alert: boolean;
  onClick?: () => void;
}

export default function NavbarItem({ icon, text, active, alert, onClick }: NavbarItemProps) {
  return (
    <li
      onClick={onClick}
      className={`flex items-center gap-2 px-8 py-5 rounded-full text-sm cursor-pointer transition-colors
        ${active ? "bg-green-900 text-white" : "text-gray-700 hover:bg-gray-200"}`}
    >
      {icon}
      <span>{text}</span>
      {alert && <span className="w-2 h-2 rounded-full bg-red-500 ml-2" />}
    </li>
  );
}
