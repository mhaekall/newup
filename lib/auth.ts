import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { supabase } from "./supabase"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        try {
          // Check if user exists in our database
          const { data: existingUser } = await supabase.from("users").select("*").eq("id", user.id).single()

          if (!existingUser) {
            // Create a new user record
            await supabase.from("users").insert([
              {
                id: user.id,
                email: user.email,
                name: user.name,
                image: user.image,
                created_at: new Date().toISOString(),
              },
            ])
          }
        } catch (error) {
          console.error("Error in jwt callback:", error)
          // Continue even if there's an error with Supabase
          // This prevents authentication from failing if the database operation fails
        }
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}
