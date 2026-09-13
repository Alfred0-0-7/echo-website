'use client'

import { motion } from 'framer-motion'
import {
  CheckCircle2,
  ArrowRight,
  AlertTriangle,
  FileText,
  Tag,
  Gauge,
} from 'lucide-react'
export interface SignalAnalysisResult {
  category: string
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'CRITICAL'
  status: string
  signalId: string
  summary: string
  followUpQuestion?: string | null
  reply?: string
  online?: boolean
}
export interface ChatResponse {
  reply: string
  stage: string
  suggested_category: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  summary: string
  follow_up_question: string
  ready_to_submit: boolean
}
interface SignalAnalysisProps {
  analysis: SignalAnalysisResult
  onTransmit: () => void
  transmitting: boolean
}

const priorityColor: Record<
  SignalAnalysisResult['priority'],
  string
> = {
  LOW: 'text-muted-foreground',
  NORMAL: 'text-cyan',
  HIGH: 'text-magenta',
  CRITICAL: 'text-red-400',
}

export function SignalAnalysis({
  analysis,
  onTransmit,
  transmitting,
}: SignalAnalysisProps) {
  const priority =
    analysis.priority?.toUpperCase() as SignalAnalysisResult['priority']

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass rounded-2xl p-5"
    >
      <div className="mb-5 flex items-center gap-2 font-mono text-xs tracking-[0.3em] text-cyan">
        <CheckCircle2 className="h-4 w-4" />
        SIGNAL ANALYSIS
      </div>

      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <Tag className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              CATEGORY
            </p>

            <p className="mt-1 text-sm font-semibold text-foreground">
              {analysis.category || 'OTHER'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Gauge className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              PRIORITY
            </p>

            <p
              className={`mt-1 text-sm font-semibold ${
                priorityColor[priority] ?? 'text-foreground'
              }`}
            >
              {priority || 'MEDIUM'}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-cyan" />

          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] tracking-[0.2em] text-muted-foreground">
              AI-GENERATED SUMMARY
            </p>

            <p className="mt-1 text-sm leading-relaxed text-foreground">
              {analysis.summary || 'No summary generated yet.'}
            </p>
          </div>
        </div>

        {analysis.followUpQuestion && (
          <div className="rounded-xl border border-cyan/20 bg-cyan/5 p-3">
            <p className="font-mono text-[10px] tracking-[0.2em] text-cyan">
              FOLLOW-UP QUESTION
            </p>

            <p className="mt-1 text-sm leading-relaxed text-foreground">
              {analysis.followUpQuestion}
            </p>
          </div>
        )}

        {analysis.signalId && (
          <div className="flex items-center justify-between border-t border-white/5 pt-3 font-mono text-xs">
            <span className="tracking-[0.2em] text-muted-foreground">
              SIGNAL ID
            </span>

            <span className="text-foreground">
              {analysis.signalId}
            </span>
          </div>
        )}
      </div>

      <button
        onClick={onTransmit}
        disabled={transmitting}
        className="group mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-cyan px-6 py-3.5 text-sm font-semibold tracking-wide text-primary-foreground transition-all hover:shadow-[0_0_28px_-6px_var(--cyan)] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {transmitting ? 'TRANSMITTING...' : 'CONFIRM & TRANSMIT SIGNAL'}

        {!transmitting && (
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        )}
      </button>

      {priority === 'CRITICAL' && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-300">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />

          <p>
            If you are in immediate danger, contact your local emergency
            service immediately. ECHO cannot directly provide emergency help.
          </p>
        </div>
      )}
    </motion.div>
  )
}