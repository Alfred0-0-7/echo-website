'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Check } from 'lucide-react'

interface SubmissionSuccessProps {
  signalId: string
}

export function SubmissionSuccess({ signalId }: SubmissionSuccessProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center py-8 text-center"
    >
      <div className="relative mb-6 flex h-24 w-24 items-center justify-center">
        {!reduce &&
          [0, 0.5, 1].map((d) => (
            <span
              key={d}
              className="absolute h-16 w-16 rounded-full border border-cyan/50"
              style={{ animation: `ring-expand 2.4s ${d}s ease-out infinite` }}
            />
          ))}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 14, delay: 0.15 }}
          className="relative flex h-16 w-16 items-center justify-center rounded-full bg-cyan text-primary-foreground shadow-[0_0_30px_-4px_var(--cyan)]"
        >
          <Check className="h-8 w-8" strokeWidth={3} />
        </motion.div>
      </div>

      <h3 className="font-display text-2xl font-bold tracking-[0.15em] text-cyan text-glow-cyan">
        SIGNAL RECEIVED
      </h3>
      <p className="mt-3 max-w-xs text-pretty leading-relaxed text-muted-foreground">
        Your signal has been recorded. ECHO has heard you.
      </p>
      <p className="mt-4 rounded-full border border-cyan/20 bg-cyan/5 px-4 py-1.5 font-mono text-[11px] tracking-[0.25em] text-cyan">
        {signalId}
      </p>
    </motion.div>
  )
}
