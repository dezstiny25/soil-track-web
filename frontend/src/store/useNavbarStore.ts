import { create } from "zustand";

interface NavbarState {
  expanded: boolean;
  toggleExpanded: () => void;
}

export const useNavbarStore = create<NavbarState>((set) => ({
  expanded: true,
  toggleExpanded: () => set((state) => ({ expanded: !state.expanded })),
}));
