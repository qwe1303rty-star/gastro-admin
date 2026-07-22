import { motion } from 'framer-motion'
import { ChevronLeft, RefreshCw } from 'lucide-react'

export function TopBar({ title, subtitle, onBack, actions }) {
  return (
    <div className="flex items-center gap-3 px-5 pb-3 pt-14">
      {onBack && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-content"
        >
          <ChevronLeft size={20} />
        </motion.button>
      )}
      <div className="min-w-0 flex-1">
        <h1 className="truncate text-[1.45rem] font-extrabold leading-tight tracking-tight text-content">{title}</h1>
        {subtitle && <p className="truncate text-[13px] font-medium text-content-muted">{subtitle}</p>}
      </div>
      {actions}
    </div>
  )
}

export function RefreshButton({ onClick }) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-content-soft"
      aria-label="Обновить"
    >
      <RefreshCw size={18} />
    </motion.button>
  )
}
