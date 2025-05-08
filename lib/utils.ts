import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a URL to ensure it has the proper protocol
 * @param url The URL to format
 * @returns The formatted URL
 */
export function formatUrl(url: string): string {
  if (!url) return ""

  // If the URL doesn't start with http:// or https://, add https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }

  return url
}

/**
 * Format a date to a readable string
 * @param date The date to format
 * @returns The formatted date string
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return ""

  const dateObj = typeof date === "string" ? new Date(date) : date
  return dateObj.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/**
 * Generate a random ID
 * @returns A random ID string
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9)
}

/**
 * Truncate a string to a maximum length
 * @param str The string to truncate
 * @param maxLength The maximum length
 * @returns The truncated string
 */
export function truncate(str: string, maxLength: number): string {
  if (!str) return ""
  if (str.length <= maxLength) return str
  return `${str.substring(0, maxLength)}...`
}

/**
 * Delay execution for a specified time
 * @param ms Milliseconds to delay
 * @returns A promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
