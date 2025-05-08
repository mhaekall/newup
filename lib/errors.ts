// Custom error class for the application
export class AppError extends Error {
  public statusCode: number
  public code: string
  public details?: any

  constructor(message: string, statusCode = 500, code = "INTERNAL_ERROR", details?: any) {
    super(message)
    this.name = "AppError"
    this.statusCode = statusCode
    this.code = code
    this.details = details

    // For proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError)
    }
  }
}

// Error codes
export const ErrorCodes = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SUPABASE_ERROR: "SUPABASE_ERROR",
  STORAGE_ERROR: "STORAGE_ERROR",
  NETWORK_ERROR: "NETWORK_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  SERVER_ERROR: "SERVER_ERROR",
}

// Function to handle Supabase errors
export function handleSupabaseError(error: any): AppError {
  console.error("Supabase error:", error)

  // Check if error is a PostgreSQL error
  if (error?.code && typeof error.code === "string" && error.code.startsWith("P")) {
    // Handle PostgreSQL errors
    switch (error.code) {
      case "P0001": // Raise exception
        return new AppError(error.message || "Database exception", 400, ErrorCodes.SUPABASE_ERROR, error)
      case "P0002": // No data found
        return new AppError(error.message || "Data not found", 404, ErrorCodes.NOT_FOUND, error)
      case "23505": // Unique violation
        return new AppError(error.message || "Data already exists", 409, ErrorCodes.CONFLICT, error)
      case "23503": // Foreign key violation
        return new AppError(error.message || "Related data not found", 400, ErrorCodes.VALIDATION_ERROR, error)
      default:
        return new AppError(error.message || "Database error", 500, ErrorCodes.SUPABASE_ERROR, error)
    }
  }

  // Handle Supabase auth errors
  if (error?.status) {
    switch (error.status) {
      case 400:
        return new AppError(error.message || "Bad request", 400, ErrorCodes.VALIDATION_ERROR, error)
      case 401:
        return new AppError(error.message || "Unauthorized", 401, ErrorCodes.UNAUTHORIZED, error)
      case 403:
        return new AppError(error.message || "Forbidden", 403, ErrorCodes.FORBIDDEN, error)
      case 404:
        return new AppError(error.message || "Not found", 404, ErrorCodes.NOT_FOUND, error)
      case 409:
        return new AppError(error.message || "Conflict", 409, ErrorCodes.CONFLICT, error)
      default:
        return new AppError(error.message || "Supabase error", 500, ErrorCodes.SUPABASE_ERROR, error)
    }
  }

  // Handle PGRST errors
  if (error?.code === "PGRST116") {
    return new AppError("Resource not found", 404, ErrorCodes.NOT_FOUND, error)
  }

  // Default error
  return new AppError(error?.message || "An unexpected error occurred", 500, ErrorCodes.INTERNAL_ERROR, error)
}

// Function to handle validation errors from Zod
export function handleValidationError(error: any): AppError {
  return new AppError("Validation error", 400, ErrorCodes.VALIDATION_ERROR, error.errors || error)
}
