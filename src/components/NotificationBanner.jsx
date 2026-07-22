import { useState, useEffect } from 'react'
import {
  isPushReady,
  isPushSupported,
  isSubscribed,
  subscribeToPush,
} from '../utils/push'

export default function NotificationBanner() {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem('gs_notif_dismissed') === 'true'
  })

  useEffect(() => {
    if (dismissed || !isPushReady()) return

    isSubscribed().then((sub) => {
      if (!sub) setVisible(true)
    })
  }, [dismissed])

  const handleSubscribe = async () => {
    setLoading(true)
    try {
      await subscribeToPush()
      setVisible(false)
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = () => {
    setVisible(false)
    setDismissed(true)
    localStorage.setItem('gs_notif_dismissed', 'true')
  }

  if (!visible) return null

  return (
    <div className="mx-4 mb-4 p-4 bg-card border border-gold/20 rounded-xl">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0 mt-0.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D4AF37"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 01-3.46 0" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] text-text font-medium mb-1">
            Уведомления о заказах
          </p>
          <p className="text-[12px] text-muted mb-3">
            Получайте push-уведомления когда клиент оформит заказ
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSubscribe}
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-gold text-dark text-[12px] font-medium
                         active:bg-goldSoft transition-colors disabled:opacity-50"
            >
              {loading ? 'Включаем...' : 'Включить'}
            </button>
            <button
              onClick={handleDismiss}
              className="px-4 py-2 rounded-lg text-muted text-[12px] font-medium
                         hover:text-text transition-colors"
            >
              Позже
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
