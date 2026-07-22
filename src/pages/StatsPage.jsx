import { useState, useEffect } from 'react'
import GAS_URL from '../config'
import { IconArchive } from '../components/Icons'

function DonutMini({ value, color = '#D4AF6E' }) {
  const c = 2 * Math.PI * 18
  return (
    <svg width="46" height="46" viewBox="0 0 46 46">
      <circle cx="23" cy="23" r="18" stroke="rgba(255,255,255,.07)" strokeWidth="4" fill="none"/>
      <circle cx="23" cy="23" r="18" stroke={color} strokeWidth="4" fill="none"
        strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c*value/100)}
        transform="rotate(-90 23 23)"/>
    </svg>
  )
}

function AreaChart() {
  return (
    <svg viewBox="0 0 320 140" style={{ width: '100%', display: 'block' }}>
      <defs>
        <linearGradient id="area1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D4AF6E" stopOpacity=".4"/>
          <stop offset="1" stopColor="#D4AF6E" stopOpacity="0"/>
        </linearGradient>
        <linearGradient id="areaLine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#E8CB8B"/>
          <stop offset="1" stopColor="#B8945A"/>
        </linearGradient>
      </defs>
      {[30, 60, 90, 120].map(y => (
        <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="rgba(255,255,255,.04)"/>
      ))}
      <path d="M0,110 L30,90 60,95 90,70 120,80 150,50 180,60 210,40 240,55 270,30 300,45 320,20 L320,140 L0,140 Z"
        fill="url(#area1)"/>
      <path d="M0,110 L30,90 60,95 90,70 120,80 150,50 180,60 210,40 240,55 270,30 300,45 320,20"
        stroke="url(#areaLine)" strokeWidth="2" fill="none"/>
      <circle cx="270" cy="30" r="4" fill="#E8CB8B"/>
      <circle cx="270" cy="30" r="8" fill="#E8CB8B" opacity=".2"/>
      {['Пн','Вт','Ср','Чт','Пт','Сб','Вс'].map((d,i) => (
        <text key={d} x={20 + i*46} y="138" fill="#6E685E" fontSize="9" fontFamily="Inter">{d}</text>
      ))}
    </svg>
  )
}

export default function StatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [period, setPeriod] = useState('Неделя')

  useEffect(() => {
    let cancelled = false
    const fetchStats = async () => {
      try {
        const res = await fetch(`${GAS_URL}?action=stats`)
        const data = await res.json()
        if (!cancelled && data.status === 'ok') {
          setStats(data.stats)
          setError('')
        }
      } catch {
        if (!cancelled) setError('Нет соединения')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchStats()
    const interval = setInterval(fetchStats, 60000)
    return () => { cancelled = true; clearInterval(interval) }
  }, [])

  const displayStats = stats?.week || stats?.today || {}

  return (
    <div className="app-screen">
      <div className="screen-header">
        <div>
          <div className="eyebrow">АНАЛИТИКА</div>
          <div className="h3 serif">Статистика</div>
        </div>
        <div className="head-actions">
          <button className="btn btn--icon"><IconArchive width={17} height={17}/></button>
        </div>
      </div>

      <div style={{ padding: '0 20px 12px' }}>
        <div className="segmented" style={{ width: '100%', display: 'flex' }}>
          {['День', 'Неделя', 'Месяц', 'Год'].map(p => (
            <button
              key={p}
              className={'segmented__opt' + (period === p ? ' segmented__opt--active' : '')}
              style={{ flex: 1, textAlign: 'center' }}
              onClick={() => setPeriod(p)}
            >{p}</button>
          ))}
        </div>
      </div>

      <div className="screen-scroll">
        <div className="card card--gold" style={{ padding: 20, marginTop: 4, marginBottom: 18 }}>
          <div className="eyebrow" style={{ color: 'var(--gold-2)' }}>ВЫРУЧКА · {period.toUpperCase()}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 6 }}>
            <div className="serif gold-text" style={{ fontSize: 40, letterSpacing: '-0.02em', lineHeight: 1 }}>
              {displayStats.revenue ? `${displayStats.revenue.toLocaleString('ru-RU')} ₽` : '0 ₽'}
            </div>
          </div>
          <div className="small" style={{ marginTop: 6 }}>
            {displayStats.orders || 0} заказов · сред. {displayStats.avg ? Math.round(displayStats.avg) : 0} ₽
          </div>
          <div style={{ marginTop: 14 }}>
            <AreaChart/>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }}>
          <div className="kpi">
            <div className="kpi__head">
              <div className="kpi__label">Заказов</div>
              <DonutMini value={78} color="#D4AF6E"/>
            </div>
            <div className="kpi__value serif" style={{ marginTop: 4 }}>{displayStats.orders || 0}</div>
          </div>
          <div className="kpi">
            <div className="kpi__head">
              <div className="kpi__label">Средний чек</div>
              <DonutMini value={62} color="#7FA5C4"/>
            </div>
            <div className="kpi__value serif" style={{ marginTop: 4 }}>{displayStats.avg ? `${Math.round(displayStats.avg)} ₽` : '0 ₽'}</div>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
          <div className="serif" style={{ fontSize: 17 }}>Топ <span className="gold-text" style={{ fontStyle: 'italic' }}>позиции</span></div>
          <div className="micro">{period.toLowerCase()}</div>
        </div>
        <div className="card" style={{ padding: 8 }}>
          {error ? (
            <p style={{ color: 'var(--error)', fontSize: 13, textAlign: 'center', padding: 16 }}>{error}</p>
          ) : loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: 10 }}>
              {[1,2,3].map(i => <div key={i} className="shimmer" style={{ height: 50, borderRadius: 10 }}/>)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <p className="small">Нет данных за период</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
