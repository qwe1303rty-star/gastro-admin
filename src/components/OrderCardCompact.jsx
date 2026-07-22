import { IconClipboard, IconClock, IconCard, IconCash } from './Icons'

export default function OrderCardCompact({ order, onClick }) {
  const items = typeof order.Items === 'string' ? JSON.parse(order.Items) : order.Items || []
  const itemCount = items.reduce((s, i) => s + (i.qty || 1), 0)

  const statusMap = {
    'Новый':      { key: 'new',      label: 'Новый' },
    'Принят':     { key: 'work',     label: 'В работе' },
    'Готовится':  { key: 'cook',     label: 'Готовится' },
    'В доставке': { key: 'delivery', label: 'Доставка' },
    'Доставлен':  { key: 'done',     label: 'Завершён' },
  }
  const s = statusMap[order.Status] || { key: 'new', label: order.Status }

  const time = order.Timestamp ? order.Timestamp.split(' ')[1] || '' : ''
  const price = order.TotalPrice ? order.TotalPrice.toLocaleString('ru-RU') : '0'

  return (
    <button className="order-row rise" onClick={onClick}>
      <div className="order-row__top">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div className="ico ico--sm ico--gold">
            <IconClipboard width={16} height={16}/>
          </div>
          <div>
            <div className="order-row__num">#{order.OrderID}</div>
            <div className="order-row__client">{order.Name}</div>
          </div>
        </div>
        <div className={'status status--' + s.key}>
          <span className="status__dot"/>{s.label}
        </div>
      </div>
      <div className="order-row__meta">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {time && (
            <span className="micro" style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <IconClock width={11} height={11}/> {time}
            </span>
          )}
          <span className="micro">· {itemCount} поз.</span>
        </div>
        <div className="order-row__price">{price} ₽</div>
      </div>
    </button>
  )
}
