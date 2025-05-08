"use client"

import type React from "react"
import {
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Mail,
  Phone,
  MessageCircle,
  Send,
  Twitch,
  Dribbble,
  Figma,
  Codepen,
  Slack,
  Gitlab,
  Trello,
  NotebookIcon as Notion,
  Rss,
  Music,
  Camera,
  ImageIcon,
  FileText,
  Link,
  ExternalLink,
} from "lucide-react"

interface SocialMediaIconProps {
  platform: string
  className?: string
}

export function SocialMediaIcon({ platform, className = "h-5 w-5" }: SocialMediaIconProps) {
  const iconMap: Record<string, React.ReactNode> = {
    github: <Github className={className} />,
    linkedin: <Linkedin className={className} />,
    twitter: <Twitter className={className} />,
    instagram: <Instagram className={className} />,
    facebook: <Facebook className={className} />,
    youtube: <Youtube className={className} />,
    website: <Globe className={className} />,
    globe: <Globe className={className} />,
    email: <Mail className={className} />,
    mail: <Mail className={className} />,
    phone: <Phone className={className} />,
    whatsapp: <MessageCircle className={className} />,
    telegram: <Send className={className} />,
    twitch: <Twitch className={className} />,
    dribbble: <Dribbble className={className} />,
    figma: <Figma className={className} />,
    codepen: <Codepen className={className} />,
    slack: <Slack className={className} />,
    gitlab: <Gitlab className={className} />,
    trello: <Trello className={className} />,
    notion: <Notion className={className} />,
    rss: <Rss className={className} />,
    tiktok: <Music className={className} />,
    snapchat: <Camera className={className} />,
    pinterest: <ImageIcon className={className} />,
    medium: <FileText className={className} />,
    reddit: <Link className={className} />,
    discord: <MessageCircle className={className} />,
    default: <ExternalLink className={className} />,
  }

  return <>{iconMap[platform.toLowerCase()] || iconMap.default}</>
}

// Add default export to maintain backward compatibility
export default SocialMediaIcon
