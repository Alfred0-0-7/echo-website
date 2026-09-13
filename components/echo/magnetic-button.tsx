'use client'

import { useRef, type ReactNode } from 'react'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface MagneticButtonProps {
  children: ReactNode
  onClick?: () => void
  variant?: 'primary' | 'ghost'
  className?: string
  type?: 'button' | 'submit'
  ariaLabel?: string
}

/**
 * A button that subtly leans toward the cursor. Falls back to a static button
 * when reduced motion is preferred.
 */
export function MagneticButton({
  children,
  onClick,
  variant = 'primary',
  className,
  type = 'button',
  ariaLabel,
}: MagneticButtonProps) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 260, damping: 18 })
  const sy = useSpring(y, { stiffness: 260, damping: 18 })

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (reduce || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.3)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.3)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      aria-label={ariaLabel}
      whileTap={{ scale: 0.96 }}
      className={cn(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-3.5 text-sm font-medium tracking-wide transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        variant === 'primary'
          ? 'bg-cyan text-primary-foreground shadow-[0_0_30px_-6px_var(--cyan)] hover:shadow-[0_0_40px_-4px_var(--cyan)]'
          : 'glass text-foreground hover:border-cyan/50',
        className,
      )}
    >
      {variant === 'primary' && (
        <span
          aria-hidden
          className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
        />
      )}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </motion.button>
  )
}
