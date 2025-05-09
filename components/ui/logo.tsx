"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  href?: string
  animate?: boolean
}

export function Logo({ className, href = "/", animate = true }: LogoProps) {
  const LogoContent = () => (
    <span
      className={cn("text-blue-500 font-pacifico text-3xl tracking-wide", className)}
      style={{
        fontFamily: "'Pacifico', cursive",
        textShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)",
      }}
    >
      looqmy
    </span>
  )

  if (animate) {
    return (
      <motion.div
        initial={{ scale: 0.95, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 10 }}
      >
        {href ? (
          <Link href={href}>
            <LogoContent />
          </Link>
        ) : (
          <LogoContent />
        )}
      </motion.div>
    )
  }

  return href ? (
    <Link href={href}>
      <LogoContent />
    </Link>
  ) : (
    <LogoContent />
  )
}
