"use client"

import { motion } from "framer-motion"

export default function PageLoading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center"
      >
        <div className="relative h-16 w-16 mb-6">
          <motion.div
            className="absolute inset-0 rounded-full border-t-4 border-blue-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
        </div>
        <motion.span
          className="text-2xl font-medium text-blue-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          looqmy
        </motion.span>
      </motion.div>
    </div>
  )
}
