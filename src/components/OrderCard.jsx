import { motion } from 'framer-motion'
import { ArrowRight, CreditCard, Banknote } from 'lucide-react'
import { Card } from './ui/Card'
import { StatusPill } from './ui/StatusPill'
import { STATUS_MAP, formatMoney, clockTime } from '../lib/data'

const payIcon = { card: CreditCard, online: CreditCard, cash: Banknote }
const PAY_LABEL = { card: 'Картой', online: 'Онлайн', cash: 'Наличными' }

export function OrderCard({ order, onClick, index = 0 }) {
  const statusEntry = Object.entries(STATUS_MAP).find(([k]) => k === order.status)
  const c = statusEntry ? statusEntry[1] : { color: '#666', soft: 'rgba(100,100,100,0.12)', label: order.status }
  const PayIcon = payIcon[order.payment] || CreditCard
  const isNew = order.status === 'Новый'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.32, delay: Math.min(index * 0.045, 0.4), ease: [0.22, 1, 0.36, 1] }}
    >
      <Card onClick={onClick} className={`relative overflow-hidden p-4 ${isNew ? 'ring-1 ring-accent-400/40' : ''}`}>
        {isNew && (
          <span className="absolute right-3 top-3 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-400 opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-500" />
          </span>
        )}
        <div className="flex gap-3">
          <div className="w-1 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-content">{order.id}</span>
              <StatusPill statusKey={c.key} size="sm" />
            </div>
            <p className="mt-1.5 truncate text-[15px] font-semibold text-content-soft">{order.customer.name}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[13px] font-medium text-content-muted">
                <PayIcon size={14} /> {PAY_LABEL[order.payment] || 'Оплата'}
              </span>
              <div className="flex items-center gap-2.5">
                <div className="text-right">
                  <p className="text-[17px] font-extrabold leading-none text-content">{formatMoney(order.total)}</p>
                  <p className="mt-0.5 text-[11px] font-medium text-content-muted">{clockTime(order.created_at)}</p>
                </div>
                <motion.div whileTap={{ scale: 0.85 }} className="grid h-9 w-9 place-items-center rounded-xl bg-primary-500/20 text-primary-300">
                  <ArrowRight size={17} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
