import { motion } from 'framer-motion'

export function Switch({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${checked ? 'bg-primary-500' : 'bg-surface-3'}`}
      role="switch"
      aria-checked={checked}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 600, damping: 34 }}
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-md ${checked ? 'right-1' : 'left-1'}`}
      />
    </button>
  )
}
