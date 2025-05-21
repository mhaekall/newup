import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a URL by ensuring it has a protocol
 * @param url The URL to format
 * @returns The formatted URL with a protocol
 */
export function formatUrl(url: string): string {
  if (!url) return ""

  // Check if the URL already has a protocol
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  // Add https:// as the default protocol
  return `https://${url}`
}
