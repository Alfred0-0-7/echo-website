import type { Metadata, Viewport } from 'next'
import { Sora, Chakra_Petch, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  display: 'swap',
})

const chakraPetch = Chakra_Petch({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-chakra',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'ECHO — The Signal Guardian',
  description:
    'ECHO listens for the signals others miss. A superhero help platform that turns unheard problems into action. I hear what others ignore.',
  generator: 'v0.app',
  keywords: [
    'ECHO',
    'Signal Guardian',
    'superhero',
    'help platform',
    'grievance',
    'signal',
  ],
  openGraph: {
    title: 'ECHO — The Signal Guardian',
    description: 'I hear what others ignore. Send your signal.',
    type: 'website',
  },
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0a0e14',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`dark ${sora.variable} ${chakraPetch.variable} ${jetbrainsMono.variable}`}
    >
      <body className="bg-background text-foreground overflow-x-hidden">
        {children}

        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}