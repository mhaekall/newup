"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "./use-debounce"

interface UseUsernameValidationProps {
  username: string
  currentUserId?: string
  enabled?: boolean
}

interface ValidationResult {
  isValid: boolean
  isAvailable: boolean | null
  isChecking: boolean
  error: string | null
}

export function useUsernameValidation({
  username,
  currentUserId,
  enabled = true,
}: UseUsernameValidationProps): ValidationResult {
  const [isChecking, setIsChecking] = useState(false)
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Debounce the username to avoid too many API calls
  const debouncedUsername = useDebounce(username, 500)

  // Basic validation
  const isValidFormat = /^[a-z0-9_-]+$/.test(username)
  const isValidLength = username.length >= 3 && username.length <= 30
  const isValid = isValidFormat && isValidLength

  useEffect(() => {
    // Reset state when username changes
    setIsAvailable(null)
    setError(null)

    // Don't check if validation is disabled or username is invalid
    if (!enabled || !isValid || !debouncedUsername) {
      return
    }

    async function checkAvailability() {
      setIsChecking(true)

      try {
        const response = await fetch("/api/validate-username", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: debouncedUsername,
            currentUserId,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          setError(data.error || "Failed to check username availability")
          setIsAvailable(null)
        } else {
          setIsAvailable(data.available)
          setError(data.available ? null : `Username '${debouncedUsername}' is already taken`)
        }
      } catch (error) {
        console.error("Error checking username availability:", error)
        setError("Failed to check username availability")
        setIsAvailable(null)
      } finally {
        setIsChecking(false)
      }
    }

    checkAvailability()
  }, [debouncedUsername, currentUserId, enabled, isValid])

  return {
    isValid,
    isAvailable,
    isChecking,
    error:
      !isValidFormat && username
        ? "Username can only contain lowercase letters, numbers, underscores, and hyphens"
        : !isValidLength && username
          ? "Username must be between 3 and 30 characters"
          : error,
  }
}
