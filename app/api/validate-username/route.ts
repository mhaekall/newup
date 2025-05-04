import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { username, currentUserId } = await request.json()

    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 })
    }

    // Validate username format
    const usernameRegex = /^[a-z0-9_-]+$/
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        {
          error: "Username can only contain lowercase letters, numbers, underscores, and hyphens",
          available: false,
        },
        { status: 400 },
      )
    }

    // Check if username is already taken
    let query = supabase.from("profiles").select("id, user_id").eq("username", username)

    // If we have a current user ID, exclude that user's profile
    if (currentUserId) {
      query = query.neq("user_id", currentUserId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error checking username:", error)
      return NextResponse.json({ error: "Failed to check username availability" }, { status: 500 })
    }

    // If we found any profiles, the username is taken
    const available = data.length === 0

    return NextResponse.json({ available })
  } catch (error) {
    console.error("Error in validate-username route:", error)
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 })
  }
}
