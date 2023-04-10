import { useEffect, useState } from 'react'
import useDeviceModeStore from '@stores/useDeviceModeStore'

interface WindowDimensions {
  width: number;
  height: number
};

export default function useUpdateDeviceMode() {

  const [windowDimensions, setWindowDimensions] = useState<WindowDimensions>({ width: 0, height: 0 })

  const setSmall = useDeviceModeStore((state) => state.setSmall)
  const setMedium = useDeviceModeStore((state) => state.setMedium)
  const setLarge = useDeviceModeStore((state) => state.setLarge)

  useEffect(() => {
    const set = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      setWindowDimensions({ width: width, height: height })
    }
    set()
    window.addEventListener('resize', set)

    return () => {
      window.removeEventListener('resize', set)
    }
  }, [])

  useEffect(() => {
    const width = windowDimensions.width

    if (width < 768) {
      setSmall()
    } else if (768 <= width && width < 1024) {
      setMedium()
    } else if (width >= 1024) {
      setLarge()
    }
  }, [windowDimensions])

  return
}
