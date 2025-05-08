import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { updateUserImage } from "@/lib/services/profile-service"

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
