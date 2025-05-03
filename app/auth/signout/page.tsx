"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignOut() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    await signOut({ callbackUrl: "/" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Sign Out</CardTitle>
          <CardDescription>Are you sure you want to sign out?</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button onClick={handleSignOut} disabled={isLoading} variant="destructive">
            {isLoading ? "Signing out..." : "Sign Out"}
          </Button>
        </CardContent>
        <CardFooter className="text-center">
          <Button variant="outline" className="w-full" onClick={() => window.history.back()}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
