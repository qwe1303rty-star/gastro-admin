import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

export function PullToRefresh({ onRefresh, children }) {
  const scrollRef = useRef(null)
  const [pull, setPull] = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const refreshingRef = useRef(false)
  const THRESHOLD = 62

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let startY = 0
    let pulling = false

    const onStart = (e) => {
      if (el.scrollTop <= 0 && !refreshingRef.current) {
        startY = e.touches[0].clientY
        pulling = true
      } else pulling = false
    }
    const onMove = (e) => {
      if (!pulling || refreshingRef.current) return
      const dy = e.touches[0].clientY - startY
      if (dy > 0 && el.scrollTop <= 0) {
        const p = Math.min(dy * 0.5, 84)
        setPull(p)
        if (dy > 6) e.preventDefault()
      }
    }
    const onEnd = () => {
      if (!pulling) return
      pulling = false
      if (pull >= THRESHOLD && !refreshingRef.current) {
        refreshingRef.current = true
        setRefreshing(true)
        setPull(THRESHOLD)
        onRefresh().finally(() => {
          refreshingRef.current = false
          setRefreshing(false)
          setPull(0)
        })
      } else {
        setPull(0)
      }
    }

    el.addEventListener('touchstart', onStart, { passive: true })
    el.addEventListener('touchmove', onMove, { passive: false })
    el.addEventListener('touchend', onEnd, { passive: true })
    return () => {
      el.removeEventListener('touchstart', onStart)
      el.removeEventListener('touchmove', onMove)
      el.removeEventListener('touchend', onEnd)
    }
  }, [onRefresh, pull])

  const pct = Math.min(pull / THRESHOLD, 1)
  return (
    <div className="relative min-h-0 flex-1">
      <div
        className="pointer-events-none absolute left-1/2 z-10 -translate-x-1/2"
        style={{ top: refreshing ? 14 : pull * 0.55 - 26, opacity: pull > 2 || refreshing ? 1 : 0 }}
      >
        <Loader2
          size={24}
          className={refreshing ? 'animate-spin text-primary-500' : 'text-primary-500'}
          style={{ transform: `rotate(${pct * 280}deg)` }}
        />
      </div>
      <div ref={scrollRef} className="no-scrollbar h-full overflow-y-auto">
        <motion.div animate={{ y: refreshing ? THRESHOLD : pull }} transition={{ type: 'spring', stiffness: 400, damping: refreshing ? 30 : 50 }}>
          {children}
        </motion.div>
        {refreshing && <div style={{ height: THRESHOLD }} />}
      </div>
    </div>
  )
}
