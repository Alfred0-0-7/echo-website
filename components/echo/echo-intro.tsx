'use client'

import Image from 'next/image'
import { motion, useReducedMotion } from 'framer-motion'
import { Reveal } from './reveal'

export function EchoIntro() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          {/* Left — heading + narrative */}
          <div className="order-2 lg:order-1">
            <Reveal>
              <p className="mb-4 font-mono text-xs tracking-[0.35em] text-cyan">// IDENTITY</p>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="font-display text-5xl font-bold tracking-tight md:text-6xl">
                MEET <span className="text-cyan text-glow-cyan">ECHO</span>
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-8 text-pretty text-lg leading-relaxed text-foreground/90">
                ECHO was born from the last signal nobody heard.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
                Now, ECHO listens beyond the noise — tracing problems, amplifying unheard voices,
                and connecting them to a path forward. Not a machine. Not a hotline. A guardian
                tuned to the frequencies the world learned to ignore.
              </p>
            </Reveal>
            <Reveal delay={0.28}>
              <div className="mt-8 flex gap-8 font-mono text-xs">
                <div>
                  <div className="text-2xl font-bold text-cyan">6</div>
                  <div className="mt-1 tracking-widest text-muted-foreground">FREQUENCIES</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan">24/7</div>
                  <div className="mt-1 tracking-widest text-muted-foreground">LISTENING</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-cyan">∞</div>
                  <div className="mt-1 tracking-widest text-muted-foreground">RANGE</div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — character visual */}
          <div className="order-1 lg:order-2">
            <Reveal delay={0.1}>
              <div className="relative mx-auto aspect-[3/4] w-full max-w-sm">
                <motion.div
                  aria-hidden
                  className="absolute -inset-6 rounded-[2rem] bg-cyan/10 blur-2xl"
                  animate={reduce ? undefined : { opacity: [0.4, 0.7, 0.4] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                <div className="relative h-full w-full overflow-hidden rounded-[1.5rem] border border-cyan/20">
                  <Image
                    src="/assets/echo-character.png"
                    alt="ECHO, the Signal Guardian, standing in a neon-lit city"
                    fill
                    sizes="(max-width: 1024px) 90vw, 400px"
                    className="object-cover"
                    priority={false}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(to top, var(--background) 4%, transparent 40%), linear-gradient(to right, color-mix(in oklch, var(--violet) 18%, transparent), transparent 60%)',
                    }}
                  />
                  {/* HUD corner brackets */}
                  <div className="pointer-events-none absolute inset-3">
                    {['left-0 top-0', 'right-0 top-0', 'left-0 bottom-0', 'right-0 bottom-0'].map(
                      (pos, i) => (
                        <span
                          key={i}
                          className={`absolute h-5 w-5 border-cyan/60 ${pos} ${
                            i < 2 ? 'border-t-2' : 'border-b-2'
                          } ${i % 2 === 0 ? 'border-l-2' : 'border-r-2'}`}
                        />
                      ),
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 font-mono text-[10px] tracking-[0.3em] text-cyan">
                    ECHO // SIGNAL GUARDIAN
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}
