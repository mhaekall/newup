import { Suspense } from "react"
import HomeClient from "@/components/home-client"
import { PageLoading } from "@/components/ui/page-loading"

export default function Home() {
  return (
    <Suspense fallback={<PageLoading />}>
      <HomeClient />
    </Suspense>
  )
}
