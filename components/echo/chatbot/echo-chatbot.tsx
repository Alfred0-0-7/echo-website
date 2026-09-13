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

  const [isServerLoading, setIsServerLoading] = useState(false)

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
   * Send the message and show loading while the server responds.
   */
  const handleSendUserMessage = useCallback(
    async (message: string) => {
      setIsServerLoading(true)

      try {
        await sendUserMessage(message)
      } catch (error) {
        console.error('Error sending grievance:', error)
      } finally {
        setIsServerLoading(false)
      }
    },
    [sendUserMessage],
  )

  /*
   * Scroll whenever chat content changes.
   */
  useEffect(() => {
    if (!open) return

    const timer = window.setTimeout(() => {
      scrollToBottom('auto')
    }, 80)

    return () => {
      window.clearTimeout(timer)
    }
  }, [
    open,
    messages,
    isTyping,
    isServerLoading,
    phase,
    analysis,
    scrollToBottom,
  ])

  /*
   * Focus the input after ECHO finishes typing.
   */
  useEffect(() => {
    if (
      !isTyping &&
      !isServerLoading &&
      isCollecting &&
      open
    ) {
      const timer = window.setTimeout(() => {
        inputRef.current?.focus()
        scrollToBottom('auto')
      }, 150)

      return () => {
        window.clearTimeout(timer)
      }
    }
  }, [
    isTyping,
    isServerLoading,
    isCollecting,
    phase,
    open,
    scrollToBottom,
  ])

  /*
   * Lock the background page while chatbot is open.
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
          transition={{ duration: 0.3 }}
          className="
            pointer-events-none
            fixed
            inset-0
            z-[999]
            flex
            items-end
            justify-end
            overflow-hidden
            overscroll-none
            bg-transparent
            p-4
            sm:p-5
          "
          role="dialog"
          aria-modal="true"
          aria-label="ECHO signal channel"
        >
          <motion.div
            initial={{
              opacity: 0,
              x: 30,
              y: 20,
              scale: 0.98,
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              x: 30,
              y: 20,
              scale: 0.98,
            }}
            transition={{
              duration: 0.4,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(event) => event.stopPropagation()}
            className="
              pointer-events-auto
              relative
              flex
              h-[620px]
              max-h-[calc(100vh-40px)]
              w-[420px]
              max-w-full
              min-h-0
              flex-col
              overflow-hidden
              overscroll-none
              rounded-2xl
              border
              border-cyan/20
              bg-background/95
              shadow-2xl
              backdrop-blur-xl
              max-sm:h-[520px]
              max-sm:w-full
              max-sm:max-w-[calc(100vw-32px)]
              max-sm:rounded-2xl
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
                  />

                  <span className="absolute inset-0 rounded-full ring-2 ring-cyan/30" />
                </div>

                <div className="min-w-0">
                  <div
                    className="
                      truncate
                      font-display
                      text-xs
                      font-semibold
                      tracking-[0.16em]
                      text-foreground
                      sm:text-sm
                      sm:tracking-[0.25em]
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
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan shadow-[0_0_8px_var(--cyan)]" />
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

              {/* Server loading indicator */}
              {isServerLoading && (
                <div className="flex justify-start">
                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-cyan/20
                      bg-cyan/5
                      px-4
                      py-3
                      text-sm
                      text-cyan
                    "
                    role="status"
                    aria-live="polite"
                  >
                    <span
                      className="
                        h-4
                        w-4
                        animate-spin
                        rounded-full
                        border-2
                        border-cyan/30
                        border-t-cyan
                      "
                    />

                    <span>
                      Connecting to ECHO server...
                    </span>
                  </div>
                </div>
              )}

              {/* Normal typing indicator */}
              {isTyping && !isServerLoading && (
                <div className="flex justify-start">
                  <TypingIndicator />
                </div>
              )}

              {/* Signal analysis */}
              {(phase === 'analysis' ||
                phase === 'transmitting') &&
                analysis && (
                  <SignalAnalysis
                    analysis={analysis}
                    onTransmit={submit}
                    transmitting={phase === 'transmitting'}
                  />
                )}

              {/* Submission success */}
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
                  onSend={handleSendUserMessage}
                  disabled={isTyping || isServerLoading}
                  placeholder={
                    isServerLoading
                      ? 'Waiting for server...'
                      : placeholder
                  }
                />
              </footer>
            )}

            {/* Close button after submission */}
            {phase === 'submitted' && (
              <div
                className="
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
                  "
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