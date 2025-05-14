import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatUrl = (url: string): string => {
  if (!url) return ""

  // Check if the URL already has a protocol
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("mailto:") || url.startsWith("tel:")) {
    return url
  }

  // If not, add https://
  return `https://${url}`
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
