import { useEffect, useState } from 'react'

/**
 * Returns `true` when the device/window is in landscape orientation.
 */
export function useOrientation() {
  const getIsLandscape = () => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(orientation: landscape)').matches
  }

  const [isLandscape, setIsLandscape] = useState(getIsLandscape)

  useEffect(() => {
    const mql = window.matchMedia('(orientation: landscape)')
    const handler = (e) => setIsLandscape(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return { isLandscape }
}
