import type React from "react"
import Image from "next/image"

interface ProfileBannerProps {
  bannerUrl?: string
  color?: string
  pattern?: "waves" | "dots" | "lines" | "none"
  height?: number
  className?: string
}

export const ProfileBanner: React.FC<ProfileBannerProps> = ({
  bannerUrl,
  color = "#f43f5e", // rose-500 default
  pattern = "waves",
  height = 200,
  className = "",
}) => {
  // Jika ada URL banner, gunakan gambar
  if (bannerUrl) {
    return (
      <div className={`relative w-full overflow-hidden ${className}`} style={{ height: `${height}px` }}>
        <Image src={bannerUrl || "/placeholder.svg"} alt="Profile banner" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black bg-opacity-20" />
      </div>
    )
  }

  // Jika tidak ada URL, gunakan warna dengan pattern
  let patternStyle = {}

  switch (pattern) {
    case "waves":
      patternStyle = {
        backgroundImage: `
          linear-gradient(135deg, ${color} 25%, transparent 25%),
          linear-gradient(225deg, ${color} 25%, transparent 25%),
          linear-gradient(45deg, ${color} 25%, transparent 25%),
          linear-gradient(315deg, ${color} 25%, ${adjustColor(color, -20)} 25%)
        `,
        backgroundPosition: "40px 0, 40px 0, 0 0, 0 0",
        backgroundSize: "80px 80px",
        backgroundRepeat: "repeat",
      }
      break
    case "dots":
      patternStyle = {
        backgroundImage: `radial-gradient(${adjustColor(color, 20)} 2px, transparent 2px)`,
        backgroundSize: "20px 20px",
      }
      break
    case "lines":
      patternStyle = {
        backgroundImage: `linear-gradient(90deg, ${adjustColor(color, 20)} 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }
      break
    default:
      patternStyle = { backgroundColor: color }
  }

  return (
    <div
      className={`w-full ${className}`}
      style={{
        height: `${height}px`,
        backgroundColor: color,
        ...patternStyle,
      }}
    />
  )
}

// Fungsi untuk menyesuaikan warna (membuat lebih terang atau lebih gelap)
function adjustColor(color: string, amount: number): string {
  // Jika warna dalam format hex
  if (color.startsWith("#")) {
    return adjustHexColor(color, amount)
  }

  // Jika warna dalam format rgb/rgba
  if (color.startsWith("rgb")) {
    return color // Untuk sederhananya, kita tidak mengubah rgb/rgba
  }

  return color
}

function adjustHexColor(color: string, amount: number): string {
  let hex = color.replace("#", "")

  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2]
  }

  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  const adjustedR = Math.max(0, Math.min(255, r + amount))
  const adjustedG = Math.max(0, Math.min(255, g + amount))
  const adjustedB = Math.max(0, Math.min(255, b + amount))

  return `#${adjustedR.toString(16).padStart(2, "0")}${adjustedG.toString(16).padStart(2, "0")}${adjustedB.toString(16).padStart(2, "0")}`
}
