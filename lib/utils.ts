import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const formatUrl = (url: string) => {
  if (!url) return ""

  // Jika URL tidak dimulai dengan http:// atau https://, tambahkan https://
  if (!/^(https?:\/\/|mailto:|tel:)/i.test(url)) {
    return `https://${url}`
  }

  return url
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
