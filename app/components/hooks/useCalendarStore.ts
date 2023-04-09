import { create } from 'zustand';

interface Store {
  date: string;
  setDate: (date: string) => void;
}

const currentDate = new Date().toISOString().slice(0, 10);

const useCalendarStore = create<Store>((set) => ({
  date: currentDate,
  setDate: (date: string) => set({ date: date }),
}));

export default useCalendarStore;
