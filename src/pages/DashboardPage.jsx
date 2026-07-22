import { useState, useEffect, useCallback, useRef } from 'react'
import GAS_URL from '../config'
import BrandMark from '../components/BrandMark'
import RingProgress from '../components/RingProgress'
import OrderCardCompact from '../components/OrderCardCompact'
import { IconBell, IconSearch } from '../components/Icons'

function playNotifSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.type = 'sine'
    osc.frequency.setValueAtTime(880, ctx.currentTime)
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1)
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2)
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.5)
  } catch {}
}

function vibrate() {
  try { navigator.vibrate?.([200, 100, 200]) } catch {}
}

const statusTones = {
  'Новый': 'new', 'Принят': 'work', 'Готовится': 'cook',
  'В доставке': 'delivery', 'Доставлен': 'done',
}

export default function DashboardPage({ onNavigate }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const prevOrderIds = useRef(new Set())
  const isFirstLoad = useRef(true)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch(`${GAS_URL}?action=orders`)
      const data = await res.json()
      if (data.status === 'ok') {
        const newOrders = data.orders || []
        if (!isFirstLoad.current) {
          const newIds = new Set(newOrders.map(o => o.OrderID))
          for (const id of newIds) {
            if (!prevOrderIds.current.has(id)) {
              playNotifSound()
              vibrate()
              break
            }
          }
        }
        prevOrderIds.current = new Set(newOrders.map(o => o.OrderID))
        isFirstLoad.current = false
        setOrders(newOrders)
        setError('')
      }
    } catch {
      setError('Нет соединения')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    isFirstLoad.current = true
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const counts = {}
  orders.forEach(o => { counts[o.Status] = (counts[o.Status] || 0) + 1 })
  const totalRevenue = orders.reduce((s, o) => s + (o.TotalPrice || 0), 0)
  const doneCount = orders.filter(o => o.Status === 'Доставлен').length
  const progress = orders.length > 0 ? Math.round((doneCount / orders.length) * 100) : 0

  const today = new Date()
  const dateStr = today.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })

  const statusCards = [
    { label: 'Новые',     count: counts['Новый'] || 0,      tone: 'new' },
    { label: 'В работе',  count: counts['Принят'] || 0,     tone: 'work' },
    { label: 'Готовятся', count: counts['Готовится'] || 0,   tone: 'cook' },
    { label: 'Доставка',  count: counts['В доставке'] || 0,  tone: 'delivery' },
    { label: 'Завершено', count: counts['Доставлен'] || 0,   tone: 'done' },
  ]

  return (
    <div className="app-screen">
      <div className="screen-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrandMark size={36}/>
          <div>
            <div className="micro" style={{ letterSpacing: '0.08em' }}>{dateStr}</div>
            <div className="serif" style={{ fontSize: 16, lineHeight: 1.1 }}>Смена <span className="gold-text" style={{ fontStyle: 'italic' }}>в разгаре</span></div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {onNavigate && (
            <button className="btn btn--icon" onClick={() => onNavigate('notif')} style={{ position: 'relative' }}>
              <IconBell width={18} height={18}/>
              <span style={{
                position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: '50%',
                background: 'var(--gold)', boxShadow: '0 0 0 2px var(--surface-2)'
              }} className="pulse"/>
            </button>
          )}
        </div>
      </div>

      <div className="screen-scroll">
        <div className="card card--gold" style={{ padding: 20, marginBottom: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold-2)' }}>ВЫРУЧКА · СЕГОДНЯ</div>
              <div className="serif" style={{ fontSize: 36, letterSpacing: '-0.02em', marginTop: 6, lineHeight: 1 }}>
                <span className="gold-text">{totalRevenue.toLocaleString('ru-RU')} ₽</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                <span className="micro">{orders.length} заказов</span>
              </div>
            </div>
            <RingProgress value={progress} size={72} stroke={5}/>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div className="serif" style={{ fontSize: 17 }}>Поток <span style={{ fontStyle: 'italic' }} className="gold-text">заказов</span></div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 22 }}>
          {statusCards.map((s) => (
            <div key={s.tone} className="kpi">
              <div className="kpi__head">
                <div className={'status status--' + s.tone} style={{ padding: '3px 8px 3px 6px' }}>
                  <span className="status__dot"/>
                </div>
              </div>
              <div className="kpi__label">{s.label}</div>
              <div className="kpi__value serif" style={{ marginTop: 2 }}>{s.count}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
          <div className="serif" style={{ fontSize: 17 }}>Последние <span style={{ fontStyle: 'italic' }} className="gold-text">заказы</span></div>
          {onNavigate && (
            <button
              onClick={() => onNavigate('orders')}
              style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gold)', fontSize: 12, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-sans)' }}
            >
              Все →
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
              <div className="shimmer" style={{ width: '100%', height: 80, borderRadius: 16 }}/>
            </div>
          ) : orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <p className="small">Заказов пока нет</p>
            </div>
          ) : (
            orders.slice(0, 5).map(order => (
              <OrderCardCompact
                key={order.OrderID}
                order={order}
                onClick={() => onNavigate?.('order', order.OrderID)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
