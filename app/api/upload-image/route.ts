import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { updateUserImage } from "@/lib/services/profile-service"

// Tambahkan rate limiting sederhana
const rateLimits = new Map<string, { count: number; timestamp: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_UPLOADS_PER_WINDOW = 10

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session || !session.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
    }

    // Get form data
    const formData = await request.formData()

    // Ensure the user can only upload their own image
    const userId = formData.get("userId") as string
    if (userId !== session.user.id) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 403 })
    }

    // Check rate limit
    const userRateLimit = rateLimits.get(userId) || { count: 0, timestamp: Date.now() }

    // Reset counter if window has passed
    if (Date.now() - userRateLimit.timestamp > RATE_LIMIT_WINDOW) {
      userRateLimit.count = 0
      userRateLimit.timestamp = Date.now()
    }

    // Check if user has exceeded rate limit
    if (userRateLimit.count >= MAX_UPLOADS_PER_WINDOW) {
      return NextResponse.json(
        { success: false, error: "Too many upload requests. Please try again later." },
        { status: 429 },
      )
    }

    // Increment counter
    userRateLimit.count++
    rateLimits.set(userId, userRateLimit)

    // Update the user's image
    const result = await updateUserImage(userId, formData)

    if (result.success) {
      return NextResponse.json({ success: true, imageUrl: result.imageUrl })
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in upload-image API route:", error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "An unknown error occurred" },
      { status: 500 },
    )
  }
}
