'use client'

import { Radio, Volume2, GitBranch, Link2, type LucideIcon } from 'lucide-react'
import { Reveal } from './reveal'

interface Power {
  icon: LucideIcon
  title: string
  desc: string
}

const POWERS: Power[] = [
  { icon: Radio, title: 'RESONANCE', desc: 'Detects signals hidden beneath the noise.' },
  { icon: Volume2, title: 'AMPLIFY', desc: 'Makes unheard problems impossible to ignore.' },
  { icon: GitBranch, title: 'TRACE', desc: 'Follows a signal to understand where it originates.' },
  { icon: Link2, title: 'CONNECT', desc: 'Turns a problem into an actionable request.' },
]

export function Powers() {
  return (
    <section id="powers" className="relative border-t border-white/5 py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-14 text-center">
          <Reveal>
            <p className="mb-4 font-mono text-xs tracking-[0.35em] text-cyan">// ABILITIES</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-balance text-4xl font-bold tracking-tight md:text-5xl">
              THE POWER OF <span className="text-cyan text-glow-cyan">RESONANCE</span>
            </h2>
          </Reveal>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POWERS.map((power, i) => (
            <Reveal key={power.title} delay={i * 0.08}>
              <article className="group relative h-full overflow-hidden rounded-2xl border border-cyan/15 bg-card/40 p-6 backdrop-blur transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan/40">
                {/* animated glow following hover */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan/20 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                />
                {/* signal wave line */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="relative">
                  <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan transition-transform duration-500 group-hover:scale-110">
                    <power.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-[0.15em] text-foreground">
                    {power.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {power.desc}
                  </p>
                  <span className="mt-4 block font-mono text-[10px] tracking-[0.3em] text-cyan/50">
                    0{i + 1} / SIGNAL
                  </span>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
