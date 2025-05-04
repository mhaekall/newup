"use client"
import type { Profile, Link } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface LinksStepProps {
  profile: Profile
  updateProfile: (data: Partial<Profile>) => void
}

export function LinksStep({ profile, updateProfile }: LinksStepProps) {
  const handleLinkChange = (index: number, field: keyof Link, value: string) => {
    const updatedLinks = [...profile.links]
    updatedLinks[index] = { ...updatedLinks[index], [field]: value }
    updateProfile({ links: updatedLinks })
  }

  const addLink = () => {
    updateProfile({
      links: [...profile.links, { label: "", url: "", icon: "" }],
    })
  }

  const removeLink = (index: number) => {
    const updatedLinks = [...profile.links]
    updatedLinks.splice(index, 1)
    updateProfile({ links: updatedLinks })
  }

  // Auto-detect social media icon when URL changes
  const handleUrlChange = (index: number, value: string) => {
    // Format URL properly
    const formattedUrl = value.trim()

    // Update the URL
    handleLinkChange(index, "url", formattedUrl)

    // Auto-detect icon if URL is not empty
    if (formattedUrl) {
      const icon = getSocialIcon(formattedUrl)
      handleLinkChange(index, "icon", icon)
    }
  }

  // Social media icon mapping
  const getSocialIcon = (url: string): string => {
    const domain = url.toLowerCase()
    if (domain.includes("github")) return "github"
    if (domain.includes("linkedin")) return "linkedin"
    if (domain.includes("twitter") || domain.includes("x.com")) return "twitter"
    if (domain.includes("instagram")) return "instagram"
    if (domain.includes("facebook")) return "facebook"
    if (domain.includes("youtube")) return "youtube"
    if (domain.includes("medium")) return "medium"
    if (domain.includes("dribbble")) return "dribbble"
    if (domain.includes("behance")) return "behance"
    return "link"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Links</Label>
            <Button type="button" onClick={addLink} variant="outline" size="sm">
              Add Link
            </Button>
          </div>

          {profile.links.map((link, index) => (
            <div key={index} className="flex gap-2 items-start">
              <div className="flex-1">
                <Label htmlFor={`link-label-${index}`} className="sr-only">
                  Link Label
                </Label>
                <Input
                  id={`link-label-${index}`}
                  value={link.label}
                  onChange={(e) => handleLinkChange(index, "label", e.target.value)}
                  placeholder="Label (e.g. GitHub)"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor={`link-url-${index}`} className="sr-only">
                  Link URL
                </Label>
                <Input
                  id={`link-url-${index}`}
                  value={link.url}
                  onChange={(e) => handleUrlChange(index, e.target.value)}
                  placeholder="URL (e.g. https://github.com)"
                />
              </div>
              <div className="w-24">
                <Label htmlFor={`link-icon-${index}`} className="sr-only">
                  Icon
                </Label>
                <Select
                  id={`link-icon-${index}`}
                  value={link.icon || ""}
                  onChange={(e) => handleLinkChange(index, "icon", e.target.value)}
                >
                  <option value="">Icon</option>
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="youtube">YouTube</option>
                  <option value="medium">Medium</option>
                  <option value="dribbble">Dribbble</option>
                  <option value="behance">Behance</option>
                  <option value="link">Website</option>
                </Select>
              </div>
              {profile.links.length > 1 && (
                <Button
                  type="button"
                  onClick={() => removeLink(index)}
                  variant="outline"
                  size="icon"
                  className="flex-shrink-0"
                >
                  ✕
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
