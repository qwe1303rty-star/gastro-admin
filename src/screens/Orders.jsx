import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { PackageSearch } from 'lucide-react'
import { TopBar, RefreshButton } from '../components/TopBar'
import { SearchInput } from '../components/SearchInput'
import { SegmentTabs } from '../components/SegmentTabs'
import { OrderCard } from '../components/OrderCard'
import { PullToRefresh } from '../components/PullToRefresh'
import { EmptyState } from '../components/EmptyState'

const FILTERS = {
  all: { label: 'Все', keys: null },
  new: { label: 'Новые', keys: ['new'] },
  active: { label: 'Активные', keys: ['accepted', 'cooking'] },
  delivering: { label: 'Доставка', keys: ['delivering'] },
  completed: { label: 'Завершено', keys: ['completed'] },
}

export function Orders({ orders, openOrder, doRefresh, refreshToken }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')

  const sorted = useMemo(() => [...orders].sort((a, b) => b.created_at - a.created_at), [orders])

  const tabs = useMemo(() => [
    { key: 'all', label: 'Все', count: sorted.length },
    { key: 'new', label: 'Новые', count: sorted.filter((o) => o.statusKey === 'new').length },
    { key: 'active', label: 'Активные', count: sorted.filter((o) => ['accepted', 'cooking'].includes(o.statusKey)).length },
    { key: 'delivering', label: 'Доставка', count: sorted.filter((o) => o.statusKey === 'delivering').length },
    { key: 'completed', label: 'Завершено', count: sorted.filter((o) => o.statusKey === 'completed').length },
  ], [sorted])

  const filtered = useMemo(() => {
    const keys = FILTERS[filter]?.keys
    const q = query.trim().toLowerCase()
    return sorted.filter((o) => {
      const statusOk = !keys || keys.includes(o.statusKey)
      const searchOk = !q || o.id.toLowerCase().includes(q) || o.customer.name.toLowerCase().includes(q) || (o.customer.phone || '').includes(q)
      return statusOk && searchOk
    })
  }, [sorted, filter, query])

  return (
    <motion.div
      initial={{ opacity: 0, x: 14 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -14 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="absolute inset-0 flex flex-col"
    >
      <TopBar title="Заказы" subtitle={`${sorted.length} заказов всего`} actions={<RefreshButton onClick={doRefresh} />} />
      <div className="space-y-3 px-5 pb-1">
        <SearchInput value={query} onChange={setQuery} />
        <SegmentTabs options={tabs} value={filter} onChange={setFilter} />
      </div>

      <PullToRefresh onRefresh={doRefresh}>
        <div className="space-y-3 px-5 pb-28 pt-3" key={refreshToken}>
          {filtered.length === 0 ? (
            <EmptyState icon={PackageSearch} title="Заказы не найдены" body="Измените фильтр или поисковый запрос" />
          ) : (
            filtered.map((order, i) => (
              <OrderCard key={order.id} order={order} index={i} onClick={() => openOrder(order.id)} />
            ))
          )}
        </div>
      </PullToRefresh>
    </motion.div>
  )
}
