"use client"

export async function shareProfile(username: string, name: string) {
  const shareData = {
    title: `${name}'s Portfolio`,
    text: `Check out ${name}'s portfolio on Looqmy!`,
    url: `${window.location.origin}/${username}`,
  }

  try {
    if (navigator.share) {
      // Use Web Share API if available
      await navigator.share(shareData)
      return { success: true }
    } else {
      // Fallback to copying link to clipboard
      await navigator.clipboard.writeText(shareData.url)
      return { success: true, method: "clipboard" }
    }
  } catch (error) {
    console.error("Error sharing profile:", error)
    return { success: false, error }
  }
}
