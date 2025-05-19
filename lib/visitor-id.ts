/**
 * Generate a unique visitor ID based on browser fingerprinting
 * This is a simple implementation and could be enhanced with more robust fingerprinting
 * @returns A unique visitor ID
 */
export function generateVisitorId(): string {
  // Use available browser information to create a fingerprint
  const userAgent = navigator.userAgent
  const language = navigator.language
  const screenWidth = window.screen.width
  const screenHeight = window.screen.height
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const colorDepth = window.screen.colorDepth

  // Combine the values and hash them
  const fingerprint = `${userAgent}-${language}-${screenWidth}x${screenHeight}-${timeZone}-${colorDepth}`

  // Simple hash function
  let hash = 0
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = (hash << 5) - hash + char
    hash = hash & hash // Convert to 32bit integer
  }

  // Convert to a string and ensure it's positive
  return Math.abs(hash).toString(16)
}
