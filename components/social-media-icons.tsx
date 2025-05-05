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
    <path d="M17.498 14.382c-.301-.15-1.767-.867-2.04-.966-.273-.101-.473-.15-.673.15-.197.295-.771.964-.944 1.162-.175.195-.349.21-.646.075-.3-.15-1.263-.465-2.403-1.485-.888-.795-1.484-1.77-1.66-2.07-.174-.3-.019-.465.13-.615.136-.135.301-.345.451-.523.146-.181.194-.301.297-.496.1-.21.049-.375-.025-.524-.075-.15-.672-1.62-.922-2.206-.24-.584-.487-.51-.672-.51-.172-.015-.371-.015-.571-.015-.2 0-.523.074-.797.359-.273.3-1.045 1.02-1.045 2.475s1.07 2.865 1.219 3.075c.149.195 2.105 3.195 5.1 4.485.714.3 1.27.48 1.704.629.714.227 1.365.195 1.88.121.574-.091 1.767-.721 2.016-1.426.255-.705.255-1.29.18-1.425-.074-.135-.27-.21-.57-.345z" />
    <path
      d="M20.52 3.449C12.831-3.984.106 1.407.101 11.893c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652c1.746.943 3.71 1.444 5.715 1.447h.006c10.345 0 18.45-8.385 18.45-18.699 0-4.986-1.985-9.707-5.986-13.647zm-4.032 28.6c-1.764.001-3.49-.46-5.001-1.326l-.358-.214-3.705.972.99-3.617-.235-.374a15.814 15.814 0 01-1.65-7.702c.001-8.741 7.111-15.85 15.862-15.85 4.23 0 8.21 1.65 11.195 4.636 3.007 3.01 4.655 7.022 4.655 11.295-.002 8.742-7.113 15.85-15.863 15.85z"
      fill="currentColor"
    />
  </svg>
)

// Custom Telegram icon component to match the brand style
const TelegramIcon = () => (
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
    <path d="M22.05 2.31c-.83.33-15.91 6.13-16.91 6.53-.55.22-.85.42-.85.95 0 .47.4.74.79.85.4.11 1.34.34 1.89.46.55.12 1.35.02 1.68-.14.33-.17 9.82-6.2 10.97-6.93.22-.14.44.17.24.31-1.57 1.18-7.29 5.72-8.02 6.29-.22.17-.44.5-.11.83.33.34 3.56 3.34 3.93 3.7.38.36.79.04 1.01-.22.22-.26 3.97-3.81 4.93-4.73.33-.31.66-.17.44.22-.22.38-2.75 2.67-3.53 3.4-.33.31-.33.61-.11.83.22.22 2.44 1.67 2.77 1.9.33.24.55.55 1.01.55.45 0 .67-.28.89-.5.22-.22 4.44-10.58 4.82-12.4.11-.5-.06-1.2-.45-1.4-.38-.2-.89-.31-1.01-.31-.11 0-.22 0-.33.02z" />
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
