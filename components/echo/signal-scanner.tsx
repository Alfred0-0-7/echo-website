'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { SIGNAL_CATEGORIES } from '@/lib/echo-data'
import { EchoLogo } from './echo-logo'
import { Reveal } from './reveal'

export function SignalScanner() {
  const reduce = useReducedMotion()

  return (
    <section
      id="scanner"
      className="relative overflow-hidden border-t border-white/5 py-24 md:py-32"
    >
      <div aria-hidden className="absolute inset-0 grid-noise opacity-30" />
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="mb-4 font-mono text-xs tracking-[0.35em] text-cyan">
                // RESONANCE FIELD
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                EVERY PROBLEM
                <br />
                CREATES A <span className="text-cyan text-glow-cyan">SIGNAL.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-md text-pretty leading-relaxed text-muted-foreground">
                Some signals are loud. Others are almost invisible. ECHO exists to find them —
                sweeping across the city&apos;s frequencies for the ones no one else is
                listening for.
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="mt-8 flex flex-wrap gap-2">
                {SIGNAL_CATEGORIES.map((c) => (
                  <span
                    key={c.id}
                    className="rounded-full border border-cyan/20 bg-cyan/5 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-muted-foreground"
                  >
                    {c.label}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Radar visualization */}
          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-square w-full max-w-md">
              {/* concentric rings */}
              {[1, 0.72, 0.46].map((s, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-cyan/20"
                  style={{
                    inset: `${(1 - s) * 50}%`,
                  }}
                />
              ))}

              {/* expanding pulse rings */}
              {!reduce &&
                [0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="absolute inset-[40%] rounded-full border border-cyan/40"
                    style={{ animation: `ring-expand 3s ${d}s ease-out infinite` }}
                  />
                ))}

              {/* rotating radar sweep */}
              {!reduce && (
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, transparent 0deg, color-mix(in oklch, var(--cyan) 22%, transparent) 40deg, transparent 80deg)',
                    animation: 'radar-sweep 6s linear infinite',
                    maskImage: 'radial-gradient(circle, black 0%, black 70%, transparent 72%)',
                    WebkitMaskImage:
                      'radial-gradient(circle, black 0%, black 70%, transparent 72%)',
                  }}
                />
              )}

              {/* core */}
              <div className="absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full bg-cyan/20 blur-xl"
                  style={{ animation: reduce ? undefined : 'echo-pulse 3s ease-in-out infinite' }}
                />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-cyan/40 bg-background/60 backdrop-blur">
                  <EchoLogo className="h-11 w-11 text-cyan text-glow-cyan" />
                </div>
              </div>

              {/* floating category nodes */}
              {SIGNAL_CATEGORIES.map((c, i) => (
                <motion.div
                  key={c.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${c.x}%`, top: `${c.y}%` }}
                  animate={reduce ? undefined : { y: [0, -8, 0] }}
                  transition={{
                    duration: 3 + (i % 3),
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.3,
                  }}
                >
                  <div className="flex flex-col items-center gap-1.5">
                    <span className="flex h-3 w-3 items-center justify-center">
                      <span className="absolute h-3 w-3 animate-ping rounded-full bg-cyan/50" />
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />
                    </span>
                    <span className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-muted-foreground backdrop-blur">
                      {c.label}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
