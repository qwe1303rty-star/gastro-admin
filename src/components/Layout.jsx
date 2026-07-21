import { useState, useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { isPushReady, isSubscribed, subscribeToPush, unsubscribeFromPush } from '../utils/push'

const tabs = [
  {
    to: '/',
    label: 'Заказы',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
  {
    to: '/stats',
    label: 'Статистика',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
]

export default function Layout({ children }) {
  const { logout } = useAuth()
  const location = useLocation()
  const isDetail = location.pathname.startsWith('/order/')
  const [pushEnabled, setPushEnabled] = useState(false)

  useEffect(() => {
    if (!isPushReady()) return
    isSubscribed().then(setPushEnabled)
  }, [])

  const togglePush = async () => {
    try {
      if (pushEnabled) {
        await unsubscribeFromPush()
        setPushEnabled(false)
      } else {
        await subscribeToPush()
        setPushEnabled(true)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-dark flex flex-col">
      <header className="sticky top-0 z-40 bg-dark/80 backdrop-blur-xl border-b border-border px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center">
            <span className="font-mono text-gold text-[11px] font-medium">ГС</span>
          </div>
          <span className="text-[15px] font-medium text-text">
            {isDetail ? 'Заказ' : 'ГС Заказы'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {isPushReady() && (
            <button
              onClick={togglePush}
              className="relative p-1.5 transition-colors"
              title={pushEnabled ? 'Уведомления включены' : 'Уведомления выключены'}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className={pushEnabled ? 'text-gold' : 'text-muted'}
              >
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              {pushEnabled && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 rounded-full bg-success" />
              )}
            </button>
          )}
          <button
            onClick={logout}
            className="text-[12px] text-muted hover:text-text transition-colors"
          >
            Выйти
          </button>
        </div>
      </header>

      <main className="flex-1 pb-20 overflow-y-auto">
        {children}
      </main>

      {!isDetail && (
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-dark/90 backdrop-blur-xl border-t border-border">
          <div className="flex justify-around py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
            {tabs.map((t) => (
              <NavLink
                key={t.to}
                to={t.to}
                end={t.to === '/'}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-6 py-1 transition-colors ${
                    isActive ? 'text-gold' : 'text-muted'
                  }`
                }
              >
                {t.icon}
                <span className="text-[10px] font-medium">{t.label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
