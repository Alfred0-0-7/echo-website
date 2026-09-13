import { EchoLogo } from './echo-logo'

const LINK_GROUPS = [
  { title: 'NAVIGATE', links: ['Home', 'Origin', 'Powers', 'Mission', 'Signal Network'] },
  { title: 'FREQUENCIES', links: ['Community', 'Health', 'Education', 'Safety', 'Environment'] },
]

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-cyan/10 bg-card/20">
      <div aria-hidden className="absolute inset-0 grid-noise opacity-20" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
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

          {LINK_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 font-mono text-[10px] tracking-[0.3em] text-cyan">
                {group.title}
              </h3>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <span className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/5 pt-6 font-mono text-[11px] tracking-widest text-muted-foreground sm:flex-row">
          <span>ECHO — THE SIGNAL GUARDIAN</span>
          <span>&copy; {new Date().getFullYear()} // ALL FREQUENCIES RESERVED</span>
        </div>
      </div>
    </footer>
  )
}
