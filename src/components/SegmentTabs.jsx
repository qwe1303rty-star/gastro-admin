import { motion } from 'framer-motion'

export function SegmentTabs({ options, value, onChange }) {
  return (
    <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5">
      {options.map((o) => {
        const active = o.key === value
        return (
          <button
            key={o.key}
            onClick={() => onChange(o.key)}
            className={`relative flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              active ? 'border-transparent text-white' : 'border-line bg-surface text-content-soft'
            }`}
          >
            {active && (
              <motion.span layoutId="seg-tab" className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-400 to-primary-700" transition={{ type: 'spring', stiffness: 480, damping: 34 }} />
            )}
            <span className="relative z-10">{o.label}</span>
            {o.count !== undefined && (
              <span className={`relative z-10 rounded-full px-1.5 text-[11px] font-bold ${active ? 'bg-white/25' : 'bg-surface-3 text-content-muted'}`}>{o.count}</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
