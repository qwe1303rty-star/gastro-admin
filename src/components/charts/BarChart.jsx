import { motion } from 'framer-motion'

export function BarChart({ data, color = '#6d4ff6', height = 150 }) {
  const max = Math.max(...data.map((d) => d.value))
  const maxIdx = data.findIndex((d) => d.value === max)
  return (
    <div className="flex items-end justify-between gap-2" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * 100
        const isMax = i === maxIdx
        return (
          <div key={d.label} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
            <div className="relative flex w-full flex-1 items-end justify-center">
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.06, type: 'spring', stiffness: 120, damping: 18 }}
                className="w-full max-w-[26px] rounded-t-lg rounded-b-sm"
                style={{ background: isMax ? color : 'var(--surface-3)' }}
              />
            </div>
            <span className="text-[10px] font-semibold text-content-muted">{d.label}</span>
          </div>
        )
      })}
    </div>
  )
}
