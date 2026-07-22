import { STATUS_MAP } from '../../lib/data'

export function StatusPill({ statusKey, size = 'md' }) {
  const c = STATUS_MAP[Object.entries(STATUS_MAP).find(([, v]) => v.key === statusKey)?.[0]] || { color: '#666', soft: 'rgba(100,100,100,0.12)', label: statusKey }
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${size === 'sm' ? 'px-2.5 py-1 text-[11px]' : 'px-3 py-1.5 text-xs'}`}
      style={{ backgroundColor: c.soft, color: c.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: c.color }} />
      {c.label}
    </span>
  )
}
