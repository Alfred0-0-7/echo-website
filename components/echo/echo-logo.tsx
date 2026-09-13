interface EchoLogoProps {
  className?: string
  title?: string
}

/**
 * Abstract signal-wave mark for ECHO. Pure SVG so it stays crisp on retina displays.
 */
export function EchoLogo({ className, title = 'ECHO signal logo' }: EchoLogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label={title}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="3.2" fill="currentColor" />
      <path
        d="M15.5 17.5c-2.2 1.9-3.6 4.6-3.6 7.6s1.4 5.7 3.6 7.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M32.5 17.5c2.2 1.9 3.6 4.6 3.6 7.6s-1.4 5.7-3.6 7.6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      <path
        d="M10 12c-3.8 3.2-6.2 8-6.2 13.1S6.2 34.9 10 38.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.45"
      />
      <path
        d="M38 12c3.8 3.2 6.2 8 6.2 13.1S41.8 34.9 38 38.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.45"
      />
    </svg>
  )
}
