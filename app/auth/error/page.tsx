"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  let errorMessage = "An unknown error occurred during authentication."

  if (error === "OAuthSignin") errorMessage = "Error in the OAuth sign-in process."
  if (error === "OAuthCallback") errorMessage = "Error in the OAuth callback process."
  if (error === "OAuthCreateAccount") errorMessage = "Error creating the OAuth account."
  if (error === "EmailCreateAccount") errorMessage = "Error creating the email account."
  if (error === "Callback") errorMessage = "Error in the callback handler."
  if (error === "OAuthAccountNotLinked") errorMessage = "This email is already associated with another account."
  if (error === "EmailSignin") errorMessage = "Error sending the email sign-in link."
  if (error === "CredentialsSignin") errorMessage = "Invalid credentials."
  if (error === "SessionRequired") errorMessage = "You must be signed in to access this page."

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-red-600">Authentication Error</CardTitle>
          <CardDescription>{errorMessage}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600">Please try again or contact support if the problem persists.</p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link href="/auth/signin">
            <Button>Return to Sign In</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
