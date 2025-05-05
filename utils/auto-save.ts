"use client"

import { useState, useEffect, useRef } from "react"

export function useAutoSave<T>(
  data: T,
  saveFunction: (data: T) => Promise<void>,
  delay = 1000,
): {
  isSaving: boolean
  lastSaved: Date | null
  saveNow: () => Promise<void>
} {
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const dataRef = useRef<T>(data)

  // Update the ref when data changes
  useEffect(() => {
    dataRef.current = data
  }, [data])

  // Setup auto-save
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(async () => {
      setIsSaving(true)
      try {
        await saveFunction(dataRef.current)
        setLastSaved(new Date())
      } catch (error) {
        console.error("Auto-save failed:", error)
      } finally {
        setIsSaving(false)
      }
    }, delay)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [data, saveFunction, delay])

  const saveNow = async () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    setIsSaving(true)
    try {
      await saveFunction(dataRef.current)
      setLastSaved(new Date())
    } catch (error) {
      console.error("Manual save failed:", error)
    } finally {
      setIsSaving(false)
    }
  }

  return { isSaving, lastSaved, saveNow }
}
