'use client'

import { motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { MagneticButton } from './magnetic-button'

interface HeroProps {
  onOpenChat: () => void
}

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.15 + i * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function Hero({ onOpenChat }: HeroProps) {
  return (
    <section
      id="home"
      className="relative flex min-h-[100svh] w-full items-center overflow-hidden pt-24 pb-16 md:py-0"
    >
      {/* Cinematic ECHO video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center [image-rendering:auto]"
        aria-hidden="true"
      >
        <source src="/videos/echo-hero.mp4" type="video/mp4" />
      </video>

      {/* Layered cinematic overlays — keep ECHO (right) visible, darken the left for text */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, color-mix(in oklch, var(--background) 92%, transparent) 0%, color-mix(in oklch, var(--background) 68%, transparent) 38%, transparent 72%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, var(--background) 2%, transparent 30%), radial-gradient(80% 60% at 20% 40%, color-mix(in oklch, var(--violet) 14%, transparent), transparent 60%)',
        }}
      />
      <div aria-hidden className="absolute inset-0 grid-noise opacity-40" />

      {/* Content — anchored left */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10">
        <div className="max-w-2xl">
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan/30 bg-background/40 px-4 py-1.5 font-mono text-xs tracking-[0.3em] text-cyan backdrop-blur"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            SIGNAL GUARDIAN // ONLINE
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="font-display text-balance text-5xl font-bold leading-[0.95] tracking-tight text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
            style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
          >
            I HEAR WHAT
            <br />
            <span className="text-cyan text-glow-cyan">OTHERS IGNORE.</span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg"
          >
            Every city has voices that disappear beneath the noise. ECHO listens for the
            signals that others miss — and turns unheard problems into action.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <MagneticButton onClick={onOpenChat}>
              SEND YOUR SIGNAL
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </MagneticButton>
            <a href="#scanner" className="inline-block">
              <MagneticButton variant="ghost">
                DISCOVER ECHO
                <ChevronDown className="h-4 w-4" />
              </MagneticButton>
            </a>
          </motion.div>

          {/* Futuristic status interface */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap gap-3 font-mono text-xs sm:mt-12"
          >
            <div className="glass flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
              SIGNAL SYSTEM ONLINE
            </div>
            <div className="glass flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground">
              <span className="tracking-widest">RESONANCE LEVEL</span>
              <span className="text-cyan">98%</span>
              <span className="hidden h-1.5 w-24 overflow-hidden rounded-full bg-white/10 sm:block">
                <span className="block h-full w-[98%] rounded-full bg-gradient-to-r from-cyan to-accent" />
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scanning line */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px overflow-hidden"
        style={{ height: '100%' }}
      >
        <div
          className="absolute inset-x-0 h-24 opacity-[0.06]"
          style={{
            background: 'linear-gradient(to bottom, transparent, var(--cyan), transparent)',
            animation: 'scanline 7s linear infinite',
          }}
        />
      </div>

      <motion.div
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 text-muted-foreground sm:block"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.div>
    </section>
  )
}
