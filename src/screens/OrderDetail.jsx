import { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ChevronLeft, MessageSquareText, Navigation, Phone, MapPin, X } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { StatusPill } from '../components/ui/StatusPill'
import { InfoRow } from '../components/InfoRow'
import { STATUS_MAP, PIPELINE, PIPELINE_LABELS, nextStatus, isTerminal, formatMoney, clockTime, keyToStatus } from '../lib/data'

export function OrderDetail({ orders, activeOrderId, closeOrder, advanceOrder, updateOrderStatus }) {
  const order = orders.find((o) => o.id === activeOrderId)
  const [confirmCancel, setConfirmCancel] = useState(false)

  if (!order) return null
  const statusKey = order.statusKey
  const nx = nextStatus(statusKey)
  const currentIdx = PIPELINE.indexOf(statusKey)
  const cancelled = statusKey === 'cancelled'
  const completed = statusKey === 'completed'

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ type: 'spring', stiffness: 320, damping: 36 }}
      className="absolute inset-0 z-40 flex flex-col bg-bg"
    >
      <div className="flex items-center gap-3 px-5 pb-3 pt-14">
        <motion.button whileTap={{ scale: 0.9 }} onClick={closeOrder} className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl border border-line bg-surface text-content">
          <ChevronLeft size={20} />
        </motion.button>
        <div className="min-w-0 flex-1">
          <h1 className="text-[1.35rem] font-extrabold leading-tight tracking-tight text-content">{order.id}</h1>
          <p className="text-[13px] font-medium text-content-muted">{clockTime(order.created_at)}</p>
        </div>
        <motion.div key={statusKey} initial={{ scale: 0.7, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
          <StatusPill statusKey={statusKey} />
        </motion.div>
      </div>

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-6">
        <Card className="p-4">
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.16em] text-content-muted">Клиент</p>
          <p className="text-lg font-extrabold tracking-tight text-content">{order.customer.name}</p>
          <div className="mt-1 divide-y divide-line">
            {order.customer.phone && (
              <InfoRow
                icon={Phone}
                label="Телефон"
                value={<a href={`tel:${(order.customer.phone || '').replace(/[^+\d]/g, '')}`} className="text-primary-300">{order.customer.phone}</a>}
                action={
                  <a href={`tel:${(order.customer.phone || '').replace(/[^+\d]/g, '')}`} className="grid h-9 w-9 place-items-center rounded-xl bg-primary-500/20 text-primary-300">
                    <Phone size={16} />
                  </a>
                }
              />
            )}
            {order.customer.address && (
              <InfoRow
                icon={MapPin}
                label="Адрес доставки"
                value={order.customer.address}
                action={
                  <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary-500/20 text-primary-300">
                    <Navigation size={16} />
                  </div>
                }
              />
            )}
            {order.customer.comment && (
              <div className="flex items-start gap-3 py-3">
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2 text-content-soft">
                  <MessageSquareText size={17} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-content-muted">Комментарий</p>
                  <p className="text-[14px] font-medium leading-snug text-content">{order.customer.comment}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="mt-4 p-4">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-content-muted">Состав заказа</p>
          <div className="divide-y divide-line">
            {order.items.map((it, idx) => (
              <div key={idx} className="flex items-center gap-3 py-3">
                <div className="grid h-9 min-w-9 place-items-center rounded-xl bg-surface-2 px-2 text-xs font-extrabold text-content-soft">x{it.qty}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[15px] font-semibold text-content">{it.name}</p>
                  {it.variant && <p className="text-[12px] font-medium text-content-muted">{it.variant} · {formatMoney(it.price)}</p>}
                </div>
                <p className="text-[15px] font-bold text-content">{formatMoney(it.price * it.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-2 border-t border-line pt-3 text-[14px]">
            <div className="flex items-center justify-between">
              <span className="text-base font-bold text-content">Итого</span>
              <span className="text-xl font-extrabold tracking-tight text-content">{formatMoney(order.total)}</span>
            </div>
          </div>
        </Card>
      </div>

      <div className="glass border-t border-line px-5 pb-7 pt-4">
        {!cancelled && !completed && (
          <>
            <div className="mb-4">
              <div className="relative h-5">
                <div className="absolute left-2.5 right-2.5 top-[9px] h-[2px] rounded-full bg-surface-3" />
                <motion.div
                  className="absolute left-2.5 top-[9px] h-[2px] rounded-full"
                  style={{ background: 'linear-gradient(90deg,#8c70ff,#6d4ff6)' }}
                  animate={{ width: `calc((100% - 20px) * ${Math.max(currentIdx, 0) / (PIPELINE.length - 1)})` }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                />
                <div className="relative flex h-5 items-center justify-between">
                  {PIPELINE.map((s) => {
                    const idx = PIPELINE.indexOf(s)
                    const done = idx < currentIdx
                    const active = idx === currentIdx
                    return (
                      <motion.div
                        key={s}
                        initial={false}
                        animate={{ scale: active ? 1.15 : 1 }}
                        className={`grid h-5 w-5 place-items-center rounded-full border-2 ${
                          done || active ? 'border-primary-500 bg-primary-500 text-white' : 'border-surface-3 bg-surface text-content-muted'
                        }`}
                      >
                        {done ? <Check size={11} strokeWidth={3.5} /> : active ? <span className="h-1.5 w-1.5 rounded-full bg-white" /> : <span className="h-1.5 w-1.5 rounded-full bg-content-muted/50" />}
                      </motion.div>
                    )
                  })}
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <p className="text-[13px] font-bold text-content">Текущий этап: {PIPELINE_LABELS[statusKey]}</p>
                <p className="text-[12px] font-semibold text-content-muted">{Math.max(currentIdx, 0) + 1}/{PIPELINE.length}</p>
              </div>
            </div>

            {nx && (
              <Button full size="lg" onClick={() => advanceOrder(order.id)}>
                Перевести в «{PIPELINE_LABELS[nx]}»
              </Button>
            )}

            <div className="mt-2">
              {!confirmCancel ? (
                <button onClick={() => setConfirmCancel(true)} className="w-full py-2 text-[13px] font-bold text-content-muted">
                  Отменить заказ
                </button>
              ) : (
                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
                  <Button variant="surface" full size="sm" onClick={() => setConfirmCancel(false)}>Не отменять</Button>
                  <Button variant="danger" full size="sm" onClick={() => updateOrderStatus(order.id, 'Отменён')}>
                    <X size={16} /> Да, отменить
                  </Button>
                </motion.div>
              )}
            </div>
          </>
        )}

        {completed && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 rounded-2xl bg-success-500/12 px-4 py-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-success-500 text-white">
              <Check size={22} strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-content">Заказ завершён</p>
              <p className="text-[13px] font-medium text-content-muted">Доставлен клиенту · {formatMoney(order.total)}</p>
            </div>
          </motion.div>
        )}

        {cancelled && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 rounded-2xl bg-error-500/12 px-4 py-4">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-error-500 text-white">
              <X size={22} strokeWidth={3} />
            </div>
            <div className="flex-1">
              <p className="font-extrabold text-content">Заказ отменён</p>
              <p className="text-[13px] font-medium text-content-muted">Возврат средств инициирован</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
