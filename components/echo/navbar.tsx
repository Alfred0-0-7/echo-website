'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X, MessageCircle } from 'lucide-react'
import { EchoLogo } from './echo-logo'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'HOME', href: '#home' },
  { label: 'ORIGIN', href: '#origin' },
  { label: 'POWERS', href: '#powers' },
  { label: 'MISSION', href: '#mission' },
  { label: 'SIGNAL NETWORK', href: '#network' },
]

interface NavbarProps {
  onOpenChat: () => void
  showChatButton?: boolean
}

export function Navbar({
  onOpenChat,
  showChatButton = true,
}: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    onScroll()

    window.addEventListener('scroll', onScroll, {
      passive: true,
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <>
      {/* Navbar */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'border-b border-cyan/10 bg-background/70 backdrop-blur-xl'
            : 'bg-transparent',
        )}
      >
        <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:h-20 md:px-10">
          {/* Logo */}
          <a
            href="#home"
            className="group flex items-center gap-2.5"
            aria-label="ECHO home"
          >
            <EchoLogo className="h-8 w-8 text-cyan transition-transform group-hover:scale-110" />

            <span className="font-display text-xl font-bold tracking-[0.25em] text-foreground">
              ECHO
            </span>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="relative font-mono text-xs tracking-[0.2em] text-muted-foreground transition-colors hover:text-cyan after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-0 after:bg-cyan after:transition-all hover:after:w-full"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-cyan/10 hover:text-cyan lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden border-t border-cyan/10 bg-background/95 backdrop-blur-xl lg:hidden"
            >
              <ul className="flex flex-col gap-1 px-6 py-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 font-mono text-sm tracking-[0.2em] text-muted-foreground transition-colors hover:bg-cyan/10 hover:text-cyan"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Floating Chat Button - Only after loading */}
      {showChatButton && (
        <button
          type="button"
          onClick={onOpenChat}
          aria-label="Send your signal"
          title="Send your signal"
          className="
            group
            fixed
            bottom-5
            right-5
            z-[100]
            flex
            h-14
            w-14
            items-center
            justify-center
            rounded-full
            border
            border-cyan/40
            bg-cyan
            text-primary-foreground
            shadow-[0_0_28px_-6px_var(--cyan)]
            transition-all
            duration-300
            hover:scale-110
            hover:shadow-[0_0_40px_-4px_var(--cyan)]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-cyan
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
            sm:bottom-6
            sm:right-6
            sm:h-16
            sm:w-16
          "
        >
          <MessageCircle
            className="h-6 w-6 transition-transform duration-300 group-hover:rotate-[-8deg]"
            strokeWidth={1.8}
          />

          {/* Notification dot */}
          <span className="absolute right-1 top-1 h-2.5 w-2.5 rounded-full bg-white shadow-sm sm:right-1.5 sm:top-1.5" />
        </button>
      )}
    </>
  )
}