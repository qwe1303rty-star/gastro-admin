import { motion } from 'framer-motion'

export function ProgressBar({ value, color = '#6d4ff6', delay = 0 }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-surface-3">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.9, delay, ease: 'easeOut' }}
        className="h-full rounded-full"
        style={{ background: color }}
      />
    </div>
  )
}
