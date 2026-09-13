'use client'

import { useState } from 'react'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion'

import { SIGNAL_CATEGORIES } from '@/lib/echo-data'
import { EchoLogo } from './echo-logo'
import { Reveal } from './reveal'
import { NetworkNodes } from '@/components/echo/NetworkNodes'

const CENTER = { x: 50, y: 45 }

export function SignalNetwork() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState<string | null>(null)

  const activeCat =
    SIGNAL_CATEGORIES.find((c) => c.id === active) ?? null

  return (
    <section
      id="network"
      className="relative isolate overflow-hidden border-t border-white/5 py-16 sm:py-24 md:py-32"
    >
      {/* Animated network background */}
      <NetworkNodes />

      {/* Existing content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-4 font-mono text-xs tracking-[0.35em] text-cyan">
              // COVERAGE
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h2 className="font-display text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              THE SIGNAL{' '}
              <span className="text-cyan text-glow-cyan">
                NETWORK
              </span>
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mx-auto mt-5 max-w-xl text-pretty leading-relaxed text-muted-foreground">
              ECHO receives signals from every corner of the city.
              Hover a node to trace a frequency across the network.
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <div className="relative mx-auto aspect-[3/4] w-full max-w-4xl overflow-hidden rounded-3xl border border-cyan/15 bg-card/30 backdrop-blur sm:aspect-[16/10]">
            {/* Background texture */}
            <div
              aria-hidden
              className="absolute inset-0 grid-noise opacity-40"
            />

            {/* Connection lines */}
            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden
            >
              {SIGNAL_CATEGORIES.map((c) => {
                const isActive = active === c.id

                return (
                  <line
                    key={c.id}
                    x1={CENTER.x}
                    y1={CENTER.y}
                    x2={c.x}
                    y2={c.y}
                    stroke="var(--cyan)"
                    strokeWidth={isActive ? 0.5 : 0.2}
                    strokeOpacity={isActive ? 0.9 : 0.25}
                    strokeDasharray={
                      isActive ? '0' : '1 1.5'
                    }
                    className="transition-all duration-300"
                  />
                )
              })}
            </svg>

            {/* Center core */}
            <div
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${CENTER.x}%`,
                top: `${CENTER.y}%`,
              }}
            >
              <div className="relative flex h-12 w-12 items-center justify-center sm:h-16 sm:w-16">
                <span
                  className="absolute inset-0 rounded-full bg-cyan/20 blur-lg"
                  style={{
                    animation: reduce
                      ? undefined
                      : 'echo-pulse 3s ease-in-out infinite',
                  }}
                />

                <div className="relative flex h-10 w-10 items-center justify-center rounded-full border border-cyan/50 bg-background/70 sm:h-14 sm:w-14">
                  <EchoLogo className="h-6 w-6 text-cyan sm:h-8 sm:w-8" />
                </div>
              </div>
            </div>

            {/* Interactive signal nodes */}
            {SIGNAL_CATEGORIES.map((c) => {
              const isActive = active === c.id
              const Icon = c.icon

              return (
                <button
                  key={c.id}
                  type="button"
                  className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  style={{
                    left: `${c.x}%`,
                    top: `${c.y}%`,
                  }}
                  onMouseEnter={() => setActive(c.id)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(c.id)}
                  onBlur={() => setActive(null)}
                  onClick={() =>
                    setActive(isActive ? null : c.id)
                  }
                  aria-label={`${c.label} signals`}
                  aria-pressed={isActive}
                >
                  <motion.span
                    animate={
                      isActive
                        ? { scale: 1.25 }
                        : reduce
                          ? { scale: 1 }
                          : { scale: [1, 1.08, 1] }
                    }
                    transition={
                      isActive
                        ? { duration: 0.2 }
                        : {
                            duration: 3,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }
                    }
                    className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur transition-colors sm:h-11 sm:w-11 ${
                      isActive
                        ? 'border-cyan bg-cyan/20 text-cyan shadow-[0_0_20px_var(--cyan)]'
                        : 'border-cyan/25 bg-background/60 text-muted-foreground'
                    }`}
                  >
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </motion.span>
                </button>
              )
            })}

            {/* Information panel */}
            <AnimatePresence>
              {activeCat && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25 }}
                  className="glass absolute bottom-4 left-4 right-4 max-w-xs rounded-xl p-4 md:left-4 md:right-auto"
                >
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] text-cyan">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan" />
                    {activeCat.label}
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {activeCat.blurb}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  )
}