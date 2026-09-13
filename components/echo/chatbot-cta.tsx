'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { MessageSquareText, ArrowRight } from 'lucide-react'
import { MagneticButton } from './magnetic-button'
import { Reveal } from './reveal'

interface ChatbotCtaProps {
  onOpenChat: () => void
}

export function ChatbotCta({ onOpenChat }: ChatbotCtaProps) {
  const reduce = useReducedMotion()

  return (
    <section
      id="mission"
      className="relative overflow-hidden border-t border-white/5 py-28 md:py-40"
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(60% 70% at 50% 50%, color-mix(in oklch, var(--cyan) 14%, transparent), transparent 65%)',
        }}
      />

      {/* concentric emitting rings */}
      {!reduce && (
        <div aria-hidden className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {[0, 1, 2].map((d) => (
            <span
              key={d}
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan/30"
              style={{ animation: `ring-expand 4s ${d * 1.3}s ease-out infinite` }}
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-3xl px-6 text-center md:px-10">
        <Reveal>
          <div className="mx-auto mb-8 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan/30 bg-cyan/10 text-cyan">
            <MessageSquareText className="h-8 w-8" />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <h2 className="font-display text-balance text-5xl font-bold tracking-tight md:text-6xl">
            HAVE A <span className="text-cyan text-glow-cyan">SIGNAL?</span>
          </h2>
        </Reveal>
        <Reveal delay={0.12}>
          <p className="mx-auto mt-5 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Someone should hear it.
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <div className="mt-10 flex justify-center">
            <MagneticButton onClick={onOpenChat} className="px-9 py-4 text-base">
              TALK TO ECHO
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
