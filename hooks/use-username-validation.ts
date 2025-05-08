"use client"

import { useState, useEffect } from "react"
import { validateUsername } from "@/lib/supabase"
import { useDebounce } from "./use-debounce"

interface UseUsernameValidationProps {
  username: string
  currentUserId: string
  currentUsername?: string // Add this to check if it's the user's own username
  skipValidation?: boolean
}

export function useUsernameValidation({
  username,
  currentUserId,
  currentUsername,
  skipValidation = false,
}: UseUsernameValidationProps) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const debouncedUsername = useDebounce(username, 500)

  useEffect(() => {
    async function checkUsername() {
      if (!debouncedUsername || skipValidation) {
        setIsAvailable(null)
        setError(null)
        return
      }

      // If the username is the same as the current username, it's available
      if (debouncedUsername === currentUsername) {
        setIsAvailable(true)
        setError(null)
        return
      }

      setIsChecking(true)
      setError(null)

      try {
        const { available, message } = await validateUsername(debouncedUsername, currentUserId)
        setIsAvailable(available)
        setError(available ? null : message)
      } catch (error: any) {
        console.error("Error validating username:", error)
        setIsAvailable(false)
        setError(error.message || "Error checking username availability")
      } finally {
        setIsChecking(false)
      }
    }

    checkUsername()
  }, [debouncedUsername, currentUserId, currentUsername, skipValidation])

  return { isAvailable, isChecking, error }
}
