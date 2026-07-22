export default function RingProgress({ value = 60, size = 96, stroke = 7 }) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <linearGradient id="ringGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#E8CB8B"/>
          <stop offset="1" stopColor="#A67C3A"/>
        </linearGradient>
      </defs>
      <circle cx={size/2} cy={size/2} r={r} stroke="rgba(255,255,255,.06)" strokeWidth={stroke} fill="none"/>
      <circle cx={size/2} cy={size/2} r={r} stroke="url(#ringGold)" strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c*value/100)}
        transform={`rotate(-90 ${size/2} ${size/2})`}/>
    </svg>
  )
}
