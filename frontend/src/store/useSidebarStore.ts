import { create } from "zustand";

interface SidebarState {
  expanded: boolean;
  toggleExpanded: () => void;
}

export const useSidebarStore = create<SidebarState>((set) => ({
  expanded: true,
  toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),
}));
