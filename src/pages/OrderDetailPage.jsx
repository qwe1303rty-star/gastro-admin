import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import GAS_URL, { STATUSES, STATUS_COLORS } from '../config'
import StatusBadge from '../components/StatusBadge'

export default function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    let cancelled = false
    const fetchOrder = async () => {
      try {
        const res = await fetch(`${GAS_URL}?action=orders`)
        const data = await res.json()
        if (!cancelled && data.status === 'ok') {
          const found = (data.orders || []).find((o) => o.OrderID === id)
          setOrder(found || null)
        }
      } catch {
        if (!cancelled) setOrder(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchOrder()
    return () => { cancelled = true }
  }, [id])

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await fetch(`${GAS_URL}?action=updateStatus&orderId=${encodeURIComponent(id)}&status=${encodeURIComponent(newStatus)}`)
      const data = await res.json()
      if (data.status === 'ok') {
        setOrder((prev) => prev ? { ...prev, Status: newStatus } : prev)
      }
    } catch {
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-4">
        <p className="text-muted text-[14px] mb-4">Заказ не найден</p>
        <button onClick={() => navigate(-1)} className="text-gold text-[13px]">
          Назад
        </button>
      </div>
    )
  }

  const items = typeof order.Items === 'string' ? JSON.parse(order.Items) : order.Items || []
  const currentIdx = STATUSES.indexOf(order.Status)

  return (
    <div className="px-4 pt-4">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-muted text-[13px] mb-4"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Назад
      </button>

      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="font-mono text-[20px] text-gold font-medium">{order.OrderID}</h1>
          <p className="text-[12px] text-muted mt-0.5">{order.Timestamp}</p>
        </div>
        <StatusBadge status={order.Status} />
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <h3 className="text-[11px] uppercase tracking-wider text-muted mb-3">Клиент</h3>
        <p className="text-[16px] text-text font-medium mb-1">{order.Name}</p>
        <a href={`tel:${order.Phone}`} className="text-gold text-[14px] block mb-1">
          {order.Phone}
        </a>
        {order.Address && (
          <p className="text-[13px] text-muted mt-2">{order.Address}</p>
        )}
        {order.Comment && (
          <p className="text-[13px] text-muted/70 mt-1 italic">«{order.Comment}»</p>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-4">
        <h3 className="text-[11px] uppercase tracking-wider text-muted mb-3">Состав</h3>
        <div className="flex flex-col gap-3">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-[14px] text-text truncate">{item.name}</p>
                <p className="text-[11px] text-muted">
                  {item.category}{item.weight ? ` · ${item.weight}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <span className="text-[13px] text-muted">×{item.qty}</span>
                {item.price && (
                  <span className="text-[13px] text-text">{item.price * item.qty} ₽</span>
                )}
              </div>
            </div>
          ))}
        </div>
        {order.TotalPrice > 0 && (
          <div className="flex justify-between mt-4 pt-3 border-t border-border">
            <span className="text-[13px] text-muted uppercase tracking-wider">Итого</span>
            <span className="text-[18px] text-gold font-medium">{order.TotalPrice} ₽</span>
          </div>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-4 mb-6">
        <h3 className="text-[11px] uppercase tracking-wider text-muted mb-3">Статус</h3>
        <div className="flex flex-col gap-2">
          {STATUSES.map((s, i) => {
            const color = STATUS_COLORS[s]
            const isCurrent = s === order.Status
            const isPast = i < currentIdx
            const isNext = i === currentIdx + 1
            return (
              <button
                key={s}
                disabled={isCurrent || updating}
                onClick={() => updateStatus(s)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                  isCurrent
                    ? 'border-2'
                    : isNext
                    ? 'bg-card border border-border active:scale-[0.98]'
                    : isPast
                    ? 'bg-card/50 border border-border/50 text-muted/50'
                    : 'bg-card border border-border'
                }`}
                style={isCurrent ? { borderColor: color, color, backgroundColor: color + '10' } : undefined}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: isCurrent ? color : isPast ? color + '40' : '#2A2A2A' }}
                />
                {s}
                {isCurrent && <span className="ml-auto text-[10px] uppercase">Текущий</span>}
              </button>
            )
          })}
        </div>
      </div>

      <a
        href={`tel:${order.Phone}`}
        className="fixed bottom-24 left-4 right-4 py-4 rounded-xl bg-gold text-dark text-center text-[14px] font-medium
                   active:bg-goldSoft transition-colors z-30"
      >
        Позвонить клиенту
      </a>
    </div>
  )
}
