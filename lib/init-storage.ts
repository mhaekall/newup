import { ensureBucketsExist } from "./supabase-storage"

export async function initializeStorage() {
  try {
    console.log("Initializing storage...")
    await ensureBucketsExist()
    console.log("Storage initialization complete")
  } catch (error) {
    console.error("Error initializing storage:", error)
  }
}
