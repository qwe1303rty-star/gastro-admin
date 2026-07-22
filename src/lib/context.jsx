import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { PIN_CODE, PUSH_SERVER_URL, VAPID_PUBLIC_KEY } from '../config'
import {
  STATUSES, STATUS_MAP, statusToKey, keyToStatus, nextStatus,
  formatMoney, DASHBOARD_CARDS, STATS, SEED_NOTIFICATIONS,
} from './data'
import { subscribeToPush, unsubscribeFromPush, isPushReady } from '../utils/push'

const Ctx = createContext(null)

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

function playChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext
    const ac = new AC()
    if (ac.state === 'suspended') ac.resume()
    const now = ac.currentTime
    ;[880, 1174.7].forEach((freq, i) => {
      const osc = ac.createOscillator()
      const gain = ac.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq
      const start = now + i * 0.14
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(0.07, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.45)
      osc.connect(gain).connect(ac.destination)
      osc.start(start)
      osc.stop(start + 0.5)
    })
  } catch {}
}

function parseOrders(rawOrders) {
  return rawOrders.map((o) => {
    let customer = { name: 'Клиент', phone: '', address: '', comment: '' }
    let items = []
    try { customer = JSON.parse(o.customer_json || '{}') } catch {}
    try { items = JSON.parse(o.items_json || '[]') } catch {}
    return {
      id: o.id,
      status: o.status,
      statusKey: statusToKey(o.status),
      created_at: new Date(o.created_at).getTime(),
      customer,
      items,
      total: o.total || 0,
      payment: o.payment || 'card',
    }
  })
}

