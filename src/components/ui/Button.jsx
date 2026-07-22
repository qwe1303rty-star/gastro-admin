import { forwardRef, useCallback, useState } from 'react'
import { motion } from 'framer-motion'

function useRipple() {
  const [ripples, setRipples] = useState([])
  const onPointer = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const item = { id: Date.now(), x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2, size }
    setRipples((r) => [...r, item])
    window.setTimeout(() => setRipples((r) => r.filter((x) => x.id !== item.id)), 600)
  }, [])
  const node = ripples.map((r) => (
    <motion.span
      key={r.id}
      initial={{ scale: 0, opacity: 0.35 }}
      animate={{ scale: 1.6, opacity: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="pointer-events-none absolute rounded-full bg-current"
      style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
    />
  ))
  return { onPointer, node }
}

const VARIANTS = {
  primary: 'text-white bg-gradient-to-br from-primary-400 to-primary-700 shadow-brand border-transparent',
  surface: 'bg-surface-2 text-content border-line',
  soft: 'bg-primary-500/12 text-primary-300 border-transparent',
  ghost: 'bg-transparent text-content-soft border-transparent',
  danger: 'text-white bg-gradient-to-br from-error-400 to-error-600 border-transparent',
}
const SIZES = { sm: 'h-10 px-4 text-sm', md: 'h-12 px-5 text-[0.95rem]', lg: 'h-14 px-6 text-base' }

export const Button = forwardRef(function Button(
  { variant = 'primary', size = 'md', full, loading, className = '', children, onPointerDown, disabled, ...rest },
  ref
) {
  const ripple = useRipple()
  return (
    <motion.button
      ref={ref}
      whileTap={{ scale: disabled || loading ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onPointerDown={(e) => {
        if (!disabled && !loading) ripple.onPointer(e)
        onPointerDown?.(e)
      }}
      disabled={disabled || loading}
      className={`relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-2xl font-semibold tracking-tight select-none ${VARIANTS[variant]} ${SIZES[size]} ${full ? 'w-full' : ''} disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...rest}
    >
      {ripple.node}
      {loading ? (
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        children
      )}
    </motion.button>
  )
})
