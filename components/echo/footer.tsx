import { EchoLogo } from './echo-logo'

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan/10 bg-card/20">
      <div aria-hidden className="absolute inset-0 grid-noise opacity-20" />

      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-10">
          {/* ECHO Information */}
          <div>
            <div className="flex items-center gap-2.5">
              <EchoLogo className="h-8 w-8 text-cyan" />

              <span className="font-display text-xl font-bold tracking-[0.25em] text-foreground">
                ECHO
              </span>
            </div>

            <p className="mt-4 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
              I hear what others ignore. ECHO listens for the signals the world learned to miss —
              and turns them into action.
            </p>

            <p className="mt-6 font-mono text-[10px] tracking-[0.3em] text-cyan/60">
              ● SIGNAL SYSTEM ONLINE // RESONANCE 98%
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[11px] tracking-widest text-muted-foreground sm:flex-row">
          <span>ECHO — THE SIGNAL GUARDIAN</span>

          <span>
            &copy; {new Date().getFullYear()} // ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </footer>
  )
}