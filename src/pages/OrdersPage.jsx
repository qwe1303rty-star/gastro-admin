import { useState, useEffect, useCallback } from 'react'
import GAS_URL, { STATUSES } from '../config'
import OrderCard from '../components/OrderCard'

const filters = ['Все', ...STATUSES]

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('Все')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchOrders = useCallback(async () => {
    try {
      const url = filter === 'Все'
        ? `${GAS_URL}?action=orders`
        : `${GAS_URL}?action=orders&status=${encodeURIComponent(filter)}`
      const res = await fetch(url)
      const data = await res.json()
      if (data.status === 'ok') {
        setOrders(data.orders || [])
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
    setLoading(true)
    fetchOrders()
    const interval = setInterval(fetchOrders, 30000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  return (
    <div className="px-4 pt-4">
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 px-4 py-2 rounded-full text-[12px] font-medium border transition-all duration-200 ${
              filter === f
                ? 'bg-gold text-dark border-gold'
                : 'bg-card text-muted border-border'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {error && (
        <p className="text-center text-red-400 text-[13px] py-4">{error}</p>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full border border-border flex items-center justify-center mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-muted/40">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>
          <p className="text-muted text-[14px]">Заказов пока нет</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <OrderCard key={order.OrderID} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
