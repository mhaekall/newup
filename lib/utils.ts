import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatUrl(url: string): string {
  if (!url) return ""

  let formattedUrl = url

  // Check if the URL already has a protocol
  if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
    // If not, add https:// by default
    formattedUrl = `https://${url}`
  }

  return formattedUrl
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
