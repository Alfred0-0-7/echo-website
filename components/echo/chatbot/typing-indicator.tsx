'use client'

import { motion } from 'framer-motion'

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-sm border border-cyan/25 bg-card/60 px-4 py-3">
      <span className="sr-only">ECHO is composing a signal</span>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full bg-cyan"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}
