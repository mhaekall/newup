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
      }
      return token
    },
  },
  pages: {
    signIn: "/auth/signin",
    signOut: "/auth/signout",
    error: "/auth/error",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-secret-key",
}
