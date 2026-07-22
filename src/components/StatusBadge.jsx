import { STATUS_COLORS } from '../config'

export default function StatusBadge({ status, small }) {
  const color = STATUS_COLORS[status] || '#8A8A85'

  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${
        small ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-[11px]'
      }`}
      style={{ backgroundColor: color + '20', color }}
    >
      {status}
    </span>
  )
}
