'use client'

import { useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

import { useChat } from '@/hooks/use-chat'
import { ChatMessage } from './chat-message'
import { ChatInput } from './chat-input'
import { TypingIndicator } from './typing-indicator'
import { SignalAnalysis } from './signal-analysis'
import { SubmissionSuccess } from './submission-success'

interface EchoChatbotProps {
  open: boolean
  onClose: () => void
}

export function EchoChatbot({
  open,
  onClose,
}: EchoChatbotProps) {
  const {
    messages,
    phase,
    isTyping,
    isCollecting,
    analysis,
    sendUserMessage,
    submit,
    resetChat,
  } = useChat()

  const scrollRef = useRef<HTMLDivElement>(null)

  // Reference for the chatbot typing input
  const inputRef = useRef<HTMLInputElement>(null)

  /*
   * Normal close:
   * Only hides the chatbot.
   * It does NOT clear the entered details.
   */
  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  /*
   * Close Channel:
   * Clears the complete chat only when the user
   * clicks the CLOSE CHANNEL button.
   */
  const handleCloseChannel = useCallback(() => {
    resetChat()
    onClose()
  }, [resetChat, onClose])

  // Automatically scroll to the newest content
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [messages, isTyping, phase])

  // Automatically focus the input after ECHO finishes typing
  useEffect(() => {
    if (!isTyping && isCollecting && open) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus()
      }, 50)

      return () => {
        window.clearTimeout(timer)
      }
    }
  }, [isTyping, isCollecting, phase, open])

  // Lock body scroll and close on Escape while open
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, handleClose])

  const placeholder =
    phase === 'name'
      ? 'Type your name...'
      : phase === 'age'
        ? 'Your age...'
        : phase === 'location'
          ? 'Your location...'
          : phase === 'email'
            ? 'you@example.com'
            : 'Describe your signal...'

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[90] flex items-center justify-center bg-background/80 p-0 backdrop-blur-md sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label="ECHO signal channel"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.98 }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) => event.stopPropagation()}
            className="relative flex h-dvh w-full max-w-2xl flex-col overflow-hidden border border-cyan/20 bg-background/95 sm:h-[85vh] sm:rounded-3xl"
          >
            {/* Scanline accent */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.05]"
            >
              <div
                className="absolute inset-x-0 h-32"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent, var(--cyan), transparent)',
                  animation: 'scanline 8s linear infinite',
                }}
              />
            </div>

            {/* Header */}
            <header className="relative flex items-center justify-between border-b border-cyan/15 bg-card/40 px-5 py-4 backdrop-blur">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-cyan/40">
                  <Image
                    src="/assets/echo-avatar.png"
                    alt="ECHO"
                    fill
                    sizes="40px"
                    className="object-cover"
                  />

                  <span className="absolute inset-0 rounded-full ring-2 ring-cyan/30" />
                </div>

                <div>
                  <div className="font-display text-sm font-semibold tracking-[0.25em] text-foreground">
                    ECHO // SIGNAL CHANNEL
                  </div>

                  <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.2em] text-cyan">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
                    ONLINE
                  </div>
                </div>
              </div>

              {/* Normal close button - does not clear details */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close signal channel"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan"
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="relative flex-1 space-y-4 overflow-y-auto px-5 py-6"
            >
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                />
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}

              {(phase === 'analysis' ||
                phase === 'transmitting') &&
                analysis && (
                  <SignalAnalysis
                    analysis={analysis}
                    onTransmit={submit}
                    transmitting={phase === 'transmitting'}
                  />
                )}

              {phase === 'submitted' && analysis && (
                <SubmissionSuccess
                  signalId={analysis.signalId}
                />
              )}
            </div>

            {/* Input - only while collecting data */}
            {isCollecting && (
              <ChatInput
                ref={inputRef}
                onSend={sendUserMessage}
                disabled={isTyping}
                placeholder={placeholder}
              />
            )}

            {/* Close button after submission */}
            {phase === 'submitted' && (
              <div className="border-t border-cyan/15 bg-background/60 p-3">
                <button
                  type="button"
                  onClick={handleCloseChannel}
                  className="w-full rounded-full border border-cyan/25 bg-cyan/5 py-3 text-sm font-medium tracking-wide text-cyan transition-colors hover:bg-cyan/10"
                >
                  CLOSE CHANNEL
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}