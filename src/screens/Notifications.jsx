import { motion } from 'framer-motion'
import { BellOff, Info, RefreshCw, ShoppingBag } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { TopBar } from '../components/TopBar'
import { EmptyState } from '../components/EmptyState'
import { formatTime } from '../lib/data'

const META = {
  order: { icon: ShoppingBag, color: '#ff6a45' },
  status: { icon: RefreshCw, color: '#6d4ff6' },
  system: { icon: Info, color: '#3d8bfd' },
}

function NotifItem({ n, index, onOpen }) {
  const { icon: Icon, color } = META[n.type] || META.system
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.4) }}
    >
      <Card onClick={onOpen} className={`flex items-start gap-3 p-4 ${n.read ? '' : 'ring-1 ring-primary-400/25'}`}>
        <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl" style={{ backgroundColor: color + '1f', color }}>
          <Icon size={19} />
          {!n.read && <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent-500 ring-2 ring-surface" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className={`text-[14px] ${n.read ? 'font-semibold text-content-soft' : 'font-bold text-content'}`}>{n.title}</p>
          <p className="mt-0.5 text-[13px] font-medium leading-snug text-content-muted">{n.body}</p>
          <p className="mt-1 text-[11px] font-semibold text-content-muted">{formatTime(n.createdAt)}</p>
        </div>
      </Card>
    </motion.div>
  )
}

export function Notifications({ notifications, markAllRead, openOrder, unread }) {
  const sorted = [...notifications].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <TopBar
        title="Уведомления"
        subtitle={unread > 0 ? `${unread} непрочитанных` : 'Все прочитано'}
        actions={
          unread > 0 ? (
            <motion.button whileTap={{ scale: 0.9 }} onClick={markAllRead} className="rounded-2xl border border-line bg-surface px-3.5 py-2.5 text-[13px] font-bold text-primary-300">
              Прочитать
            </motion.button>
          ) : undefined
        }
      />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-1">
        {sorted.length === 0 ? (
          <EmptyState icon={BellOff} title="Нет уведомлений" body="Новые заказы и обновления статусов появятся здесь." />
        ) : (
          <div className="space-y-3">
            {sorted.map((n, i) => (
              <NotifItem key={n.id} n={n} index={i} onOpen={() => (n.orderId ? openOrder(n.orderId) : undefined)} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
