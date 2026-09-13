'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

import { LoadingScreen } from './loading-screen'
import { Navbar } from './navbar'
import { Hero } from './hero'
import { SignalScanner } from './signal-scanner'
import { EchoIntro } from './echo-intro'
import { Powers } from './powers'
import { OriginStory } from './origin-story'
import { SignalNetwork } from './signal-network'
import { ChatbotCta } from './chatbot-cta'
import { Footer } from './footer'
import { EchoChatbot } from './chatbot/echo-chatbot'

export function EchoHome() {
  const [loading, setLoading] = useState(true)
  const [chatOpen, setChatOpen] = useState(false)

  const chatbotTimerRef = useRef<number | null>(null)

  const openChat = () => {
    setChatOpen(true)
  }

  // Start the timer when the loading screen finishes
  function handleLoadingComplete() {
    setLoading(false)

    chatbotTimerRef.current = window.setTimeout(() => {
      setChatOpen(true)
    }, 2000)
  }

  // Clear the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (chatbotTimerRef.current !== null) {
        window.clearTimeout(chatbotTimerRef.current)
      }
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {/* Navbar is hidden during loading */}
      {!loading && <Navbar onOpenChat={openChat} />}

      <main>
        <Hero onOpenChat={openChat} />
        <SignalScanner />
        <EchoIntro />
        <Powers />
        <OriginStory />
        <SignalNetwork />
        <ChatbotCta onOpenChat={openChat} />
      </main>

      <Footer />

      {/* Floating chatbot button appears only after loading */}
      {!loading && (
        <button
          type="button"
          onClick={openChat}
          aria-label="Open ECHO chatbot"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-400 text-black shadow-lg transition-transform duration-300 hover:scale-110"
        >
          <MessageCircle size={25} />
        </button>
      )}

      <EchoChatbot
        open={chatOpen}
        onClose={() => setChatOpen(false)}
      />
    </>
  )
}