'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { EchoLogo } from './echo-logo'

const PHASES = ['INITIALIZING SIGNAL SYSTEM...', 'SCANNING CITY...', 'SIGNAL DETECTED']

interface LoadingScreenProps {
  onComplete: () => void
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const durations = [900, 900, 800]
    let index = 0
    const timers: ReturnType<typeof setTimeout>[] = []

    const advance = () => {
      index += 1
      if (index < PHASES.length) {
        setPhase(index)
        timers.push(setTimeout(advance, durations[index]))
      } else {
        timers.push(setTimeout(onComplete, 700))
      }
    }
    timers.push(setTimeout(advance, durations[0]))
    return () => timers.forEach(clearTimeout)
  }, [onComplete])

  const detected = phase === PHASES.length - 1

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background grid-noise px-6"
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 45%, color-mix(in oklch, var(--cyan) 14%, transparent), transparent 70%)',
        }}
      />

      {/* radar rings */}
      <div className="relative flex h-32 w-32 items-center justify-center sm:h-40 sm:w-40">
        {!reduce &&
          [0, 0.6, 1.2].map((d) => (
            <span
              key={d}
              className="absolute inset-0 rounded-full border border-cyan/40"
              style={{
                animation: `ring-expand 2.4s ${d}s ease-out infinite`,
              }}
            />
          ))}
        <motion.div
          animate={detected ? { scale: [1, 1.15, 1] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative text-cyan"
        >
          <EchoLogo className="h-16 w-16 text-glow-cyan sm:h-20 sm:w-20" />
        </motion.div>
      </div>

      {/* waveform */}
      <div className="mt-10 flex h-10 items-end gap-1" aria-hidden>
        {Array.from({ length: 28 }).map((_, i) => (
          <motion.span
            key={i}
            className="w-1 rounded-full bg-cyan/80"
            initial={{ height: 4 }}
            animate={
              reduce
                ? { height: 12 }
                : { height: [6, 10 + ((i * 7) % 30), 6] }
            }
            transition={{
              duration: 0.9,
              repeat: Infinity,
              delay: i * 0.04,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="mt-8 h-6 px-4 text-center font-mono text-xs tracking-[0.25em] sm:text-sm sm:tracking-[0.35em]">
        <AnimatePresence mode="wait">
          <motion.span
            key={phase}
            initial={{ opacity: 0, y: 6, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
            transition={{ duration: 0.4 }}
            className={detected ? 'text-cyan text-glow-cyan' : 'text-muted-foreground'}
          >
            {PHASES[phase]}
          </motion.span>
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
