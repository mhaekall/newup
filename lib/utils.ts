import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Generate a random ID for new profiles
export function generateId() {
  // Use crypto.randomUUID() if available (modern browsers and Node.js)
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID()
  }

  // Fallback for older environments
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// Validate URL format
export function isValidUrl(url: string) {
  if (!url) return false

  try {
    // Add protocol if missing
    const urlWithProtocol = !/^https?:\/\//i.test(url) ? `https://${url}` : url
    new URL(urlWithProtocol)
    return true
  } catch (e) {
    return false
  }
}

// Add http:// prefix if missing and ensure URL is valid
export function formatUrl(url: string) {
  if (!url) return ""

  // Trim whitespace
  url = url.trim()

  // Add protocol if missing
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`
  }

  // Validate URL
  try {
    new URL(url)
    return url
  } catch (e) {
    console.warn(`Invalid URL format: ${url}`)
    return url // Return as is, validation should catch this elsewhere
  }
}

// Sanitize HTML to prevent XSS
export function sanitizeHtml(html: string) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;")
}
