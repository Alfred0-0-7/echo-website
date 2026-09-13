'use client'

import { useCallback, useRef, useState } from 'react'

import {
  analyzeSignal,
  transmitSignal,
  type SignalAnalysisResult,
  type SignalPayload,
} from '@/services/api'

export type ChatRole = 'echo' | 'user'

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
}

export type CollectStep =
  | 'name'
  | 'age'
  | 'location'
  | 'email'
  | 'grievance'

export type ChatPhase =
  | CollectStep
  | 'analyzing'
  | 'analysis'
  | 'transmitting'
  | 'submitted'

interface StepConfig {
  key: CollectStep

  /** Prompt ECHO speaks to request this field */
  prompt: (data: Partial<SignalPayload>) => string

  validate?: (value: string) => string | null
}

const STEPS: StepConfig[] = [
  {
    key: 'name',
    prompt: () =>
      "I can hear you. Before we continue, what should I call you?",
  },
  {
    key: 'age',
    prompt: (data) =>
      `Good to meet you, ${data.name}. How old are you?`,
    validate: (value) =>
      /^\d{1,3}$/.test(value.trim())
        ? null
        : 'I just need a number for your age.',
  },
  {
    key: 'location',
    prompt: () => 'Where are you sending this signal from?',
  },
  {
    key: 'email',
    prompt: () =>
      'If your signal needs a response, where can I reach you? Share your email.',
    validate: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
        ? null
        : 'That email looks incomplete.',
  },
  {
    key: 'grievance',
    prompt: () => 'So... tell me. How can I help you?',
  },
]

let idCounter = 0

const nextId = () => `msg-${Date.now()}-${idCounter++}`

const createIntroMessages = (): ChatMessage[] => [
  {
    id: nextId(),
    role: 'echo',
    content: 'Signal detected.',
  },
  {
    id: nextId(),
    role: 'echo',
    content: STEPS[0].prompt({}),
  },
]

export function useChat() {
  const [messages, setMessages] =
    useState<ChatMessage[]>(createIntroMessages)

  const [phase, setPhase] = useState<ChatPhase>('name')
  const [isTyping, setIsTyping] = useState(false)

  const [analysis, setAnalysis] =
    useState<SignalAnalysisResult | null>(null)

  const dataRef = useRef<Partial<SignalPayload>>({})

  const pushEcho = useCallback(
    (content: string, delayMs = 700) => {
      return new Promise<void>((resolve) => {
        setIsTyping(true)

        setTimeout(() => {
          setIsTyping(false)

          setMessages((previousMessages) => [
            ...previousMessages,
            {
              id: nextId(),
              role: 'echo',
              content,
            },
          ])

          resolve()
        }, delayMs)
      })
    },
    [],
  )

  const currentStepIndex = useCallback(() => {
    return STEPS.findIndex((step) => step.key === phase)
  }, [phase])

  const runAnalysis = useCallback(async () => {
    setPhase('analyzing')

    await pushEcho(
      'Let me trace the resonance of what you told me...',
      600,
    )

    const result = await analyzeSignal(
      dataRef.current as SignalPayload,
    )

    if (result.reply) {
      await pushEcho(result.reply, 500)
    }

    const formattedAnalysis: SignalAnalysisResult = {
  category: result.category,
  priority: result.priority,
  status: result.status,
  signalId: result.signalId,
  summary: result.summary,
  followUpQuestion: result.followUpQuestion,
  reply: result.reply,
  online: result.online,
}

    setAnalysis(formattedAnalysis)
    setPhase('analysis')
  }, [pushEcho])

  const submit = useCallback(async () => {
    if (!analysis) return

    setPhase('transmitting')

    try {
      const result = await transmitSignal(
        dataRef.current as SignalPayload,
        analysis,
      )

      setAnalysis((previousAnalysis) =>
        previousAnalysis
          ? {
              ...previousAnalysis,
              signalId: result.signalId,
            }
          : previousAnalysis,
      )

      setPhase('submitted')
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred'

      await pushEcho(
        `${errorMessage}. Your signal wasn't transmitted — you can try again.`,
        400,
      )

      setPhase('analysis')
    }
  }, [analysis, pushEcho])

  const sendUserMessage = useCallback(
    async (raw: string) => {
      const value = raw.trim()

      if (!value) return

      const index = currentStepIndex()

      if (index === -1) return

      const step = STEPS[index]
      const error = step.validate?.(value)

      setMessages((previousMessages) => [
        ...previousMessages,
        {
          id: nextId(),
          role: 'user',
          content: value,
        },
      ])

      if (error) {
        await pushEcho(error, 500)
        return
      }

      dataRef.current[step.key] = value

      const isLastStep = index === STEPS.length - 1

      if (isLastStep) {
        await runAnalysis()
        return
      }

      const nextStep = STEPS[index + 1]

      setPhase(nextStep.key)

      await pushEcho(nextStep.prompt(dataRef.current))
    },
    [currentStepIndex, pushEcho, runAnalysis],
  )

  const resetChat = useCallback(() => {
    dataRef.current = {}

    setMessages(createIntroMessages())
    setPhase('name')
    setIsTyping(false)
    setAnalysis(null)
  }, [])

  const isCollecting = STEPS.some(
    (step) => step.key === phase,
  )

  return {
    messages,
    phase,
    isTyping,
    isCollecting,
    analysis,
    data: dataRef.current,
    sendUserMessage,
    submit,
    resetChat,
  }
}