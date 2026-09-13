'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export function EchoCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      })

      setVisible(true)

      const target = event.target as HTMLElement

      setHovering(
        Boolean(
          target.closest(
            'a, button, input, textarea, select, [role="button"]',
          ),
        ),
      )
    }

    const handleMouseLeave = () => {
      setVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.documentElement.addEventListener(
      'mouseleave',
      handleMouseLeave,
    )

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeave,
      )
    }
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] hidden md:block">
      {/* Main glowing point */}
      <motion.div
        animate={{
          x: position.x - 4,
          y: position.y - 4,
          scale: hovering ? 1.6 : 1,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 28,
          mass: 0.2,
        }}
        className="absolute h-2 w-2 rounded-full bg-cyan shadow-[0_0_18px_5px_rgba(34,211,238,0.8)]"
      />

      {/* Outer radar ring */}
      <motion.div
        animate={{
          x: position.x - 17,
          y: position.y - 17,
          scale: hovering ? 1.5 : 1,
          opacity: visible ? 0.8 : 0,
          rotate: hovering ? 180 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 250,
          damping: 25,
        }}
        className="absolute h-9 w-9 rounded-full border border-cyan/60"
      >
        {/* Crosshair lines */}
        <span className="absolute left-1/2 top-[-5px] h-2 w-px -translate-x-1/2 bg-cyan" />
        <span className="absolute bottom-[-5px] left-1/2 h-2 w-px -translate-x-1/2 bg-cyan" />
        <span className="absolute left-[-5px] top-1/2 h-px w-2 -translate-y-1/2 bg-cyan" />
        <span className="absolute right-[-5px] top-1/2 h-px w-2 -translate-y-1/2 bg-cyan" />
      </motion.div>

      {/* Expanding signal pulse */}
      <motion.div
        animate={{
          x: position.x - 25,
          y: position.y - 25,
          scale: [0.7, 1.4],
          opacity: [0.5, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeOut',
        }}
        className="absolute h-[50px] w-[50px] rounded-full border border-cyan/40"
      />
    </div>
  )
}