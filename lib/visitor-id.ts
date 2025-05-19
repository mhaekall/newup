import { v4 as uuidv4 } from "uuid"

/**
 * Generates a visitor ID or retrieves an existing one from localStorage
 */
export function generateVisitorId(): string {
  // Check if we're in a browser environment
  if (typeof window === "undefined") {
    return uuidv4()
  }

  // Try to get existing visitor ID from localStorage
  const existingId = localStorage.getItem("visitor_id")

  if (existingId) {
    return existingId
  }

  // Generate a new ID if none exists
  const newId = uuidv4()

  // Store in localStorage for future visits
  try {
    localStorage.setItem("visitor_id", newId)
  } catch (error) {
    console.error("Error storing visitor ID:", error)
  }

  return newId
}
