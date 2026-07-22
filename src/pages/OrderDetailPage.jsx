import { useState, useEffect } from 'react'
import GAS_URL, { STATUSES, STATUS_COLORS } from '../config'
import RingProgress from '../components/RingProgress'
import { IconArrowLeft, IconMore, IconPhone, IconMapPin, IconMessage, IconCheck, IconClose } from '../components/Icons'

export default function OrderDetailPage({ orderId, onBack }) {
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
          const found = (data.orders || []).find((o) => o.OrderID === orderId)
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
  }, [orderId])

  const updateStatus = async (newStatus) => {
    setUpdating(true)
    try {
      const res = await fetch(`${GAS_URL}?action=updateStatus&orderId=${encodeURIComponent(orderId)}&status=${encodeURIComponent(newStatus)}`)
      const data = await res.json()
      if (data.status === 'ok') {
        setOrder((prev) => prev ? { ...prev, Status: newStatus } : prev)
      }
    } catch {} finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="app-screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <div className="shimmer" style={{ width: 200, height: 200, borderRadius: 20 }}/>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="app-screen" style={{ justifyContent: 'center', alignItems: 'center' }}>
        <p className="small" style={{ marginBottom: 16 }}>Заказ не найден</p>
        <button className="btn btn--dark" onClick={onBack}>Назад</button>
      </div>
    )
  }

  const items = typeof order.Items === 'string' ? JSON.parse(order.Items) : order.Items || []
  const currentIdx = STATUSES.indexOf(order.Status)
  const progress = Math.round(((currentIdx + 1) / STATUSES.length) * 100)
  const initials = order.Name ? order.Name.split(' ').map(x => x[0]).slice(0, 2).join('') : '??'

  const statusLabels = {
    'Новый': 'Принят', 'Принят': 'Подтверждён', 'Готовится': 'Готовится',
    'В доставке': 'В доставке', 'Доставлен': 'Доставлен',
  }
  const nextStatus = currentIdx < STATUSES.length - 1 ? STATUSES[currentIdx + 1] : null
  const nextLabel = nextStatus ? `Передать · ${nextStatus}` : 'Завершён'

  return (
    <div className="app-screen">
      <div className="screen-header">
        <button className="btn btn--icon" onClick={onBack}>
          <IconArrowLeft width={18} height={18}/>
        </button>
        <div style={{ textAlign: 'center' }}>
          <div className="micro">ЗАКАЗ</div>
          <div className="title" style={{ fontFamily: 'var(--font-mono)', fontSize: 15 }}>#{order.OrderID}</div>
        </div>
        <button className="btn btn--icon"><IconMore width={18} height={18}/></button>
      </div>

      <div className="screen-scroll" style={{ paddingBottom: 160 }}>
        <div className="card card--gold" style={{ marginBottom: 14, padding: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div className="eyebrow" style={{ color: 'var(--gold-2)' }}>ТЕКУЩИЙ СТАТУС</div>
              <div className="h3 serif" style={{ marginTop: 4 }}>{order.Status}</div>
              <div className="micro" style={{ marginTop: 4 }}>{order.Timestamp || ''}</div>
            </div>
            <div style={{ position: 'relative' }}>
              <RingProgress value={progress} size={64} stroke={5}/>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-serif)', fontSize: 15
              }} className="gold-text">{progress}%</div>
            </div>
          </div>
        </div>

        <div className="eyebrow" style={{ margin: '10px 0 8px' }}>КЛИЕНТ</div>
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div className="avatar" style={{ width: 44, height: 44, fontSize: 15 }}>{initials}</div>
            <div style={{ flex: 1 }}>
              <div className="title">{order.Name}</div>
            </div>
            <a href={`tel:${order.Phone}`} className="btn btn--icon" style={{ background: 'var(--gold-grad-soft)', borderColor: 'var(--border-strong)', textDecoration: 'none' }}>
              <IconPhone width={16} height={16}/>
            </a>
          </div>
          <div className="divider"/>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 12px', color: 'var(--text-mute)', fontSize: 13 }}>
            <IconPhone width={15} height={15} style={{ color: 'var(--gold)' }}/>
            <a href={`tel:${order.Phone}`} style={{ color: 'var(--text)', textDecoration: 'none' }} className="tab-nums">{order.Phone}</a>
            {order.Address && (<>
              <IconMapPin width={15} height={15} style={{ color: 'var(--gold)' }}/>
              <div style={{ color: 'var(--text)' }}>{order.Address}</div>
            </>)}
            {order.Comment && (<>
              <IconMessage width={15} height={15} style={{ color: 'var(--gold)' }}/>
              <div className="small" style={{ fontStyle: 'italic', color: 'var(--text)' }}>«{order.Comment}»</div>
            </>)}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '20px 0 8px' }}>
          <div className="eyebrow">ЗАКАЗ · {items.length} ПОЗИЦИЙ</div>
          <div className="micro tab-nums">{(order.TotalPrice || 0).toLocaleString('ru-RU')} ₽</div>
        </div>
        <div className="card" style={{ padding: 6 }}>
          {items.map((it, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 12px',
              borderBottom: i < items.length - 1 ? '1px solid var(--divider)' : 'none'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: 'var(--surface-3)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-serif)', color: 'var(--gold)', fontSize: 13
              }}>×{it.qty}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{it.name}</div>
                {it.category && <div className="micro" style={{ marginTop: 2 }}>{it.category}{it.weight ? ` · ${it.weight}` : ''}</div>}
              </div>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 15, color: 'var(--text)' }}>
                {it.price ? `${(it.price * it.qty).toLocaleString('ru-RU')} ₽` : ''}
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 14, marginTop: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="small">Итого</div>
            <div className="serif gold-text" style={{ fontSize: 26 }}>{(order.TotalPrice || 0).toLocaleString('ru-RU')} ₽</div>
          </div>
        </div>

        <div className="eyebrow" style={{ margin: '20px 0 8px' }}>ИСТОРИЯ</div>
        <div className="card" style={{ padding: 16 }}>
          <div className="stepline">
            {STATUSES.map((s, i) => {
              const isDone = i < currentIdx
              const isCurrent = i === currentIdx
              const isPending = i > currentIdx
              return (
                <div key={s} className={'step ' + (isDone ? 'step--done' : isCurrent ? 'step--current' : 'step--pending')}>
                  <div className={'step__dot' + (isCurrent ? ' pulse' : '')}/>
                  <div style={{ flex: 1 }}>
                    <div className={'step__title' + (isCurrent ? ' gold-text serif' : '')} style={isCurrent ? { fontSize: 16 } : {}}>
                      {s}
                    </div>
                    <div className="micro">{statusLabels[s] || s}</div>
                  </div>
                  <div className="step__time">{isDone || isCurrent ? order.Timestamp?.split(' ')[1] || '—' : '—'}</div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {nextStatus && (
        <div style={{
          position: 'fixed', left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, transparent, rgba(10,10,12,.92) 30%)',
          padding: '30px 20px 24px',
          paddingBottom: 'max(24px, env(safe-area-inset-bottom))',
          zIndex: 30,
        }}>
          <div className="card" style={{
            padding: 12, background: 'var(--surface-2)',
            display: 'flex', gap: 10, alignItems: 'center'
          }}>
            <a href={`tel:${order.Phone}`} className="btn btn--dark btn--sm" style={{ flex: '0 0 auto', textDecoration: 'none' }}>
              <IconPhone width={14} height={14}/>
            </a>
            <button
              className="btn btn--primary"
              style={{ flex: 1 }}
              disabled={updating}
              onClick={() => updateStatus(nextStatus)}
            >
              {updating ? 'Обновляем...' : nextLabel}
              <IconCheck width={16} height={16}/>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
