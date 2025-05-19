"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Copy, Check, Twitter, Facebook, Linkedin, Mail } from "lucide-react"
import { Logo } from "@/components/ui/logo"
import { IOSButton } from "@/components/ui/ios-button"
import { IOSBlurBackground } from "@/components/ui/ios-blur-background"

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  url: string
  title: string
}

export function ShareModal({ isOpen, onClose, url, title }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const [shareableUrl, setShareableUrl] = useState("")

  useEffect(() => {
    // Set the shareable URL when the component mounts or URL changes
    setShareableUrl(url)
  }, [url])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareableUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      title,
    )}&url=${encodeURIComponent(shareableUrl)}`
    window.open(twitterUrl, "_blank")
  }

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableUrl)}`
    window.open(facebookUrl, "_blank")
  }

  const shareViaLinkedIn = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableUrl)}`
    window.open(linkedinUrl, "_blank")
  }

  const shareViaEmail = () => {
    const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(
      `Check out this profile: ${shareableUrl}`,
    )}`
    window.open(emailUrl, "_blank")
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="w-full max-w-md rounded-2xl overflow-hidden"
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <IOSBlurBackground intensity={15} className="w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold">Share Profile</h3>
                  <IOSButton
                    variant="text"
                    size="sm"
                    onClick={onClose}
                    icon={<X size={18} />}
                    className="text-gray-500"
                  />
                </div>

                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Logo animate={false} className="text-3xl text-blue-500" />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 p-3 bg-gray-100 rounded-lg mb-4">
                    <input
                      type="text"
                      value={shareableUrl}
                      readOnly
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm"
                    />
                    <IOSButton
                      variant="text"
                      size="sm"
                      onClick={handleCopyLink}
                      icon={copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                      className={copied ? "text-green-500" : "text-gray-500"}
                    >
                      {copied ? "Copied" : "Copy"}
                    </IOSButton>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="flex flex-col items-center">
                      <IOSButton
                        variant="outline"
                        size="lg"
                        className="w-12 h-12 rounded-full mb-2 bg-[#1DA1F2] text-white border-none"
                        icon={<Twitter size={20} />}
                        onClick={shareViaTwitter}
                      />
                      <span className="text-xs">Twitter</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <IOSButton
                        variant="outline"
                        size="lg"
                        className="w-12 h-12 rounded-full mb-2 bg-[#4267B2] text-white border-none"
                        icon={<Facebook size={20} />}
                        onClick={shareViaFacebook}
                      />
                      <span className="text-xs">Facebook</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <IOSButton
                        variant="outline"
                        size="lg"
                        className="w-12 h-12 rounded-full mb-2 bg-[#0077B5] text-white border-none"
                        icon={<Linkedin size={20} />}
                        onClick={shareViaLinkedIn}
                      />
                      <span className="text-xs">LinkedIn</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <IOSButton
                        variant="outline"
                        size="lg"
                        className="w-12 h-12 rounded-full mb-2 bg-[#D44638] text-white border-none"
                        icon={<Mail size={20} />}
                        onClick={shareViaEmail}
                      />
                      <span className="text-xs">Email</span>
                    </div>
                  </div>
                </div>

                <IOSButton variant="filled" color="primary" fullWidth onClick={onClose}>
                  Done
                </IOSButton>
              </div>
            </IOSBlurBackground>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
