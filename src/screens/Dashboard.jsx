import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight, Bell, BellRing, ClipboardList, CircleCheck, CookingPot, Bike, Ban, Search, ChevronRight } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { SectionLabel } from '../components/ui/SectionLabel'
import { Logo } from '../components/Logo'
import { OrderCard } from '../components/OrderCard'
import { PullToRefresh } from '../components/PullToRefresh'
import { DASHBOARD_CARDS, STATS, formatMoney, formatMoneyShort, statusToKey } from '../lib/data'

function greeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Доброй ночи'
  if (h < 12) return 'Доброе утро'
  if (h < 18) return 'Добрый день'
  return 'Добрый вечер'
}

function CountUp({ value }) {
  const [display, setDisplay] = useState(0)
  const prev = useRef(0)
  useEffect(() => {
    const from = prev.current
    const to = value
    const start = performance.now()
    const dur = 600
    let raf = 0
    const tick = (t) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(from + (to - from) * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
      else prev.current = to
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])
  return <>{display}</>
}

const ICONS = { new: BellRing, accepted: ClipboardList, cooking: CookingPot, delivering: Bike, completed: CircleCheck, cancelled: Ban }

function Sparkline({ color = '#ffffff' }) {
  const data = STATS.weekly.map((d) => d.value)
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const W = 220
  const H = 54
  const pts = data.map((v, i) => [(i / (data.length - 1)) * W, H - ((v - min) / range) * (H - 8) - 4])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L ${W} ${H} L 0 ${H} Z`
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="h-14 w-full">
      <defs>
        <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark)" />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

export function Dashboard({ orders, navigate, openOrder, unread, doRefresh, refreshToken }) {
  const countFor = (statusKeys) =>
    orders.filter((o) => statusKeys.includes(o.statusKey)).length

  const recent = [...orders].sort((a, b) => b.created_at - a.created_at).slice(0, 4)

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <header className="px-5 pb-3 pt-14">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo className="h-11 w-11" />
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-content-muted">Гастрономический Спектакль</p>
              <p className="text-lg font-extrabold leading-tight tracking-tight text-content">{greeting()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => navigate('notifications')} className="relative grid h-11 w-11 place-items-center rounded-2xl border border-line bg-surface text-content-soft">
              <Bell size={19} />
              {unread > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-accent-500 ring-2 ring-surface" />}
            </motion.button>
          </div>
        </div>

        <button onClick={() => navigate('orders')} className="mt-4 flex w-full items-center gap-2.5 rounded-2xl border border-line bg-surface-2 px-4 py-3.5 text-left">
          <Search size={18} className="text-content-muted" />
          <span className="text-[15px] font-medium text-content-muted">Поиск заказа или клиента…</span>
        </button>
      </header>

      <PullToRefresh onRefresh={doRefresh}>
        <div className="space-y-7 px-5 pb-28" key={refreshToken}>
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-brand" style={{ background: 'linear-gradient(135deg, #8c70ff 0%, #5b3ce6 55%, #4c2fe0 100%)' }}>
              <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-white/15 blur-2xl" />
              <div className="relative flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-white/75">Выручка сегодня</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight">{formatMoney(STATS.salesToday)}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-bold">
                    <ArrowUpRight size={13} /> +12,4% к вчера
                  </span>
                </div>
              </div>
              <div className="relative mt-3 -mb-1">
                <Sparkline />
              </div>
            </div>
          </motion.div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <SectionLabel>Заказы в работе</SectionLabel>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {DASHBOARD_CARDS.map((cat, i) => {
                const Icon = ICONS[cat.key]
                const value = countFor(cat.statuses.map(statusToKey).filter(Boolean))
                return (
                  <motion.div
                    key={cat.key}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05, duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Card className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ backgroundColor: cat.color + '1f', color: cat.color }}>
                          {Icon && <Icon size={19} />}
                        </div>
                        {cat.key === 'new' && value > 0 && (
                          <motion.span animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.4, repeat: Infinity }} className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                        )}
                      </div>
                      <motion.p key={value} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 18 }} className="mt-3 text-[28px] font-extrabold leading-none tracking-tight text-content">
                        <CountUp value={value} />
                      </motion.p>
                      <p className="mt-1 text-[13px] font-semibold text-content-muted">{cat.label}</p>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <SectionLabel>Последние заказы</SectionLabel>
              <button onClick={() => navigate('orders')} className="flex items-center gap-0.5 text-[13px] font-bold text-primary-300">
                Все <ChevronRight size={15} />
              </button>
            </div>
            <div className="space-y-3">
              {recent.map((order, i) => (
                <OrderCard key={order.id} order={order} index={i} onClick={() => openOrder(order.id)} />
              ))}
              {recent.length === 0 && (
                <Card className="p-8 text-center">
                  <p className="text-sm text-content-muted">Нет заказов</p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </PullToRefresh>
    </motion.div>
  )
}
