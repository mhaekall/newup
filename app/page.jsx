import { redirect } from "next/navigation"
import { defaultLocale } from "@/i18n.config"

// Redirect from / to /en or /id based on browser language
export default function Home() {
  redirect(`/${defaultLocale}`)
}
