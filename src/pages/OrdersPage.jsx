import { useState, useEffect, useCallback, useRef } from 'react'
import GAS_URL, { STATUSES } from '../config'
import OrderCardCompact from '../components/OrderCardCompact'
import { IconFilter, IconSearch } from '../components/Icons'

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

const filterLabels = {
  'Новый': 'Новые', 'Принят': 'В работе', 'Готовится': 'Готовятся',
  'В доставке': 'Доставка', 'Доставлен': 'Завершено',
}

export default function OrdersPage({ onNavigate }) {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('Все')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const prevOrderIds = useRef(new Set())
  const isFirstLoad = useRef(true)

  const fetchOrders = useCallback(async () => {
    try {
      const url = filter === 'Все'
        ? `${GAS_URL}?action=orders`
        : `${GAS_URL}?action=orders&status=${encodeURIComponent(filter)}`
      const res = await fetch(url)
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
      } else {
        setError(data.message || 'Ошибка загрузки')
      }
    } catch {
      setError('Нет соединения')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    isFirstLoad.current = true
    setLoading(true)
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  const allStatuses = ['Все', ...STATUSES]
  const totalRevenue = orders.reduce((s, o) => s + (o.TotalPrice || 0), 0)

  return (
    <div className="app-screen">
      <div className="screen-header">
        <div>
          <div className="eyebrow">СМЕНА · 06:00 → 24:00</div>
          <div className="h3 serif">Заказы</div>
        </div>
        <div className="head-actions">
          <button className="btn btn--icon"><IconFilter width={17} height={17}/></button>
          <button className="btn btn--icon"><IconSearch width={17} height={17}/></button>
        </div>
      </div>

      <div style={{ padding: '0 20px 14px', display: 'flex', gap: 8, overflowX: 'auto' }} className="no-scroll">
        {allStatuses.map((f) => {
          const count = f === 'Все' ? orders.length : orders.filter(o => o.Status === f).length
          return (
            <button
              key={f}
              className={'chip' + (filter === f ? ' chip--active' : '')}
              onClick={() => setFilter(f)}
            >
              {filterLabels[f] || f} · {count}
            </button>
          )
        })}
      </div>

      <div className="screen-scroll">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '4px 0 10px' }}>
          <div className="eyebrow">СЕГОДНЯ</div>
          <div className="micro tab-nums">{orders.length} заказов · {totalRevenue.toLocaleString('ru-RU')} ₽</div>
        </div>

        {error && (
          <p style={{ color: 'var(--error)', fontSize: 13, textAlign: 'center', padding: 16 }}>{error}</p>
        )}

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 90, borderRadius: 16 }}/>)}
          </div>
        ) : orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <p className="small">Заказов пока нет</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {orders.map(order => (
              <OrderCardCompact
                key={order.OrderID}
                order={order}
                onClick={() => onNavigate?.('order', order.OrderID)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
