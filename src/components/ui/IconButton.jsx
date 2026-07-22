import { motion } from 'framer-motion'

export function IconButton({ children, onClick, badge, className = '', active, ariaLabel }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={ariaLabel}
      className={`relative grid place-items-center h-11 w-11 rounded-2xl border border-line ${active ? 'bg-primary-500/12 text-primary-300' : 'bg-surface text-content-soft'} tap ${className}`}
    >
      {children}
      {badge && badge > 0 ? (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 grid min-h-[18px] min-w-[18px] place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white ring-2 ring-surface"
        >
          {badge > 9 ? '9+' : badge}
        </motion.span>
      ) : null}
    </motion.button>
  )
}
