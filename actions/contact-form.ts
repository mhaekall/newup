"use server"

import { z } from "zod"

// Form validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
})

type ContactFormData = z.infer<typeof contactFormSchema>

export async function submitContactForm(formData: FormData) {
  try {
    // Extract form data
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const message = formData.get("message") as string
    const recipientEmail = formData.get("recipientEmail") as string

    // Validate form data
    const validatedData = contactFormSchema.parse({
      name,
      email,
      message,
    })

    // In a real implementation, you would send an email here
    // For example, using a service like SendGrid, Mailgun, or AWS SES
    console.log("Sending email to:", recipientEmail)
    console.log("From:", validatedData.email)
    console.log("Name:", validatedData.name)
    console.log("Message:", validatedData.message)

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return success response
    return {
      success: true,
      message: "Your message has been sent successfully!",
    }
  } catch (error) {
    console.error("Error submitting contact form:", error)

    if (error instanceof z.ZodError) {
      // Return validation errors
      return {
        success: false,
        message: "Please check your inputs and try again.",
        errors: error.errors,
      }
    }

    // Return generic error
    return {
      success: false,
      message: "Failed to send message. Please try again later.",
    }
  }
}
