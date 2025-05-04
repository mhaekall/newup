import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Buat Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET(request: NextRequest) {
  // Dapatkan username dari query params
  const { searchParams } = new URL(request.url)
  const username = searchParams.get("username")

  // Validasi input
  if (!username) {
    return NextResponse.json({ message: "Username is required" }, { status: 400 })
  }

  try {
    // Cek apakah username sudah digunakan
    const { data, error } = await supabase.from("profiles").select("username").eq("username", username).maybeSingle()

    if (error) {
      console.error("Error checking username:", error)
      return NextResponse.json({ message: "Failed to check username" }, { status: 500 })
    }

    // Jika data ada, username sudah digunakan
    const isAvailable = !data

    return NextResponse.json({ available: isAvailable })
  } catch (err) {
    console.error("Unexpected error:", err)
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 })
  }
}
