// Custom error class untuk aplikasi
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public status = 400,
  ) {
    super(message)
    this.name = "AppError"
  }
}

// Error codes
export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  SERVER_ERROR: "SERVER_ERROR",
  SUPABASE_ERROR: "SUPABASE_ERROR",
}

// Helper untuk menangani error dari Supabase
export function handleSupabaseError(error: any): AppError {
  console.error("Supabase error:", error)

  // Check for specific error codes
  if (error?.code === "23505") {
    // Unique constraint violation
    return new AppError(ErrorCodes.CONFLICT, "A record with this value already exists", 409)
  }

  if (error?.code === "42P01") {
    // Undefined table
    return new AppError(ErrorCodes.SERVER_ERROR, "Database configuration error", 500)
  }

  if (error?.code === "42501") {
    // Insufficient privileges
    return new AppError(ErrorCodes.FORBIDDEN, "You don't have permission to perform this action", 403)
  }

  // Default error
  return new AppError(ErrorCodes.SUPABASE_ERROR, error?.message || "An error occurred with the database", 500)
}
