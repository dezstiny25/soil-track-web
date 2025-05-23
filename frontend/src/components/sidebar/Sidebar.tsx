import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";
import { ReactNode } from "react";

import tapInLogo from "/Linear Black.png";
import { useSidebarStore } from "../../store/useSidebarStore";
import { useAuthStore } from "../../store/useAuthStore";

interface SidebarProps {
  children: ReactNode;
}


export default function Sidebar({ children }: SidebarProps) {
  const { expanded, toggleExpanded } = useSidebarStore();
  const { authUser } = useAuthStore();

  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="px-4 py-6 flex justify-between items-center">
          <img
            src={tapInLogo}
            className={`overflow-hidden transition-all ${expanded ? "w-24" : "w-0"}`}
          />
          <button onClick={toggleExpanded} className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100">
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        <ul className="flex-1 px-3"> {children} </ul>

        <div className="border-t flex p-3">
          <img
            src="https://ui-avatars.com/api/?name=John+Doe"
            className="w-10 h-10 rounded-full"
          />
          <div
            className={`flex justify-between items-center overflow-hidden transition-all ${
              expanded ? "w-52 ml-3" : "w-0"}`}
          >
            <div className="leading-4">
              <h4 className="font-semibold">{authUser?.username || "Guest User"}</h4>
              <span className="text-xs text-gray-600">{authUser?.email || "sample@gmail.com"}</span>
            </div>
            <MoreVertical size={20} />
          </div>
        </div>
      </nav>
    </aside>
  );
}


