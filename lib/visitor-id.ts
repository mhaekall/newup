/**
 * Generates a unique visitor ID for tracking profile views
 * Uses a combination of timestamp and random string
 */
export function generateVisitorId(): string {
  // Check if we already have a visitor ID in localStorage
  const existingId = typeof window !== "undefined" ? localStorage.getItem("looqmy_visitor_id") : null

  if (existingId) {
    return existingId
  }

  // Generate a new ID if none exists
  const timestamp = Date.now().toString(36)
  const randomStr = Math.random().toString(36).substring(2, 8)
  const visitorId = `${timestamp}-${randomStr}`

  // Store in localStorage for future use
  if (typeof window !== "undefined") {
    localStorage.setItem("looqmy_visitor_id", visitorId)
  }

  return visitorId
}
