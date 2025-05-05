import type React from "react"
import {
  Twitter,
  Facebook,
  Linkedin,
  Github,
  Globe,
  Mail,
  Phone,
  LinkIcon,
  MessageCircle,
  Send,
  Youtube,
  Twitch,
  Dribbble,
  Figma,
  Codepen,
  Slack,
  DiscIcon as Discord,
} from "lucide-react"

// Custom WhatsApp icon component to match the brand style
const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="size-4 text-[#25D366]">
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
)

// Custom Telegram icon component to match the brand style
const TelegramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 496 512" fill="currentColor" className="size-4 text-[#26A5E4]">
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm121.8 169.9l-40.7 191.8c-3 13.6-11.1 16.9-22.4 10.5l-62-45.7-29.9 28.8c-3.3 3.3-6.1 6.1-12.5 6.1l4.4-63.1 114.9-103.8c5-4.4-1.1-6.9-7.7-2.5l-142 89.4-61.2-19.1c-13.3-4.2-13.6-13.3 2.8-19.7l239.1-92.2c11.1-4 20.8 2.7 17.2 19.5z" />
  </svg>
)

// Custom Instagram icon component to match the brand style
const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

// Map platform names to their respective icon components
export const getSocialMediaIcon = (platform: string) => {
  const platformLower = platform.toLowerCase()

  if (platformLower.includes("instagram")) return <InstagramIcon />
  if (platformLower.includes("twitter") || platformLower.includes("x.com")) return <Twitter className="size-4" />
  if (platformLower.includes("facebook")) return <Facebook className="size-4" />
  if (platformLower.includes("linkedin")) return <Linkedin className="size-4" />
  if (platformLower.includes("github")) return <Github className="size-4" />
  if (platformLower.includes("whatsapp")) return <WhatsAppIcon />
  if (platformLower.includes("telegram")) return <TelegramIcon />
  if (platformLower.includes("email") || platformLower.includes("mail")) return <Mail className="size-4" />
  if (platformLower.includes("phone")) return <Phone className="size-4" />
  if (platformLower.includes("youtube")) return <Youtube className="size-4" />
  if (platformLower.includes("twitch")) return <Twitch className="size-4" />
  if (platformLower.includes("dribbble")) return <Dribbble className="size-4" />
  if (platformLower.includes("figma")) return <Figma className="size-4" />
  if (platformLower.includes("codepen")) return <Codepen className="size-4" />
  if (platformLower.includes("slack")) return <Slack className="size-4" />
  if (platformLower.includes("discord")) return <Discord className="size-4" />
  if (platformLower.includes("portfolio")) return <Globe className="size-4" />
  if (platformLower.includes("website")) return <Globe className="size-4" />
  if (platformLower.includes("chat")) return <MessageCircle className="size-4" />
  if (platformLower.includes("message")) return <Send className="size-4" />

  // Default icon for unknown platforms
  return <LinkIcon className="size-4" />
}

export const SocialMediaIcon: React.FC<{ platform: string }> = ({ platform }) => {
  return getSocialMediaIcon(platform)
}

export default SocialMediaIcon
