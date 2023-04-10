import { create } from 'zustand'

const DEVICE = {
  Small: 'Small',
  Medium: 'Medium',
  Large: 'Large',
} as const

type ObjectValue<T> = T[keyof T]
export type DeviceOptions = ObjectValue<typeof DEVICE>

interface Store {
  device: DeviceOptions
  setSmall: () => void
  setMedium: () => void
  setLarge: () => void
}

const useDeviceModeStore = create<Store>((set) => ({
  device: 'Small',
  setSmall: () => set({ device: 'Small' }),
  setMedium: () => set({ device: 'Medium' }),
  setLarge: () => set({ device: 'Large' }),
}))

export default useDeviceModeStore
