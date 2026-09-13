'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from './reveal'

const STORY = [
  'Years ago, the city became filled with millions of voices.',
  'But somewhere between the noise, people who truly needed help became silent.',
  'ECHO was born from the last signal that nobody heard.',
  'Now ECHO listens.',
  'Not to the loudest voices.',
  'To the ones that are almost lost.',
]

export function OriginStory() {
  const reduce = useReducedMotion()

  return (
    <section
      id="origin"
      className="relative overflow-hidden border-t border-white/5 py-24 md:py-36"
    >
      {/* atmospheric background */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(70% 60% at 50% 20%, color-mix(in oklch, var(--violet) 12%, transparent), transparent 60%)',
        }}
      />
      <div aria-hidden className="absolute inset-0 grid-noise opacity-20" />

      {/* drifting signal particles */}
      {!reduce && (
        <div aria-hidden className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 18 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-cyan/40"
              style={{ left: `${(i * 53) % 100}%`, top: `${(i * 37) % 100}%` }}
              animate={{ y: [0, -40, 0], opacity: [0.1, 0.6, 0.1] }}
              transition={{
                duration: 5 + (i % 4),
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.4,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative mx-auto max-w-4xl px-6 md:px-10">
        <div className="mb-16 text-center">
          <Reveal>
            <p className="mb-4 font-mono text-xs tracking-[0.35em] text-cyan">// ORIGIN</p>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              THE SIGNAL THAT
              <br className="hidden sm:block" /> CREATED{' '}
              <span className="text-cyan text-glow-cyan">ECHO</span>
            </h2>
          </Reveal>
        </div>

        <ol className="relative mx-auto max-w-2xl">
          {/* vertical line */}
          <span
            aria-hidden
            className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-cyan/60 via-cyan/20 to-transparent md:left-2"
          />
          {STORY.map((line, i) => (
            <motion.li
              key={i}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="relative mb-8 pl-10 md:pl-14"
            >
              <span className="absolute left-0 top-2 flex h-4 w-4 items-center justify-center md:left-[2px]">
                <span className="absolute h-4 w-4 animate-ping rounded-full bg-cyan/30" />
                <span className="h-2 w-2 rounded-full bg-cyan shadow-[0_0_10px_var(--cyan)]" />
              </span>
              <p
                className={`text-pretty leading-relaxed ${
                  i === 2
                    ? 'font-display text-2xl font-semibold text-foreground md:text-3xl'
                    : 'text-lg text-muted-foreground'
                }`}
              >
                {line}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
