'use client'

import { useEffect, useRef } from 'react'

interface NetworkNodesProps {
  className?: string
}

export function NetworkNodes({
  className = '',
}: NetworkNodesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current

    if (!canvas) return

    const context = canvas.getContext('2d')

    if (!context) return

    let animationFrame = 0
    let width = 0
    let height = 0

    const nodes = Array.from({ length: 38 }, () => ({
      x: Math.random(),
      y: Math.random(),
      radius: Math.random() * 1.8 + 1,
      speedX: (Math.random() - 0.5) * 0.00025,
      speedY: (Math.random() - 0.5) * 0.00025,
      pulse: Math.random() * Math.PI * 2,
    }))

    const resizeCanvas = () => {
      const parent = canvas.parentElement

      if (!parent) return

      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2)

      width = parent.clientWidth
      height = parent.clientHeight

      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
    }

    const draw = (time: number) => {
      context.clearRect(0, 0, width, height)

      const positions = nodes.map((node) => {
        node.x += node.speedX
        node.y += node.speedY

        if (node.x < 0 || node.x > 1) {
          node.speedX *= -1
        }

        if (node.y < 0 || node.y > 1) {
          node.speedY *= -1
        }

        return {
          ...node,
          screenX: node.x * width,
          screenY: node.y * height,
        }
      })

      // Draw connecting lines
      positions.forEach((node, index) => {
        positions.slice(index + 1).forEach((otherNode) => {
          const distance = Math.hypot(
            node.screenX - otherNode.screenX,
            node.screenY - otherNode.screenY,
          )

          if (distance < 145) {
            const opacity = (1 - distance / 145) * 0.35

            context.beginPath()
            context.moveTo(node.screenX, node.screenY)
            context.lineTo(otherNode.screenX, otherNode.screenY)
            context.strokeStyle = `rgba(34, 211, 238, ${opacity})`
            context.lineWidth = 0.7
            context.stroke()
          }
        })
      })

      // Draw glowing nodes
      positions.forEach((node) => {
        const pulse =
          Math.sin(time * 0.002 + node.pulse) * 0.5 + 0.5

        const radius = node.radius + pulse * 1.2

        context.beginPath()
        context.arc(
          node.screenX,
          node.screenY,
          radius * 3,
          0,
          Math.PI * 2,
        )

        context.fillStyle = `rgba(34, 211, 238, ${0.04 + pulse * 0.08})`
        context.fill()

        context.beginPath()
        context.arc(
          node.screenX,
          node.screenY,
          radius,
          0,
          Math.PI * 2,
        )

        context.fillStyle = `rgba(103, 232, 249, ${0.45 + pulse * 0.55})`
        context.shadowColor = '#22d3ee'
        context.shadowBlur = 12
        context.fill()
        context.shadowBlur = 0
      })

      animationFrame = requestAnimationFrame(draw)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animationFrame = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  )
}