export function AppProvider({ children }) {
  const [phase, setPhase] = useState('splash')
  const [tab, setTab] = useState('home')
  const [activeOrderId, setActiveOrderId] = useState(null)
  const [orders, setOrders] = useState([])
  const [notifications, setNotifications] = useState(SEED_NOTIFICATIONS)
  const [toast, setToast] = useState(null)
  const [settings, setSettings] = useState({ push: true, sound: true, autoAccept: false })
  const [refreshToken, setRefreshToken] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isAuth, setIsAuth] = useState(() => sessionStorage.getItem('gs_admin_auth') === 'true')
  const [pageDirection, setPageDirection] = useState(1)

  const lastPollRef = useRef(Date.now())
  const pollTimerRef = useRef(null)

  const unread = useMemo(() => notifications.filter((n) => !n.read).length, [notifications])

  const navigate = useCallback((t) => {
    setPageDirection(1)
    setTab(t)
    setActiveOrderId(null)
  }, [])

  const openOrder = useCallback((id) => setActiveOrderId(id), [])
  const closeOrder = useCallback(() => setActiveOrderId(null), [])

  const login = useCallback((pin) => {
    if (pin === PIN_CODE) {
      sessionStorage.setItem('gs_admin_auth', 'true')
      setIsAuth(true)
      setPhase('app')
      return true
    }
    return false
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('gs_admin_auth')
    setIsAuth(false)
    setTab('home')
    setActiveOrderId(null)
    setPhase('auth')
  }, [])

  const markAllRead = useCallback(() => setNotifications((prev) => prev.map((n) => ({ ...n, read: true }))), [])
  const markRead = useCallback((id) => setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n))), [])
  const dismissToast = useCallback(() => setToast(null), [])
  const updateSettings = useCallback((s) => setSettings((prev) => ({ ...prev, ...s })), [])

  const updateOrderStatus = useCallback((id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status, statusKey: statusToKey(status) } : o)))
  }, [])

  const advanceOrder = useCallback((id) => {
    setOrders((prev) => prev.map((o) => {
      if (o.id !== id) return o
      const currentStatusName = Object.entries(STATUS_MAP).find(([, v]) => v.key === o.statusKey)?.[0]
      const nx = nextStatus(o.statusKey)
      if (!nx) return o
      const newStatusName = keyToStatus(nx)
      return { ...o, status: newStatusName, statusKey: nx }
    }))
  }, [])

  const simulateNewOrder = useCallback(() => {
    const demoPool = [
      {
        customer: { name: 'Тимур Алиев', phone: '+7 (909) 224 15 80', address: 'ул. Малая Бронная, 9, кв. 14', comment: 'Доставить после 19:00.' },
        items: [{ name: 'Боул с лососем', qty: 1, price: 649 }, { name: 'Смузи боул', qty: 1, price: 389 }],
        payment: 'online',
      },
      {
        customer: { name: 'Юлия Громова', phone: '+7 (916) 700 33 12', address: 'Садовая-Кудринская, 21, кв. 5' },
        items: [{ name: 'Пицца Пепперони', qty: 1, price: 799 }, { name: 'Лимонад', qty: 2, price: 189 }],
        payment: 'card',
      },
      {
        customer: { name: 'Роман Захаров', phone: '+7 (925) 118 90 04', address: 'Земляной вал, 50, кв. 77' },
        items: [{ name: 'Сет «Большой праздник»', qty: 1, price: 2190 }, { name: 'Соус унаги', qty: 2, price: 99 }],
        payment: 'online',
      },
    ]
    const pick = demoPool[Math.floor(Math.random() * demoPool.length)]
    const id = `GS-${String(Math.floor(Math.random() * 9000) + 1000)}`
    const total = pick.items.reduce((s, it) => s + it.price * it.qty, 0)
    const order = {
      id,
      status: 'Новый',
      statusKey: 'new',
      created_at: Date.now(),
      customer: pick.customer,
      items: pick.items,
      total,
      payment: pick.payment,
    }
    setOrders((prev) => [order, ...prev])
    const notif = {
      id: `n-${id}`,
      type: 'order',
      title: `Новый заказ #${id}`,
      body: `${pick.customer.name} · ${formatMoney(total)}`,
      orderId: id,
      createdAt: Date.now(),
      read: false,
    }
    setNotifications((prev) => [notif, ...prev])
    setToast({ id, title: `Новый заказ #${id}`, body: `${pick.customer.name} · ${formatMoney(total)}`, orderId: id })
    if (settings.sound) playChime()
    window.setTimeout(() => setToast((t) => (t && t.id === id ? null : t)), 5200)
  }, [settings.sound])

  const fetchOrders = useCallback(async (isPolling = false) => {
    try {
      if (!isPolling) setLoading(true)
      const since = isPolling ? lastPollRef.current : 0
      const resp = await fetch(
        `https://script.google.com/macros/s/AKfycbw9-hE3O6DvuXW1oVddqFZpaYBXuzIGIWeO7y7NNzgYAfMQLA1MqW0gBNoY-a12Hxv6zg/exec?since=${since}`
      )
      if (!resp.ok) throw new Error('Network error')
      const data = await resp.json()
      if (data.error) throw new Error(data.error)

      if (data.orders && data.orders.length > 0) {
        const parsed = parseOrders(data.orders)
        setOrders((prev) => {
          const map = new Map(prev.map((o) => [o.id, o]))
          parsed.forEach((o) => {
            const existing = map.get(o.id)
            if (!existing) {
              map.set(o.id, o)
              const notif = {
                id: `n-${o.id}`,
                type: 'order',
                title: `Новый заказ #${o.id}`,
                body: `${o.customer.name} · ${formatMoney(o.total)}`,
                orderId: o.id,
                createdAt: Date.now(),
                read: false,
              }
              setNotifications((prev) => [notif, ...prev])
              setToast({
                id: o.id,
                title: `Новый заказ #${o.id}`,
                body: `${o.customer.name} · ${formatMoney(o.total)}`,
                orderId: o.id,
              })
              if (settings.sound) playChime()
              window.setTimeout(() => setToast((t) => (t && t.id === o.id ? null : t)), 5200)
            } else if (existing.statusKey !== o.statusKey) {
              map.set(o.id, o)
            }
          })
          return Array.from(map.values())
        })
      }
      lastPollRef.current = Date.now()
    } catch (err) {
      if (!isPolling) setError(err.message)
    } finally {
      if (!isPolling) setLoading(false)
    }
  }, [settings.sound])

  const doRefresh = useCallback(async () => {
    setRefreshToken((n) => n + 1)
    await fetchOrders(false)
  }, [fetchOrders])

  useEffect(() => {
    if (phase !== 'app' || !isAuth) return
    fetchOrders(false)
    pollTimerRef.current = setInterval(() => fetchOrders(true), 30000)
    return () => clearInterval(pollTimerRef.current)
  }, [phase, isAuth, fetchOrders])

  const value = {
    phase, setPhase, tab, navigate, activeOrderId, openOrder, closeOrder,
    orders, setOrders, notifications, unread, toast, dismissToast,
    isAuth, login, logout, loading, error,
    settings, updateSettings,
    updateOrderStatus, advanceOrder,
    markAllRead, markRead,
    simulateNewOrder, doRefresh, fetchOrders,
    refreshToken, pageDirection,
  }

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
