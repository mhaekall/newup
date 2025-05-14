"use client"

import type React from "react"

import { lazy, Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

// Lazy load komponen berat
export const LazyImageUpload = lazy(() => import("@/components/image-upload"))
export const LazyTemplatePreview = lazy(() => import("@/components/template-preview"))

// Wrapper dengan Suspense
export function ImageUploadLazy(props: React.ComponentProps<typeof LazyImageUpload>) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      }
    >
      <LazyImageUpload {...props} />
    </Suspense>
  )
}

export function TemplatePreviewLazy(props: React.ComponentProps<typeof LazyTemplatePreview>) {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center p-4">
          <LoadingSpinner />
        </div>
      }
    >
      <LazyTemplatePreview {...props} />
    </Suspense>
  )
}
