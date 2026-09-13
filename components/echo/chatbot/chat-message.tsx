'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { ChatMessage as ChatMessageType } from '@/hooks/use-chat'
import { cn } from '@/lib/utils'

interface ChatMessageProps {
  message: ChatMessageType
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isEcho = message.role === 'echo'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex items-end gap-2.5', isEcho ? 'justify-start' : 'justify-end')}
    >
      {isEcho && (
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border border-cyan/40">
          <Image
            src="/assets/echo-avatar.png"
            alt="ECHO"
            fill
            sizes="32px"
            className="object-cover"
          />
        </div>
      )}
      <div
        className={cn(
          'max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed',
          isEcho
            ? 'rounded-tl-sm border border-cyan/25 bg-card/70 text-foreground shadow-[0_0_24px_-12px_var(--cyan)]'
            : 'rounded-tr-sm border border-accent/30 bg-accent/10 text-foreground',
        )}
      >
        {message.content}
      </div>
    </motion.div>
  )
}
