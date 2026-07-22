import { useEffect, useState } from 'react'

function AmbientBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 hidden overflow-hidden sm:block">
      <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-primary-500/30 blur-[100px] animate-floaty" />
      <div className="absolute -right-28 top-1/3 h-96 w-96 rounded-full bg-accent-500/25 blur-[110px] animate-floaty" style={{ animationDelay: '-4s' }} />
      <div className="absolute -bottom-28 left-1/4 h-80 w-80 rounded-full bg-secondary-500/25 blur-[100px] animate-floaty" style={{ animationDelay: '-8s' }} />
    </div>
  )
}

export function PhoneShell({ children }) {
  return (
    <div className="relative min-h-dvh w-full overflow-hidden bg-bg-2 sm:grid sm:place-items-center sm:p-6">
      <AmbientBackground />
      <div className="relative z-10 mx-auto flex h-dvh w-full max-w-[420px] flex-col overflow-hidden bg-bg sm:h-[844px] sm:max-h-[94vh] sm:w-[396px] sm:rounded-[46px] sm:border-[11px] sm:border-[#0b0b12] sm:shadow-[0_40px_90px_-25px_rgba(18,18,45,0.55)]">
        {children}
        <div className="pointer-events-none absolute left-1/2 top-[12px] z-50 h-[26px] w-[96px] -translate-x-1/2 rounded-full bg-black" />
      </div>
    </div>
  )
}

export function StatusBar({ tone = 'content' }) {
  const [time, setTime] = useState('--:--')
  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }))
    update()
    const t = setInterval(update, 15000)
    return () => clearInterval(t)
  }, [])
  const color = tone === 'light' ? 'text-white' : 'text-content'
  return (
    <div className={`pointer-events-none absolute inset-x-0 top-0 z-50 flex h-12 items-center justify-between px-7 pt-1 text-[13px] font-bold ${color}`}>
      <span className="tabular-nums tracking-tight">{time}</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="12" viewBox="0 0 17 12" fill="currentColor">
          <rect x="0" y="8" width="3" height="4" rx="1" />
          <rect x="4.5" y="5.5" width="3" height="6.5" rx="1" />
          <rect x="9" y="3" width="3" height="9" rx="1" />
          <rect x="13.5" y="0.5" width="3" height="11.5" rx="1" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 2.2c2.4 0 4.6.9 6.3 2.5l-1.3 1.4A7 7 0 0 0 8 4.2 7 7 0 0 0 3 6.1L1.7 4.7A9.2 9.2 0 0 1 8 2.2Z" />
          <path d="M8 5.8c1.4 0 2.7.5 3.7 1.5l-1.4 1.4A3.2 3.2 0 0 0 8 7.8c-.9 0-1.7.3-2.3.9L4.3 7.3A5.3 5.3 0 0 1 8 5.8Z" />
          <circle cx="8" cy="10.2" r="1.5" />
        </svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none">
          <rect x="0.5" y="0.5" width="22" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.4" />
          <rect x="2" y="2" width="17" height="8" rx="2" fill="currentColor" />
          <rect x="24" y="4" width="1.7" height="4" rx="0.8" fill="currentColor" fillOpacity="0.5" />
        </svg>
      </div>
    </div>
  )
}
