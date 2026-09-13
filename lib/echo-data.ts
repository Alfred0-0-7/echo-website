import {
  Users,
  HeartPulse,
  GraduationCap,
  ShieldCheck,
  Leaf,
  Wifi,
  type LucideIcon,
} from 'lucide-react'

export interface SignalCategory {
  id: string
  label: string
  icon: LucideIcon
  /** relative position (0-100) used by the network + scanner visualizations */
  x: number
  y: number
  blurb: string
}

export const SIGNAL_CATEGORIES: SignalCategory[] = [
  {
    id: 'community',
    label: 'COMMUNITY',
    icon: Users,
    x: 22,
    y: 30,
    blurb: 'Neighborhood needs, local disputes and voices with no channel to be heard.',
  },
  {
    id: 'health',
    label: 'HEALTH',
    icon: HeartPulse,
    x: 68,
    y: 22,
    blurb: 'Access gaps, wellbeing alerts and silent emergencies across the city.',
  },
  {
    id: 'education',
    label: 'EDUCATION',
    icon: GraduationCap,
    x: 80,
    y: 58,
    blurb: 'Learning barriers and students slipping quietly through the cracks.',
  },
  {
    id: 'safety',
    label: 'SAFETY',
    icon: ShieldCheck,
    x: 38,
    y: 68,
    blurb: 'Hazards, unsafe zones and warnings that never reach the right people.',
  },
  {
    id: 'environment',
    label: 'ENVIRONMENT',
    icon: Leaf,
    x: 15,
    y: 56,
    blurb: 'Pollution, waste and ecological signals fading beneath the noise.',
  },
  {
    id: 'digital',
    label: 'DIGITAL',
    icon: Wifi,
    x: 58,
    y: 46,
    blurb: 'Connectivity gaps and digital exclusion in an always-online world.',
  },
]
