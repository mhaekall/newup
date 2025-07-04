import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Buat Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Simple cache for username validation
const usernameCache = new Map<string, { available: boolean; timestamp: number }>()
const CACHE_TTL = 30 * 1000 // 30 seconds cache

export async function GET(request: NextRequest) {
  // Dapatkan username dari query params
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")
  const currentUserId = searchParams.get("currentUserId")

  // Validasi input
  if (!username) {
    return NextResponse.json({ message: "Username is required" }, { status: 400 })
  }

  // Validasi format username
  if (!/^[a-z0-9_-]+$/i.test(username)) {
    return NextResponse.json(
      { available: false, message: "Username hanya boleh berisi huruf, angka, underscore, dan dash" },
      { status: 200 },
    )
  }

  try {
    // Generate cache key
    const cacheKey = `${username}:${currentUserId || "guest"}`

    // Check cache first
    const cachedResult = usernameCache.get(cacheKey)
    if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
      console.log(`Using cached result for username: ${username}`)
      return NextResponse.json({ available: cachedResult.available })
    }

    // Cek apakah username sudah digunakan
    let query = supabase.from("profiles").select("id, user_id").eq("username", username)

    // Jika ada currentUserId, exclude profile milik user tersebut
    if (currentUserId) {
      query = query.neq("user_id", currentUserId)
    }

    const { data, error } = await query.maybeSingle()

    if (error) {
      console.error("Error checking username:", error)
      return NextResponse.json({ message: "Failed to check username" }, { status: 500 })
    }

    // Jika data ada, username sudah digunakan oleh user lain
    const isAvailable = !data

    // Update cache
    usernameCache.set(cacheKey, { available: isAvailable, timestamp: Date.now() })

    return NextResponse.json({ available: isAvailable })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
