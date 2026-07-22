export const STATUSES = ['Новый', 'Принят', 'Готовится', 'В доставке', 'Доставлен']

export const STATUS_MAP = {
  'Новый':      { key: 'new',         color: '#FF6A45', soft: 'rgba(255,106,69,0.12)',  label: 'Новый',      dot: true },
  'Принят':     { key: 'accepted',    color: '#6D4FF6', soft: 'rgba(109,79,246,0.12)',  label: 'Принят',     dot: true },
  'Готовится':  { key: 'cooking',     color: '#3D8BFD', soft: 'rgba(61,139,253,0.12)',  label: 'Готовится',  dot: true },
  'В доставке': { key: 'delivering',  color: '#FFA51F', soft: 'rgba(255,165,31,0.12)',  label: 'В доставке', dot: true },
  'Доставлен':  { key: 'completed',   color: '#10BF7E', soft: 'rgba(16,191,126,0.12)',  label: 'Доставлен',  dot: false },
}

export const PIPELINE = ['new', 'accepted', 'cooking', 'delivering', 'completed']

export const PIPELINE_LABELS = {
  new: 'Новый',
  accepted: 'Принят',
  cooking: 'Готовится',
  delivering: 'В доставке',
  completed: 'Доставлен',
}

export const PIPELINE_COLORS = {
  new: '#FF6A45',
  accepted: '#6D4FF6',
  cooking: '#3D8BFD',
  delivering: '#FFA51F',
  completed: '#10BF7E',
}

export function statusToKey(status) {
  return STATUS_MAP[status]?.key || 'new'
}

export function keyToStatus(key) {
  return Object.entries(STATUS_MAP).find(([, v]) => v.key === key)?.[0] || 'Новый'
}

export function nextStatus(statusKey) {
  const idx = PIPELINE.indexOf(statusKey)
  if (idx < 0 || idx >= PIPELINE.length - 1) return null
  return PIPELINE[idx + 1]
}

export function isTerminal(statusKey) {
  return statusKey === 'completed'
}

export function formatMoney(n) {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumFractionDigits: 0 }).format(n)
}

export function formatMoneyShort(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M ₽'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K ₽'
  return formatMoney(n)
}

export function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now - d
  const diffMin = Math.floor(diffMs / 60000)
  if (diffMin < 1) return 'Только что'
  if (diffMin < 60) return `${diffMin} мин назад`
  const diffH = Math.floor(diffMin / 60)
  if (diffH < 24) return `${diffH} ч назад`
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

export function clockTime(ts) {
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

export const PAYMENT_LABEL = {
  card: 'Картой',
  online: 'Онлайн',
  cash: 'Наличными',
}

export const DASHBOARD_CARDS = [
  { key: 'new',       statuses: ['Новый'],       color: '#FF6A45', label: 'Новые' },
  { key: 'accepted',  statuses: ['Принят'],      color: '#6D4FF6', label: 'В работе' },
  { key: 'cooking',   statuses: ['Готовится'],   color: '#3D8BFD', label: 'Готовятся' },
  { key: 'delivering', statuses: ['В доставке'], color: '#FFA51F', label: 'Доставляются' },
  { key: 'completed', statuses: ['Доставлен'],   color: '#10BF7E', label: 'Завершено' },
  { key: 'cancelled', statuses: ['Отменён'],     color: '#FF4D5E', label: 'Отменено' },
]

export const STATS = {
  salesToday: 48670,
  salesWeek: 312450,
  salesMonth: 1247800,
  ordersToday: 34,
  profitToday: 18200,
  avgCheck: 1432,
  cancelRate: 3.2,
  weekly: [
    { label: 'Пн', value: 32000 },
    { label: 'Вт', value: 28500 },
    { label: 'Ср', value: 41200 },
    { label: 'Чт', value: 38900 },
    { label: 'Пт', value: 52400 },
    { label: 'Сб', value: 48670 },
    { label: 'Вс', value: 35100 },
  ],
  hourly: [
    { label: '10', value: 2 }, { label: '11', value: 5 }, { label: '12', value: 8 },
    { label: '13', value: 6 }, { label: '14', value: 4 }, { label: '15', value: 3 },
    { label: '16', value: 2 }, { label: '17', value: 5 }, { label: '18', value: 9 },
    { label: '19', value: 7 }, { label: '20', value: 4 }, { label: '21', value: 2 },
  ],
  topProducts: [
    { name: 'Ролл «Калифорния»', count: 47, color: '#6D4FF6' },
    { name: 'Пицца Пепперони', count: 38, color: '#3D8BFD' },
    { name: 'Боул с лососем', count: 29, color: '#10BF7E' },
    { name: 'Лимонад домашний', count: 25, color: '#FFA51F' },
    { name: 'Десерт Тирамису', count: 18, color: '#FF6A45' },
  ],
}

export const SEED_NOTIFICATIONS = [
  { id: 'n1', type: 'order',  title: 'Новый заказ #GS-0127',      body: 'Анна Смирнова · 2 450 ₽', orderId: 'GS-0127', createdAt: Date.now() - 300000, read: false },
  { id: 'n2', type: 'status', title: 'Заказ #GS-0125 доставлен',  body: 'Курьер доставил заказ клиенту', orderId: 'GS-0125', createdAt: Date.now() - 1800000, read: false },
  { id: 'n3', type: 'order',  title: 'Новый заказ #GS-0126',      body: 'Дмитрий Козлов · 1 890 ₽', orderId: 'GS-0126', createdAt: Date.now() - 3600000, read: true },
  { id: 'n4', type: 'system', title: 'Система обновлена',          body: 'Версия 3.0 — новый дизайн', orderId: null, createdAt: Date.now() - 7200000, read: true },
]
