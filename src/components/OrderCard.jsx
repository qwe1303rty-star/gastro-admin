import { useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge'

export default function OrderCard({ order }) {
  const navigate = useNavigate()
  const items = typeof order.Items === 'string' ? JSON.parse(order.Items) : order.Items || []
  const itemCount = items.reduce((s, i) => s + (i.qty || 1), 0)

  return (
    <button
      onClick={() => navigate(`/order/${order.OrderID}`)}
      className="w-full text-left bg-card border border-border rounded-xl p-4 active:scale-[0.98] transition-transform duration-150"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[13px] text-gold font-medium">
          {order.OrderID}
        </span>
        <StatusBadge status={order.Status} />
      </div>

      <p className="text-[15px] text-text font-medium mb-1">{order.Name}</p>
      <p className="text-[12px] text-muted mb-3">{order.Phone}</p>

      <div className="flex items-center justify-between">
        <span className="text-[12px] text-muted">
          {itemCount} {itemCount === 1 ? 'позиция' : itemCount < 5 ? 'позиции' : 'позиций'}
        </span>
        {order.TotalPrice > 0 && (
          <span className="text-[14px] text-text font-medium">
            {order.TotalPrice} ₽
          </span>
        )}
      </div>

      <p className="text-[11px] text-muted/60 mt-2">
        {order.Timestamp}
      </p>
    </button>
  )
}
