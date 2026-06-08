import { useRef } from 'react'

interface Options {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number // px minimum pour déclencher
}

export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 50 }: Options) {
  const startX = useRef<number | null>(null)
  const startY = useRef<number | null>(null)

  function onTouchStart(e: React.TouchEvent) {
    startX.current = e.touches[0].clientX
    startY.current = e.touches[0].clientY
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (startX.current === null || startY.current === null) return

    const dx = e.changedTouches[0].clientX - startX.current
    const dy = e.changedTouches[0].clientY - startY.current

    // Ignorer si le mouvement est plus vertical qu'horizontal (scroll)
    if (Math.abs(dy) > Math.abs(dx)) return

    if (dx < -threshold) onSwipeLeft?.()
    else if (dx > threshold) onSwipeRight?.()

    startX.current = null
    startY.current = null
  }

  return { onTouchStart, onTouchEnd }
}
