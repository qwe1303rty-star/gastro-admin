import { useId } from 'react'
import { motion } from 'framer-motion'

function smoothPath(points) {
  if (points.length < 2) return ''
  const d = [`M ${points[0][0]} ${points[0][1]}`]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] || p2
    const cp1x = p1[0] + (p2[0] - p0[0]) / 6
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6
    d.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2[0]} ${p2[1]}`)
  }
  return d.join(' ')
}

export function AreaChart({ data, color = '#6d4ff6', height = 150 }) {
  const id = useId().replace(/:/g, '')
  const W = 320
  const H = height
  const padX = 14
  const padTop = 18
  const padBottom = 26
  const max = Math.max(...data.map((d) => d.value)) * 1.12
  const min = Math.min(...data.map((d) => d.value)) * 0.6
  const range = max - min || 1
  const stepX = (W - padX * 2) / (data.length - 1)
  const pts = data.map((d, i) => [
    padX + i * stepX,
    padTop + (H - padTop - padBottom) * (1 - (d.value - min) / range),
  ])
  const line = smoothPath(pts)
  const area = `${line} L ${pts[pts.length - 1][0]} ${H - padBottom} L ${pts[0][0]} ${H - padBottom} Z`
  const last = pts[pts.length - 1]

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`area-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.34" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((g) => (
        <line
          key={g}
          x1={padX}
          x2={W - padX}
          y1={padTop + (H - padTop - padBottom) * g}
          y2={padTop + (H - padTop - padBottom) * g}
          className="stroke-current text-content-muted/25"
          strokeDasharray="3 5"
        />
      ))}
      <motion.path d={area} fill={`url(#area-${id})`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }} />
      <motion.path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.1, ease: 'easeInOut' }}
      />
      <motion.circle cx={last[0]} cy={last[1]} r="5" fill={color} stroke="#fff" strokeWidth="2.5" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: 'spring', stiffness: 400 }} />
      {data.map((d, i) => (
        <text key={d.label} x={padX + i * stepX} y={H - 8} textAnchor="middle" className="fill-current text-content-muted" style={{ fontSize: 10, fontWeight: 600 }}>
          {d.label}
        </text>
      ))}
    </svg>
  )
}
