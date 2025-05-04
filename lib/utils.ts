import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Fungsi untuk menggabungkan class Tailwind
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Fungsi untuk memformat URL dengan benar
export function formatUrl(url: string): string {
  if (!url) return ""

  // Jika URL tidak dimulai dengan http:// atau https://, tambahkan https://
  if (!/^https?:\/\//i.test(url)) {
    return `https://${url}`
  }

  return url
}

// Fungsi untuk memvalidasi URL
export function isValidUrl(url: string): boolean {
  if (!url) return false

  try {
    // Tambahkan protokol jika tidak ada
    const urlWithProtocol = formatUrl(url)
    new URL(urlWithProtocol)
    return true
  } catch (e) {
    return false
  }
}

// Fungsi untuk mendapatkan nama domain dari URL
export function getDomainFromUrl(url: string): string {
  if (!url) return ""

  try {
    // Tambahkan protokol jika tidak ada
    const urlWithProtocol = formatUrl(url)
    const { hostname } = new URL(urlWithProtocol)
    return hostname
  } catch (e) {
    return ""
  }
}

// Fungsi untuk memformat tanggal
export function formatDate(dateString: string): string {
  if (!dateString) return ""

  const date = new Date(dateString)
  return date.toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Fungsi untuk memformat durasi (misalnya untuk pengalaman atau pendidikan)
export function formatDuration(startDate: string, endDate?: string, current?: boolean): string {
  if (!startDate) return ""

  const start = new Date(startDate)
  const end = current ? new Date() : endDate ? new Date(endDate) : null

  const startYear = start.getFullYear()
  const startMonth = start.toLocaleDateString("id-ID", { month: "short" })

  if (!end) {
    return `${startMonth} ${startYear}`
  }

  const endYear = end.getFullYear()
  const endMonth = end.toLocaleDateString("id-ID", { month: "short" })

  if (current) {
    return `${startMonth} ${startYear} - Sekarang`
  }

  return `${startMonth} ${startYear} - ${endMonth} ${endYear}`
}

// Fungsi untuk menghasilkan inisial dari nama
export function getInitials(name: string): string {
  if (!name) return ""

  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

// Fungsi untuk memvalidasi file gambar
export function isValidImageFile(file: File): boolean {
  const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"]
  return validTypes.includes(file.type)
}

// Fungsi untuk memformat ukuran file
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes"

  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
}
