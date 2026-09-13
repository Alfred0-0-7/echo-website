/**
 * Frontend service layer for ECHO.
 *
 * All network calls to the FastAPI backend live here so the UI stays decoupled
 * from transport details.
 *
 * The backend base URL comes from:
 *
 * NEXT_PUBLIC_API_URL
 *
 * Example:
 * http://localhost:8000
 */

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8000'

export interface SignalPayload {
  name: string
  age: string
  location: string
  email: string
  grievance: string
}

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

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  HEALTH: [
    'hospital',
    'sick',
    'doctor',
    'medicine',
    'health',
    'clinic',
    'injury',
    'mental',
  ],

  SAFETY: [
    'unsafe',
    'danger',
    'crime',
    'accident',
    'fire',
    'threat',
    'harass',
    'violence',
  ],

  EDUCATION: [
    'school',
    'student',
    'college',
    'teacher',
    'exam',
    'education',
    'learn',
    'class',
  ],

  ENVIRONMENT: [
    'pollution',
    'garbage',
    'water',
    'tree',
    'waste',
    'air',
    'flood',
    'environment',
  ],

  COMMUNITY: [
    'neighbor',
    'community',
    'road',
    'street',
    'help',
    'people',
    'local',
    'housing',
  ],
}

const HIGH_PRIORITY_KEYWORDS = [
  'urgent',
  'emergency',
  'immediately',
  'danger',
  'critical',
  'now',
  'help me',
]

function heuristicCategory(text: string): string {
  const lowered = text.toLowerCase()

  let category = 'COMMUNITY'
  let bestScore = 0

  for (const [currentCategory, keywords] of Object.entries(
    CATEGORY_KEYWORDS,
  )) {
    const score = keywords.reduce(
      (total, keyword) =>
        total + (lowered.includes(keyword) ? 1 : 0),
      0,
    )

    if (score > bestScore) {
      bestScore = score
      category = currentCategory
    }
  }

  return category
}

function heuristicPriority(
  text: string,
): SignalAnalysisResult['priority'] {
  const lowered = text.toLowerCase()

  return HIGH_PRIORITY_KEYWORDS.some((keyword) =>
    lowered.includes(keyword),
  )
    ? 'HIGH'
    : 'NORMAL'
}

function localSignalId(): string {
  return `ECHO-${Date.now().toString(36).toUpperCase()}`
}

/**
 * Ask ECHO to acknowledge and categorize the grievance.
 *
 * If the backend is unreachable, a local fallback is used.
 */
export async function analyzeSignal(
  payload: SignalPayload,
): Promise<SignalAnalysisResult> {
  const priority = heuristicPriority(payload.grievance)

  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: payload.grievance,
        conversation: [],
        visitor: {
          name: payload.name,
          age: Number(payload.age) || null,
          location: payload.location,
          email: payload.email,
        },
        stage: 'grievance',
      }),
    })

    const data = await response.json().catch(() => null)

    if (!response.ok || !data) {
      throw new Error(
        data?.error || 'Chat request failed',
      )
    }

    return {
  category:
    data.suggested_category ||
    data.category ||
    heuristicCategory(payload.grievance),

  priority,

  status: 'READY FOR TRANSMISSION',

  signalId: localSignalId(),

  summary: data.summary || payload.grievance,

  followUpQuestion:
    data.follow_up_question || null,

  reply: data.reply,

  online: true,
}
  } catch (error) {
    console.log(
      '[ECHO] analyzeSignal falling back to local heuristic:',
      error instanceof Error
        ? error.message
        : error,
    )

    return {
  category: heuristicCategory(payload.grievance),
  priority,
  status: 'READY FOR TRANSMISSION',
  signalId: localSignalId(),
  summary: payload.grievance,
  followUpQuestion: null,
  online: false,
}
  }
}

export interface TransmitResult {
  ok: true
  signalId: string
  emailSent: boolean
  online: boolean
}

/**
 * Persist the grievance and trigger the email notification.
 *
 * If the backend is unreachable, a local acknowledgement is returned.
 */
export async function transmitSignal(
  payload: SignalPayload,
  analysis: SignalAnalysisResult,
): Promise<TransmitResult> {
  let response: Response

  try {
    response = await fetch(`${API_URL}/api/grievance`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: payload.name,
        age: Number(payload.age),
        location: payload.location,
        email: payload.email,
        grievance: payload.grievance,
        category: analysis.category,
        priority:
          analysis.priority === 'CRITICAL'
            ? 'HIGH'
            : analysis.priority,
      }),
    })
  } catch (error) {
    console.log(
      '[ECHO] transmitSignal offline fallback:',
      error instanceof Error
        ? error.message
        : error,
    )

    return {
      ok: true,
      signalId: analysis.signalId,
      emailSent: false,
      online: false,
    }
  }

  const data = await response.json().catch(() => null)

  if (!response.ok || !data?.success) {
    throw new Error(
      data?.error || 'Signal transmission failed',
    )
  }

  return {
    ok: true,
    signalId:
      data.grievance_id || analysis.signalId,
    emailSent: Boolean(data.email_sent),
    online: true,
  }
}