import { useState, useEffect } from 'react'
import GAS_URL from '../config'

function StatCard({ label, stat }) {
  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <p className="text-[11px] uppercase tracking-wider text-muted mb-3">{label}</p>
      <p className="text-[28px] font-medium text-text mb-1">
        {stat.revenue ? `${stat.revenue.toLocaleString('ru-RU')} ₽` : '0 ₽'}
      </p>
      <div className="flex items-center gap-4 text-[12px] text-muted">
        <span>{stat.orders || 0} заказов</span>
        <span>сред. {stat.avg ? `${Math.round(stat.avg)}` : '0'} ₽</span>
      </div>
    </div>
  )
}

export default function StatsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-red-400 text-[13px] py-20">{error}</p>
  }

  return (
    <div className="px-4 pt-4 flex flex-col gap-4">
      <h2 className="text-[18px] font-medium text-text">Статистика</h2>
      {stats && (
        <>
          <StatCard label="Сегодня" stat={stats.today || {}} />
          <StatCard label="Эта неделя" stat={stats.week || {}} />
          <StatCard label="Этот месяц" stat={stats.month || {}} />
        </>
      )}
    </div>
  )
}
