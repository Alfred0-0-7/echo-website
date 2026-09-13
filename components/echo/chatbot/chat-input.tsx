'use client'

import {
  forwardRef,
  useState,
  type KeyboardEvent,
} from 'react'

import { SendHorizontal } from 'lucide-react'

interface ChatInputProps {
  onSend: (value: string) => void
  disabled?: boolean
  placeholder?: string
}

export const ChatInput = forwardRef<HTMLInputElement, ChatInputProps>(
  function ChatInput(
    {
      onSend,
      disabled,
      placeholder,
    },
    ref,
  ) {
    const [value, setValue] = useState('')

    function submit() {
      const trimmed = value.trim()

      if (!trimmed || disabled) return

      onSend(trimmed)
      setValue('')
    }

    function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
      if (
        e.key === 'Enter' &&
        !e.nativeEvent.isComposing &&
        e.keyCode !== 229
      ) {
        e.preventDefault()
        submit()
      }
    }

    return (
      <div className="flex min-w-0 items-center gap-2 bg-background/60 p-3 backdrop-blur">
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder ?? 'Transmit your message...'}
          aria-label="Message to ECHO"
          enterKeyHint="send"
          className="
            min-w-0
            flex-1
            rounded-full
            border
            border-cyan/20
            bg-card/60
            px-4
            py-3
            text-base
            text-foreground
            placeholder:text-muted-foreground/60
            focus:border-cyan/50
            focus:outline-none
            focus:ring-1
            focus:ring-cyan/40
            disabled:opacity-50
          "
        />

        <button
          type="button"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          className="
            inline-flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-cyan
            text-primary-foreground
            transition-all
            hover:shadow-[0_0_20px_-4px_var(--cyan)]
            disabled:cursor-not-allowed
            disabled:opacity-40
          "
        >
          <SendHorizontal className="h-5 w-5" />
        </button>
      </div>
    )
  },
)