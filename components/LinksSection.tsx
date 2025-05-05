"use client"

import type React from "react"
import { useState } from "react"
import { usePortfolio } from "@/context/PortfolioContext"
import type { Link } from "@/types/portfolio"
import { v4 as uuidv4 } from "uuid"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Link card component
const LinkCard: React.FC<{
  link: Link
  onUpdate: (id: string, data: Partial<Link>) => void
  onRemove: (id: string) => void
}> = ({ link, onUpdate, onRemove }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: link.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex items-center gap-3"
    >
      <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600 touch-manipulation">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
      </div>

      <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gray-100 flex items-center justify-center">
        {renderPlatformIcon(link.platform)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-gray-900 truncate">{link.platform}</div>
        <div className="text-sm text-gray-500 truncate">{link.url}</div>
      </div>

      <button
        type="button"
        onClick={() => onUpdate(link.id, { visible: !link.visible })}
        className={`p-2 rounded-full ${link.visible ? "text-blue-500 hover:bg-blue-50" : "text-gray-400 hover:bg-gray-50"}`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {link.visible ? (
            <>
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
              <circle cx="12" cy="12" r="3"></circle>
            </>
          ) : (
            <>
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
              <line x1="1" y1="1" x2="23" y2="23"></line>
            </>
          )}
        </svg>
      </button>

      <button
        type="button"
        onClick={() => onRemove(link.id)}
        className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
    </div>
  )
}

// Helper function to render platform icons
const renderPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#181717]" fill="currentColor">
          <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
        </svg>
      )
    case "linkedin":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#0A66C2]" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      )
    case "twitter":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#1DA1F2]" fill="currentColor">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      )
    case "instagram":
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#E4405F]" fill="currentColor">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
        </svg>
      )
    default:
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
        </svg>
      )
  }
}

// Add link form
const AddLinkForm: React.FC<{
  onAdd: (link: Omit<Link, "id">) => void
  onCancel: () => void
}> = ({ onAdd, onCancel }) => {
  const [platform, setPlatform] = useState("")
  const [url, setUrl] = useState("")
  const [error, setError] = useState("")

  const platforms = [
    "GitHub",
    "LinkedIn",
    "Twitter",
    "Instagram",
    "Facebook",
    "YouTube",
    "WhatsApp",
    "Telegram",
    "Email",
    "Website",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!platform) {
      setError("Please select a platform")
      return
    }

    if (!url) {
      setError("Please enter a URL")
      return
    }

    // Simple URL validation
    try {
      new URL(url)
    } catch (err) {
      if (!url.startsWith("mailto:") && !url.startsWith("tel:")) {
        setError("Please enter a valid URL")
        return
      }
    }

    onAdd({
      platform,
      url,
      icon: platform.toLowerCase(),
      visible: true,
    })

    setPlatform("")
    setUrl("")
    setError("")
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-4">
      <h3 className="font-medium text-gray-900">Add New Link</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="platform" className="block text-sm font-medium text-gray-700 mb-1">
            Platform
          </label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a platform</option>
            {platforms.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            URL
          </label>
          <input
            type="text"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://"
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Add Link
          </button>
        </div>
      </form>
    </div>
  )
}

export const LinksSection: React.FC = () => {
  const { portfolio, updateSection } = usePortfolio()
  const [showAddForm, setShowAddForm] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = portfolio.links.findIndex((link) => link.id === active.id)
      const newIndex = portfolio.links.findIndex((link) => link.id === over.id)

      const newLinks = [...portfolio.links]
      const [movedItem] = newLinks.splice(oldIndex, 1)
      newLinks.splice(newIndex, 0, movedItem)

      updateSection("links", newLinks)
    }
  }

  const handleUpdateLink = (id: string, data: Partial<Link>) => {
    const newLinks = portfolio.links.map((link) => (link.id === id ? { ...link, ...data } : link))
    updateSection("links", newLinks)
  }

  const handleRemoveLink = (id: string) => {
    const newLinks = portfolio.links.filter((link) => link.id !== id)
    updateSection("links", newLinks)
  }

  const handleAddLink = (linkData: Omit<Link, "id">) => {
    const newLink: Link = {
      id: uuidv4(),
      ...linkData,
    }
    updateSection("links", [...portfolio.links, newLink])
    setShowAddForm(false)
  }

  return (
    <div className="space-y-6">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={portfolio.links.map((link) => link.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {portfolio.links.map((link) => (
              <LinkCard key={link.id} link={link} onUpdate={handleUpdateLink} onRemove={handleRemoveLink} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {showAddForm ? (
        <AddLinkForm onAdd={handleAddLink} onCancel={() => setShowAddForm(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setShowAddForm(true)}
          className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-blue-300 hover:text-blue-600 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add New Link
        </button>
      )}
    </div>
  )
}
