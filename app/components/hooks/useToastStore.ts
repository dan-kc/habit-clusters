import { create } from "zustand";

interface Store {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const useToastStore = create<Store>((set) => ({
  open: false,
  setOpen: (open: boolean) => set({ open }),
}));

export default useToastStore;
