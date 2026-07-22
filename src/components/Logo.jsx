export function Logo({ className = 'h-11 w-11', showWordmark = false, wordmarkClass = '', wordmarkText = 'ГС' }) {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 48 48" className={className} aria-hidden="true">
        <defs>
          <linearGradient id="gas-mark" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9b6bff" />
            <stop offset="55%" stopColor="#6d4ff6" />
            <stop offset="100%" stopColor="#4c2fe0" />
          </linearGradient>
          <linearGradient id="gas-shine" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M24 2.5c8 0 11 .1 13.6 1.3a13 13 0 0 1 6.6 6.6C45.4 13 45.5 16 45.5 24s-.1 11-1.3 13.6a13 13 0 0 1-6.6 6.6C35 45.4 32 45.5 24 45.5s-11-.1-13.6-1.3a13 13 0 0 1-6.6-6.6C2.6 35 2.5 32 2.5 24s.1-11 1.3-13.6a13 13 0 0 1 6.6-6.6C13 2.6 16 2.5 24 2.5Z"
          fill="url(#gas-mark)"
        />
        <path
          d="M24 2.5c8 0 11 .1 13.6 1.3a13 13 0 0 1 6.6 6.6C45.4 13 45.5 16 45.5 24s-.1 11-1.3 13.6a13 13 0 0 1-6.6 6.6C35 45.4 32 45.5 24 45.5s-11-.1-13.6-1.3a13 13 0 0 1-6.6-6.6C2.6 35 2.5 32 2.5 24s.1-11 1.3-13.6a13 13 0 0 1 6.6-6.6C13 2.6 16 2.5 24 2.5Z"
          fill="url(#gas-shine)"
        />
        <text x="24" y="30" textAnchor="middle" fill="white" fontSize="16" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">ГС</text>
      </svg>
      {showWordmark && (
        <div className={wordmarkClass}>
          <div className="text-[1.35rem] font-extrabold leading-none tracking-[0.14em]">
            {wordmarkText}
          </div>
        </div>
      )}
    </div>
  )
}
