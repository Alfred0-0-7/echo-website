'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const inputRef = useRef<HTMLInputElement>(null)

  const [viewportHeight, setViewportHeight] = useState<number | null>(null)
  const [viewportTop, setViewportTop] = useState(0)

  const handleClose = useCallback(() => {
    onClose()
  }, [onClose])

  const handleCloseChannel = useCallback(() => {
    resetChat()
    onClose()
  }, [resetChat, onClose])

  /*
   * Scroll to the newest message.
   */
  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior = 'smooth') => {
      const container = scrollRef.current

      if (!container) return

      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      })
    },
    [],
  )

  /*
   * Keep the chatbot inside the visible viewport when
   * the mobile keyboard opens or closes.
   */
  useEffect(() => {
    if (!open) return

    const updateViewport = () => {
      const viewport = window.visualViewport

      const height = viewport?.height ?? window.innerHeight
      const top = viewport?.offsetTop ?? 0

      setViewportHeight(height)
      setViewportTop(top)

      window.requestAnimationFrame(() => {
        scrollToBottom('auto')
      })
    }

    updateViewport()

    const viewport = window.visualViewport

    viewport?.addEventListener('resize', updateViewport)
    viewport?.addEventListener('scroll', updateViewport)
    window.addEventListener('resize', updateViewport)

    return () => {
      viewport?.removeEventListener('resize', updateViewport)
      viewport?.removeEventListener('scroll', updateViewport)
      window.removeEventListener('resize', updateViewport)
    }
  }, [open, scrollToBottom])

  /*
   * Automatically scroll when:
   * - a new message is added
   * - ECHO starts/stops typing
   * - the chat phase changes
   * - analysis content appears
   * - the chatbot opens
   */
  useEffect(() => {
    if (!open) return

    const frame = window.requestAnimationFrame(() => {
      scrollToBottom('smooth')
    })

    return () => {
      window.cancelAnimationFrame(frame)
    }
  }, [
    open,
    messages,
    isTyping,
    phase,
    analysis,
    scrollToBottom,
  ])

  /*
   * Focus the input when ECHO finishes typing.
   */
  useEffect(() => {
    if (!open || isTyping || !isCollecting) return

    const timer = window.setTimeout(() => {
      inputRef.current?.focus()

      window.requestAnimationFrame(() => {
        scrollToBottom('auto')
      })
    }, 150)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    open,
    isTyping,
    isCollecting,
    phase,
    scrollToBottom,
  ])

  /*
   * Lock background scrolling and support Escape key.
   */
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
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
          transition={{ duration: 0.25 }}
          className="
            fixed
            inset-x-0
            bottom-0
            z-[999]
            flex
            items-end
            justify-center
            overflow-hidden
            bg-background/80
            p-0
            backdrop-blur-md
            sm:inset-0
            sm:items-center
            sm:p-4
          "
          style={
            viewportHeight
              ? {
                  height: `${viewportHeight}px`,
                  top: `${viewportTop}px`,
                  bottom: 'auto',
                }
              : undefined
          }
          role="dialog"
          aria-modal="true"
          aria-label="ECHO signal channel"
          onClick={handleClose}
        >
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 24,
              scale: 0.98,
            }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) => event.stopPropagation()}
            className="
              chat-shell
              relative
              flex
              h-full
              max-h-full
              w-full
              min-h-0
              flex-col
              overflow-hidden
              rounded-t-2xl
              border
              border-cyan/20
              bg-background/95
              shadow-2xl
              sm:h-[85vh]
              sm:max-h-[85vh]
              sm:max-w-2xl
              sm:rounded-3xl
            "
          >
            {/* Scanline accent */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                z-0
                overflow-hidden
                opacity-[0.05]
              "
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
            <header
              className="
                chat-header
                relative
                z-20
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-cyan/15
                bg-card/40
                px-4
                py-3
                backdrop-blur
                sm:px-5
                sm:py-4
              "
            >
              <div className="flex min-w-0 items-center gap-3">
                <div
                  className="
                    relative
                    h-9
                    w-9
                    shrink-0
                    overflow-hidden
                    rounded-full
                    border
                    border-cyan/40
                    sm:h-10
                    sm:w-10
                  "
                >
                  <Image
                    src="/assets/echo-avatar.png"
                    alt="ECHO"
                    fill
                    sizes="40px"
                    className="object-cover"
                    priority
                  />

                  <span
                    aria-hidden="true"
                    className="
                      absolute
                      inset-0
                      rounded-full
                      ring-2
                      ring-cyan/30
                    "
                  />
                </div>

                <div className="min-w-0">
                  <div
                    className="
                      truncate
                      font-display
                      text-xs
                      font-semibold
                      tracking-[0.12em]
                      text-foreground
                      sm:text-sm
                      sm:tracking-[0.2em]
                    "
                  >
                    ECHO // SIGNAL CHANNEL
                  </div>

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      font-mono
                      text-[10px]
                      tracking-[0.2em]
                      text-cyan
                    "
                  >
                    <span
                      aria-hidden="true"
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-cyan
                        shadow-[0_0_8px_var(--cyan)]
                      "
                    />

                    ONLINE
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClose}
                aria-label="Close signal channel"
                className="
                  relative
                  z-30
                  inline-flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  text-muted-foreground
                  transition-colors
                  hover:bg-white/5
                  hover:text-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-cyan
                "
              >
                <X className="h-5 w-5" />
              </button>
            </header>

            {/* Messages */}
            <main
              ref={scrollRef}
              className="
                chat-messages
                relative
                z-10
                min-h-0
                flex-1
                space-y-4
                overflow-x-hidden
                overflow-y-auto
                overscroll-contain
                px-4
                py-5
                [scrollbar-width:thin]
                sm:px-5
                sm:py-6
              "
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
            </main>

            {/* Input area */}
            {isCollecting && (
              <footer
                className="
                  chat-input-area
                  relative
                  z-30
                  shrink-0
                  border-t
                  border-cyan/15
                  bg-background/95
                  pb-[env(safe-area-inset-bottom)]
                  shadow-[0_-8px_24px_rgba(0,0,0,0.18)]
                "
              >
                <ChatInput
                  ref={inputRef}
                  onSend={sendUserMessage}
                  disabled={isTyping}
                  placeholder={placeholder}
                />
              </footer>
            )}

            {/* Close button after submission */}
            {phase === 'submitted' && (
              <footer
                className="
                  chat-input-area
                  relative
                  z-30
                  shrink-0
                  border-t
                  border-cyan/15
                  bg-background/95
                  p-3
                  pb-[calc(0.75rem+env(safe-area-inset-bottom))]
                "
              >
                <button
                  type="button"
                  onClick={handleCloseChannel}
                  className="
                    w-full
                    rounded-full
                    border
                    border-cyan/25
                    bg-cyan/5
                    py-3
                    text-sm
                    font-medium
                    tracking-wide
                    text-cyan
                    transition-colors
                    hover:bg-cyan/10
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-cyan
                  "
                >
                  CLOSE CHANNEL
                </button>
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}