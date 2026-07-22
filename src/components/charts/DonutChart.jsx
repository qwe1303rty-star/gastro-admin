import { motion } from 'framer-motion'

export function DonutChart({ segments, size = 150, thickness = 16, centerLabel, centerValue }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1
  const r = (size - thickness) / 2
  const c = 2 * Math.PI * r
  let offset = 0
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {segments.map((s) => {
          const len = (s.value / total) * c
          const dash = `${len} ${c - len}`
          const off = -offset
          const node = (
            <motion.circle
              key={s.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeLinecap="round"
              strokeDasharray={dash}
              initial={{ strokeDashoffset: c }}
              animate={{ strokeDashoffset: off }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
            />
          )
          offset += len
          return node
        })}
      </svg>
      {centerValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-extrabold text-content">{centerValue}</span>
          {centerLabel && <span className="text-[10px] font-semibold uppercase tracking-wide text-content-muted">{centerLabel}</span>}
        </div>
      )}
    </div>
  )
}
