import { motion } from 'framer-motion'
import { BarChart3, Bell, ClipboardList, Home, Settings } from 'lucide-react'

const ITEMS = [
  { key: 'home', label: 'Главная', icon: Home },
  { key: 'orders', label: 'Заказы', icon: ClipboardList },
  { key: 'stats', label: 'Статистика', icon: BarChart3 },
  { key: 'notifications', label: 'Уведомления', icon: Bell },
  { key: 'settings', label: 'Настройки', icon: Settings },
]

const spring = { type: 'spring', stiffness: 480, damping: 32 }

export function BottomNav({ tab, navigate, unread }) {
  return (
    <nav className="glass relative z-30 flex items-stretch justify-around border-t border-line px-1.5 pb-6 pt-2">
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const active = tab === key
        return (
          <button
            key={key}
            onClick={() => navigate(key)}
            className="relative flex flex-1 flex-col items-center gap-1 py-1.5"
          >
            {active && (
              <motion.div
                layoutId="nav-pill"
                transition={spring}
                className="absolute left-1/2 top-0 h-9 w-12 -ml-6 rounded-2xl bg-primary-500/20"
              />
            )}
            <motion.div
              animate={{ scale: active ? 1.08 : 1, y: active ? -1 : 0 }}
              transition={spring}
              className="relative z-10"
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.6 : 2}
                className={active ? 'text-primary-300' : 'text-content-muted'}
              />
              {key === 'notifications' && unread > 0 && (
                <span className="absolute -right-1.5 -top-1 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-surface" />
              )}
            </motion.div>
            <span
              className={`relative z-10 text-[10px] font-semibold ${
                active ? 'text-primary-300' : 'text-content-muted'
              }`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
