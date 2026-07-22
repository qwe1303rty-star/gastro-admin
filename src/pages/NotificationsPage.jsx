import { IconBell, IconCheck, IconPackage, IconTruck, IconStar, IconBadge } from '../components/Icons'

const notifications = [
  { i: <IconPackage width={16} height={16}/>, tone: 'ico--gold', t: 'Новый заказ', d: 'Ожидает подтверждения', time: 'сейчас' },
  { i: <IconTruck width={16} height={16}/>,   t: 'Заказ доставлен', d: 'Клиент подтвердил получение', time: '5 мин' },
  { i: <IconStar width={16} height={16}/>,    tone: 'ico--gold', t: 'Новый отзыв · 5 звёзд', d: '«Обслуживание на высшем уровне»', time: '1 ч' },
  { i: <IconBadge width={16} height={16}/>,   t: 'Дневной план выполнен', d: 'Цель достигнута', time: '2 ч' },
]

export default function NotificationsPage() {
  return (
    <div className="app-screen">
      <div className="screen-header">
        <div>
          <div className="eyebrow">ЦЕНТР УВЕДОМЛЕНИЙ</div>
          <div className="h3 serif">Уведомления <span className="gold-text" style={{ fontStyle: 'italic' }}>· {notifications.length}</span></div>
        </div>
        <div className="head-actions">
          <button className="btn btn--icon"><IconCheck width={17} height={17}/></button>
        </div>
      </div>

      <div style={{ padding: '0 20px 14px' }}>
        <div className="segmented">
          {['Все', 'Заказы', 'Система'].map((f, i) => (
            <button key={f} className={'segmented__opt' + (i === 0 ? ' segmented__opt--active' : '')}>{f}</button>
          ))}
        </div>
      </div>

      <div className="screen-scroll">
        <div className="push-card rise" style={{ marginBottom: 18 }}>
          <div className="ico ico--gold" style={{ position: 'relative' }}>
            <IconBell width={18} height={18}/>
            <span className="pulse" style={{
              position: 'absolute', top: -2, right: -2,
              width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)',
              boxShadow: '0 0 0 2px var(--surface)'
            }}/>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div className="title" style={{ fontSize: 14 }}>Новый заказ <span className="gold-text">#новый</span></div>
              <div className="micro">только что</div>
            </div>
            <div className="small" style={{ marginTop: 4 }}>
              Ожидает подтверждения
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              <button className="btn btn--dark btn--sm" style={{ padding: '7px 12px' }}>Позже</button>
              <button className="btn btn--primary btn--sm" style={{ padding: '7px 12px' }}>Открыть</button>
            </div>
          </div>
        </div>

        <div className="eyebrow" style={{ margin: '4px 0 10px' }}>СЕГОДНЯ</div>
        {notifications.map((n, i) => (
          <div key={i} className="card" style={{
            padding: 14, marginBottom: 10, display: 'flex', gap: 12, alignItems: 'flex-start'
          }}>
            <div className={'ico ico--sm ' + (n.tone || '')}>{n.i}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div className="title" style={{ fontSize: 14 }}>{n.t}</div>
                <div className="micro">{n.time}</div>
              </div>
              <div className="small" style={{ marginTop: 4 }}>{n.d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
