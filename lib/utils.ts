import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function formatUrl(url: string): string {
  if (!url) return ""

  let formattedUrl = url.trim()

  if (
    !formattedUrl.startsWith("http://") &&
    !formattedUrl.startsWith("https://") &&
    !formattedUrl.startsWith("mailto:") &&
    !formattedUrl.startsWith("tel:")
  ) {
    formattedUrl = "https://" + formattedUrl
  }

  return formattedUrl
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
