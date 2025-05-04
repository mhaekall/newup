"use client"

import { useState, useEffect } from "react"
import { useDebounce } from "./use-debounce"

export function useUsernameValidation(username: string) {
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const debouncedUsername = useDebounce(username, 500)

  useEffect(() => {
    // Reset state when username changes
    if (username !== debouncedUsername) {
      setIsAvailable(null)
      setError(null)
    }

    // Don't check if username is too short
    if (!debouncedUsername || debouncedUsername.length < 3) {
      setIsAvailable(null)
      setError(debouncedUsername ? "Username terlalu pendek" : null)
      return
    }

    // Validate username format
    if (!/^[a-z0-9_-]+$/i.test(debouncedUsername)) {
      setIsAvailable(false)
      setError("Username hanya boleh berisi huruf, angka, underscore, dan dash")
      return
    }

    async function checkUsername() {
      setIsChecking(true)
      setError(null)

      try {
        const response = await fetch(`/api/validate-username?username=${encodeURIComponent(debouncedUsername)}`)
        const data = await response.json()

        if (response.ok) {
          setIsAvailable(data.available)
          setError(data.available ? null : "Username sudah digunakan")
        } else {
          setError(data.message || "Gagal memeriksa username")
          setIsAvailable(null)
        }
      } catch (err) {
        console.error("Error checking username:", err)
        setError("Gagal memeriksa username")
        setIsAvailable(null)
      } finally {
        setIsChecking(false)
      }
    }

    checkUsername()
  }, [debouncedUsername])

  return { isAvailable, isChecking, error }
}
