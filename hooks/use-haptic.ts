"use client"

export function useHaptic() {
  const vibrate = (pattern: number | number[] = 50) => {
    if (typeof window !== "undefined" && "navigator" in window && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern)
        return true
      } catch (e) {
        console.error("Vibration failed:", e)
        return false
      }
    }
    return false
  }

  const success = () => vibrate([10, 50, 10])
  const error = () => vibrate([100, 30, 100, 30, 100])
  const warning = () => vibrate([30, 20, 30])
  const light = () => vibrate(15)
  const medium = () => vibrate(40)
  const heavy = () => vibrate(80)

  return {
    vibrate,
    success,
    error,
    warning,
    light,
    medium,
    heavy,
  }
}
