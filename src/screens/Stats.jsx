import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight, Banknote, Receipt, ShoppingBag, TrendingDown, Wallet } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { SectionLabel } from '../components/ui/SectionLabel'
import { TopBar, RefreshButton } from '../components/TopBar'
import { SegmentTabs } from '../components/SegmentTabs'
import { AreaChart } from '../components/charts/AreaChart'
import { BarChart } from '../components/charts/BarChart'
import { DonutChart } from '../components/charts/DonutChart'
import { ProgressBar } from '../components/charts/ProgressBar'
import { STATS, formatMoney, formatMoneyShort } from '../lib/data'

function Kpi({ icon: Icon, label, value, delta, up = true, color }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="grid h-9 w-9 place-items-center rounded-xl" style={{ backgroundColor: color + '1f', color }}>
          <Icon size={17} />
        </div>
        <span className={`inline-flex items-center gap-0.5 text-[12px] font-bold ${up ? 'text-success-500' : 'text-error-500'}`}>
          {up ? <ArrowUpRight size={13} /> : <ArrowDownRight size={13} />} {delta}
        </span>
      </div>
      <p className="mt-3 text-xl font-extrabold tracking-tight text-content">{value}</p>
      <p className="text-[12px] font-semibold text-content-muted">{label}</p>
    </Card>
  )
}

export function Stats({ orders, doRefresh }) {
  const [period, setPeriod] = useState('week')

  const donut = [
    { label: 'Активные', value: orders.filter((o) => ['new', 'accepted', 'cooking'].includes(o.statusKey)).length, color: '#6d4ff6' },
    { label: 'В доставке', value: orders.filter((o) => o.statusKey === 'delivering').length, color: '#3d8bfd' },
    { label: 'Завершено', value: orders.filter((o) => o.statusKey === 'completed').length, color: '#10bf7e' },
  ]
  const totalOrders = donut.reduce((s, d) => s + d.value, 0) || 1
  const maxProd = Math.max(...STATS.topProducts.map((p) => p.count))

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <TopBar title="Статистика" subtitle="Аналитика и отчёты" actions={<RefreshButton onClick={doRefresh} />} />

      <div className="no-scrollbar flex-1 overflow-y-auto px-5 pb-28 pt-1">
        <div className="mb-4 inline-flex rounded-2xl border border-line bg-surface p-1">
          <SegmentTabs
            options={[
              { key: 'day', label: 'День' },
              { key: 'week', label: 'Неделя' },
              { key: 'month', label: 'Месяц' },
            ]}
            value={period}
            onChange={setPeriod}
          />
        </div>

        <Card className="overflow-hidden p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[13px] font-semibold text-content-muted">Выручка за период</p>
              <motion.p key={period} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-1 text-[1.9rem] font-extrabold leading-none tracking-tight text-content">
                {formatMoney(period === 'day' ? STATS.salesToday : period === 'week' ? STATS.salesWeek : STATS.salesMonth)}
              </motion.p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success-500/12 px-2.5 py-1 text-[12px] font-bold text-success-600">
              <ArrowUpRight size={13} /> +{period === 'day' ? 12.4 : period === 'week' ? 8.1 : 21.6}%
            </span>
          </div>
          <div className="mt-2 -mx-1">
            <AreaChart data={STATS.weekly} color="#6d4ff6" height={150} />
          </div>
        </Card>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <Kpi icon={Wallet} label="Прибыль" value={formatMoneyShort(STATS.profitToday)} delta="9,2%" color="#10bf7e" />
          <Kpi icon={ShoppingBag} label="Заказов" value={`${STATS.ordersToday}`} delta="5,1%" color="#3d8bfd" />
          <Kpi icon={Receipt} label="Средний чек" value={formatMoney(STATS.avgCheck)} delta="3,4%" color="#8450f0" />
          <Kpi icon={TrendingDown} label="Отмены" value={`${STATS.cancelRate}%`} delta="1,1%" up={false} color="#ff4d5e" />
        </div>

        <div className="mt-6">
          <SectionLabel className="mb-3 block">Заказы по часам</SectionLabel>
          <Card className="p-5">
            <BarChart data={STATS.hourly} color="#6d4ff6" height={140} />
          </Card>
        </div>

        {totalOrders > 0 && (
          <div className="mt-6">
            <SectionLabel className="mb-3 block">Структура заказов</SectionLabel>
            <Card className="flex items-center gap-5 p-5">
              <DonutChart segments={donut.filter((d) => d.value > 0)} centerValue={`${totalOrders}`} centerLabel="заказов" />
              <div className="flex-1 space-y-2.5">
                {donut.map((d) => (
                  <div key={d.label} className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="flex-1 text-[13px] font-semibold text-content-soft">{d.label}</span>
                    <span className="text-[13px] font-bold text-content">{d.value}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        <div className="mt-6">
          <SectionLabel className="mb-3 block">Популярные товары</SectionLabel>
          <Card className="space-y-4 p-5">
            {STATS.topProducts.map((p, i) => (
              <div key={p.name}>
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-[14px] font-semibold text-content">{p.name}</span>
                  <span className="text-[13px] font-bold text-content-muted">{p.count} продаж</span>
                </div>
                <ProgressBar value={(p.count / maxProd) * 100} color={p.color} delay={i * 0.1} />
              </div>
            ))}
          </Card>
        </div>

        <div className="mt-4 flex items-center gap-2 px-1 text-[12px] font-medium text-content-muted">
          <Banknote size={14} /> Данные обновлены · демо-отчёт
        </div>
      </div>
    </motion.div>
  )
}
